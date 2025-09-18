<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { ref, onMounted, computed } from 'vue'
import AppRightFromCatalaogComponent from '@/components/AppRightFormCatalogComponent.vue'
import AppDataTableComponent from '@/components/AppDataTableComponent.vue'
import AppDialogComponent from '@/components/AppDialogComponent.vue'
import AppButtonActionTableComponent from '@/components/AppButtonActionTableComponent.vue'
import AppLoaderComponent from '@/components/AppLoaderComponent.vue'
import useUtilsStore from '@/store/utils'
import { useRouter } from 'vue-router'

const { xs, sm, md, lg, xl } = useDisplay()
const display = ref(useDisplay())
const router = useRouter()
const utils = useUtilsStore()

// --- Paginación manual ---
const page = ref(1) // Variable que controla la página actual
const itemsPerPage = ref(5) // Cantidad de elementos por página

// --- Datos de la tabla de ejemplo (simula una respuesta del backend) ---
const items = ref([
  { codigo: '001', nombre_clase: 'Clase de Programación', grupo_pertenece:'001 - Grupo de Desarrollo', register_by: 'Aquiles Vengo', estado: 'ACTIVO' },
  { codigo: '002', nombre_clase: 'Clase de Marketing', grupo_pertenece: '002 - Grupo de Marketing' , register_by: 'Marta Rillo', estado: 'INACTIVO' },
  { codigo: '003', nombre_clase: 'Clase de Pruebas', grupo_pertenece: '003- Grupo de Desarrollo' , register_by: 'Carlos Sáncez', estado: 'INACTIVO', isNew: true },
  { codigo: '004', nombre_clase: 'Clase de Diseño', grupo_pertenece: '004 - Grupo de Diseño' , register_by: 'Ana Lisis', estado: 'ACTIVO' },
  { codigo: '005', nombre_clase: 'Clase de Proyectos', grupo_pertenece: '005 - Grupo de Marketing' , register_by: 'Pedro Picapiedra', estado: 'INACTIVO' },
])

// Datos de ejemplo para el select de Grupos
const grupos = ref ([
  { codigo: '001', nombre: "Grupo de Desarrollo"},
  { codigo: '002', nombre: "Grupo de Marketing" },
  { codigo: '003', nombre: "Grupo Nuevo"},
  { codigo: '004', nombre: "Grupo de Pruebas"},
  { codigo: '005', nombre: "Grupo de Diseño"}
])

// Propiedad computada para formatear los datos del select
const gruposDisplay = computed(() => grupos.value.map(g => ({
  ...g, 
  // Usa backticks (``) para que el template literal se evalúe correctamente
  displayName:  `${g.codigo} - ${g.nombre}`
}))
)

// Cabeceras para la tabla v-data-table
const headers = [
  { title: 'Código', align: 'center', key: 'codigo' },
  { title: 'Nombre de la clase', align: 'center', key: 'nombre_clase' },
  { title: 'Grupo al que pertenece', align: 'center', key: 'grupo_pertenece' },
  { title: 'Registrado por', align: 'center', key: 'register_by' },
  { title: 'Estado', align: 'center', value: 'estado' },
  { title: 'Acciones', value: 'actions', align: 'center', sortable: false }
]

// Lógica del Formulario de Registro 
const formRef = ref(null)
const nombreClase = ref('')
const codigoClase = ref('')
const grupoSeleccionado = ref(null)
const search = ref('')

const reglasNombre = [
  v => !!v || 'El nombre es obligatorio',
  v => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(v) || 'Solo se permiten letras, tildes, y espacios',
  v => v.length <= 20 || 'Máximo 20 caracteres',
]

const reglasCodigo = [
  v => !!v || 'El código es obligatorio',
  v => /^\d+$/.test(v) || 'Solo se permiten números',
  v => v.length <= 5 || 'Máximo 5 caracteres',
]

const reglasGrupo = [
  v => !!v || 'El grupo es obligatorio'
]

const agregarClase = async () => {
  const { valid } = await formRef.value.validate()
  if (valid) {
    utils.loader = true;
    
    // Simula una llamada al backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Encuentra el objeto de grupo completo para agregarlo a los ítems
    const grupoInfo = grupos.value.find(g => g.codigo === grupoSeleccionado.value);

    const newClass = {
      codigo: codigoClase.value,
      nombre_clase: nombreClase.value,
      grupo_pertenece: `${grupoInfo.codigo} - ${grupoInfo.nombre}`,
      register_by: 'Usuario Logueado',
      estado: 'INACTIVO',
      isNew: true
    }
    items.value.push(newClass)

    // Navega a la última página al agregar un nuevo elemento
    const totalItemsCount = items.value.length
    const lastPage = Math.ceil(totalItemsCount / itemsPerPage.value)
    page.value = lastPage

    // Limpia el formulario
    nombreClase.value = ''
    codigoClase.value = ''
    grupoSeleccionado.value = null // Limpia el valor del select
    formRef.value.resetValidation()

    utils.loader = false;
  }
}

// --- Lógica de la Tabla y Búsqueda ---
const reglasBusqueda = [
  v => !v || v.length <= 50 || 'Máximo 50 caracteres',
  v => !v || /^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9\s]+$/.test(v) || 'Solo letras, números y tildes',
]

const filteredItemsBySearch = computed(() => {
  let term = search.value.trim()

  // Si no hay búsqueda o menos de 3 caracteres, devolver todos
  if (term.length < 3) return items.value

  // Filtrar por código, nombre de clase o grupo
  return items.value.filter(item =>
    item.codigo.toLowerCase().includes(term.toLowerCase()) ||
    item.nombre_clase.toLowerCase().includes(term.toLowerCase()) ||
    item.grupo_pertenece.toLowerCase().includes(term.toLowerCase())
  )
})

// Esta propiedad computada aplica la PAGINACIÓN sobre los elementos ya filtrados
const paginatedItems = computed(() => {
  const startIndex = (page.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return filteredItemsBySearch.value.slice(startIndex, endIndex)
})

const totalFilteredItems = computed(() => filteredItemsBySearch.value.length)


// Lógica de Modales (Habilitar y Deshabilitar)
const showActivateModal = ref(false)
const showDeactivateModal = ref(false)
const justificacion = ref('')
const currentItem = ref(null)
const modalFormRef = ref(null)

const reglasJustificacion = [
  v => !!v || 'La justificación es obligatoria.'
]

const handleActivate = (item) => {
  currentItem.value = item
  showActivateModal.value = true
}

const handleDeactivate = (item) => {
  currentItem.value = item
  showDeactivateModal.value = true
}

const confirmDeactivate = async () => {
  const { valid } = await modalFormRef.value.validate();
  if (!valid) {
    return;
  }
  
  utils.loader = true;
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('Enviando al backend la justificación:', {
    id: currentItem.value.codigo,
    justificacion: justificacion.value,
    usuario: 'Usuario Logueado',
    fecha: new Date().toISOString()
  });

  const index = items.value.findIndex(i => i.codigo === currentItem.value.codigo);
  if (index !== -1) {
    items.value[index].estado = 'INACTIVO';
  }
  
  closeModals();
  utils.loader = false;
}

const confirmActivate = async () => {
    utils.loader = true;
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Enviando al backend la petición de activación:', {
        id: currentItem.value.codigo,
        usuario: 'Usuario Logueado',
        fecha: new Date().toISOString()
    });

    const index = items.value.findIndex(i => i.codigo === currentItem.value.codigo);
    if (index !== -1) {
        items.value[index].estado = 'ACTIVO';
    }

    closeModals();
    utils.loader = false;
};

const closeModals = () => {
  showActivateModal.value = false
  showDeactivateModal.value = false
  justificacion.value = ''
  if (modalFormRef.value) {
    modalFormRef.value.resetValidation();
  }
}

const handleDelete = (item) => {
  console.log('Eliminar registro:', item)
  items.value = items.value.filter(i => i.codigo !== item.codigo)
}

function regresarAcatalogos() {
  router.push({
    name: 'catalogos'
  })
}

onMounted(() => {})


</script>

<template>
  <div>
    <app-loader-component />
    <app-dialog-component
      :show="showActivateModal"
      title="Activar Registro"
      text-btn="Aceptar"
      @close="closeModals"
      @confirm="confirmActivate"
      custom-class="activate-modal"
    >
      <template #body>
        <p class="text-center bg-warningBackground pa-4 rounded" style="border: 1px solid #FFC107;">
          ¿Está seguro que desea activar el registro?<br>
          Una vez activado este no podrá eliminarse.
        </p>
      </template>
    </app-dialog-component>
    <app-dialog-component
      :show="showDeactivateModal"
      title="Desactivar Registro"
      text-btn="Aceptar"
      @close="closeModals"
      @confirm="confirmDeactivate"
    >
      <template #body>
        <v-form ref="modalFormRef">
          <p class="text-center bg-warningBackground pa-4 rounded" style="border: 1px solid #FFC107;">
          ¿Está seguro que desea inactivar el registro?</p>
          <v-textarea
            v-model="justificacion"
            label="Justificación"
            placeholder="Agregue una justificación de la acción"
            counter
            :rules="reglasJustificacion"
            maxlength="250"
            variant="solo"
            class="mt-4 custom-textarea-placeholder"
          ></v-textarea>
        </v-form>
      </template>
    </app-dialog-component>

    <v-sheet color="white" elevation="0" class="custom-sheet">
      <v-container fluid class="mb-8">
        <v-row justify="center" :class="display.xs || display.sm || display.md ? 'mb-8' : ''">
          <v-col cols="12" xl="4" lg="4" sm="12" md="4">
            <v-card
              :elevation="0"
              color="backgroundSection"
              class="px-7 py-7"
              style="border: 1px solid #6a83be; height: 100% !important"
            >
              <app-right-from-catalaog-component @submit="agregarClase">
                <template #myCatalog>
                  <v-form ref="formRef">
                    <v-text-field
                      v-model="nombreClase"
                      variant="solo"
                      label="Nombre de la clase: *"
                      :rules="reglasNombre"
                    ></v-text-field>
                    <v-text-field
                      v-model="codigoClase"
                      variant="solo"
                      label="Código de la clase: *"
                      :rules="reglasCodigo"
                    ></v-text-field>
                    <v-select
                      v-model="grupoSeleccionado"
                      :items="gruposDisplay"
                      item-title="displayName"
                      item-value="codigo"
                      label="Grupo al que pertenece: *"
                      variant="solo"
                      :rules="reglasGrupo"
                      autocomplete
                      clearable
                    ></v-select>
                  </v-form>
                </template>
              </app-right-from-catalaog-component>
            </v-card>
          </v-col>

          <v-col cols="12" xl="8" lg="8" sm="9" md="8">
            <v-card
              :elevation="0"
              color="backgroundSection"
              class="px-7 py-7"
              style="border: 1px solid #6a83be; height: 100% !important"
            >
              <v-row justify="center">
                <v-col cols="12" xl="12" lg="6" sm="12" md="12" xs="12" class="text-center">
                  <div class="bg-secondaryBackground py-2" style="border-radius: 7px;border: 1px solid #111E60;">
                    <p>Listado</p>
                  </div>
                </v-col>
                <v-col cols="12" xl="12" lg="10" sm="12" md="12" xs="12">
                  <v-text-field
                    v-model="search"
                    variant="solo"
                    label="Buscar"
                    append-inner-icon="mdi-magnify"
                    :rules="reglasBusqueda"
                    maxlength="50"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" xl="12" lg="12" sm="12" md="12" xs="12">
                  <app-data-table-component
                    :headers="headers"
                    :correlativo="false"
                    :items="paginatedItems"
                    :totalItems="totalFilteredItems"
                    :loading="false"
                    v-model:page="page"
                    :items-per-page="itemsPerPage"
                    :customHeader="true"
                  >
                    <template 
                    v-slot:item.grupo_pertenece="{ item }">
                      <span 
                      v-if="item.grupo_pertenece">
                      
                         {{ item.grupo_pertenece.codigo }} - {{ item.grupo_pertenece.nombre }}</span>
                    </template>
                    
                    <template v-slot:estado="{ item }">
                      <v-chip
                        label
                        size="small"
                        :style="item.estado === 'ACTIVO'
                          ? 'background: #E5FFE9; border: 1px solid #37AB47'
                          : 'background: #FFE5E5; border: 1px solid #FF4c4c'"
                      >
                        <span :style="item.estado === 'ACTIVO' ? 'color: #37AB47;' : 'color: #FF4c4c;'">
                          {{ item.estado }}
                        </span>
                      </v-chip>
                    </template>

                    <template v-slot:actions="{ item }">
                      <app-button-action-table-component
                        v-if="item.estado === 'INACTIVO' && item.isNew"
                        text="Eliminar"
                        icon="mdi-trash-can-outline"
                        size="small"
                        color="red"
                        @btnAction="handleDelete(item)"
                      />
                      <app-button-action-table-component
                        v-if="item.estado === 'INACTIVO'"
                        text="Habilitar registro"
                        icon="mdi-check-circle-outline"
                        size="small"
                        color="success"
                        @btnAction="handleActivate(item)"
                      />
                      <app-button-action-table-component
                        v-if="item.estado === 'ACTIVO'"
                        text="Deshabilitar registro"
                        icon="mdi-cancel"
                        size="small"
                        color="red"
                        @btnAction="handleDeactivate(item)"
                      />
                    </template>
                  </app-data-table-component>
                </v-col>

                <v-col cols="11" class="text-end">
                  <v-btn
                   color="primary" variant="outlined"
                    @click="regresarAcatalogos" class="custom-btn">Regresar</v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </div>
</template>

<style>
/* Estilos para el fondo del modal de activación */
.bg-warningBackground {
  background-color: #FFF3E0 !important;
}

/* Estilo para ajustar el placeholder del v-textarea */
.custom-textarea-placeholder .v-field__input::placeholder {
    visibility: visible;
    opacity: 1;
    color: inherit;
}

/* Estilo para el fondo de blanco de la pantalla */
.custom-sheet {
  min-height: calc(100vh - 90px) ;
  margin-top: -16px;
  padding: 16px;
}

/* Estilo del boton regresar*/
.custom-btn {
  background-color: white ! important;
}
</style>