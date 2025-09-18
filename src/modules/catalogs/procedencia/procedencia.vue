<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { ref, onMounted, computed } from 'vue'
import useUtilsStore from '@/store/utils'
import AppRightFromCatalaogComponent from '@/components/AppRightFormCatalogComponent.vue'
import AppDataTableComponent from '@/components/AppDataTableComponent.vue'
import AppDialogComponent from '@/components/AppDialogComponent.vue'
import AppButtonActionTableComponent from '@/components/AppButtonActionTableComponent.vue'
import AppLoaderComponent from '@/components/AppLoaderComponent.vue'
import { useRouter } from 'vue-router'

// Estado y lógicas
const { xs, sm, md, lg, xl } = useDisplay()
const display = ref(useDisplay())
const router = useRouter()
const utils = useUtilsStore()

// Paginación manual para la tabla
const page = ref(1)
const itemsPerPage = ref(5)
const items = ref([]) // Inicializamos la tabla vacía
const search = ref('')
const procedencia = ref('')

// Referencia al formulario de registro
const formRef = ref(null)

// Referencias y estados para los modales
const showActivateModal = ref(false)
const showDeactivateModal = ref(false)
const justificacion = ref('')
const currentItem = ref(null)
const modalFormRef = ref(null)

// Cabeceras para la tabla
const headers = ref([
  { title: 'Procedencia', align: 'start', key: 'procedencia' },
  { title: 'Registrado por', align: 'start', key: 'register_by' },
  { title: 'Estado', align: 'center', value: 'estado' },
  { title: 'Acciones', value: 'actions', align: 'center', sortable: false }
])

// Lógica de Validaciones 
const reglasprocedencia = [
  v => !!v || 'La Procedencia es obligatorio',
  v => (v && v.length <= 20) || 'El máximo es de 20 caracteres',
  v => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(v) || 'Solo se permiten letras y espacios',
]

const reglasBusqueda = [
  v => !v || v.length <= 50 || 'Máximo 50 caracteres',
  v => !v || /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(v) || 'Solo letras, tildes y espacios',
]

const reglasJustificacion = [
  v => !!v || 'La justificación es obligatoria.'
]


// Maneja la acción de agregar un nuevo registro
const agregarprocedencia = async () => {
  const { valid } = await formRef.value.validate()
  if (valid) {
    utils.loader = true; // Activa el loader
    
    // Simulación de una respuesta del backend (eliminar al conectar)
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newprocedencia = {
      procedencia: procedencia.value,
      register_by: 'Usuario Logueado', // Esto vendría del backend
      estado: 'INACTIVO', // por defecto
      isNew: true
    }
    items.value.push(newprocedencia)

    // MOVER a la última página automáticamente 
    const totalItemsCount = filteredItems.value.length // usa filteredItems (antes del slice)
    const lastPage = Math.max(1, Math.ceil(totalItemsCount / itemsPerPage.value))
    page.value = lastPage

    // Reinicia el formulario
    procedencia.value = ''
    formRef.value.resetValidation()

    utils.loader = false; // Desactiva el loader
  }
}

// Búsqueda y Paginación (lógica de la pantalla clase)
const filteredItems = computed(() => {
  let filtered = items.value;
  if (search.value.length >= 3) {
    const searchTerm = search.value.toLowerCase();
    filtered = filtered.filter(item =>
      item.procedencia.toLowerCase().includes(searchTerm)
    );
  }
  return filtered;
});

// Total (para controlar paginación)
const totalFilteredItems = computed(() => {
  return filteredItems.value.length;
});

// PAGINACIÓN EN EL PADRE: items que mostramos en la página actual 
const paginatedItems = computed(() => {
  const startIndex = (page.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return filteredItems.value.slice(startIndex, endIndex)
})


// Lógica de Modales y Acciones de la Tabla
const handleActivate = (item) => {
  currentItem.value = item
  showActivateModal.value = true
}

const handleDeactivate = (item) => {
  currentItem.value = item
  showDeactivateModal.value = true
}

const handleDelete = (item) => {
  console.log('Eliminando registro:', item)
  items.value = items.value.filter(i => i.procedencia !== item.procedencia)
}

const confirmDeactivate = async () => {
  const { valid } = await modalFormRef.value.validate();
  if (!valid) {
    return;
  }
  
  utils.loader = true;
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación

  const index = items.value.findIndex(i => i.procedencia === currentItem.value.procedencia);
  if (index !== -1) items.value[index].estado = 'INACTIVO';
  
  closeModals();
  utils.loader = false;
}

const confirmActivate = async () => {
    utils.loader = true;
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación

    const index = items.value.findIndex(i => i.procedencia === currentItem.value.procedencia);
    if (index !== -1) items.value[index].estado = 'ACTIVO';

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

function regresarAcatalogos() {
  router.push({
    name: 'catalogos'
  })
}


// Cargar datos iniciales
onMounted(async () => {
  utils.loader = true;
  // Simulación de carga (eliminar al conectar)
  await new Promise(resolve => setTimeout(resolve, 1000));
  items.value = [
    { procedencia: 'compra', register_by: 'Aquiles Vengo', estado: 'ACTIVO' },
    { procedencia: 'Donación', register_by: 'Marta Rillo', estado: 'INACTIVO' },
    { procedencia: 'Pertura', register_by: 'Ana Lisis', estado: 'ACTIVO' },
    { procedencia: 'compra dos', register_by: 'Ana Lisis', estado: 'INACTIVO' },
    
  ];
  utils.loader = false;
})
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
              <app-right-from-catalaog-component @submit="agregarprocedencia">
                <template #myCatalog>
                  <v-form ref="formRef">
                    <v-text-field
                      v-model="procedencia"
                      variant="solo"
                      label="Procedencia: *"
                      :rules="reglasprocedencia"
                    ></v-text-field>
                  </v-form>
                </template>
              </app-right-from-catalaog-component>
            </v-card>
          </v-col>

          <v-col cols="12" xl="8" lg="8" sm="12" md="8">
            <v-card
              :elevation="0"
              color="backgroundSection"
              class="px-7 py-7"
              style="border: 1px solid #6a83be"
            >
              <v-row justify="center">
                <v-col cols="12" xl="12" lg="6" sm="12" md="12" xs="12" class="text-center">
                  <div class="bg-secondaryBackground py-2 " style="border-radius: 7px; border: 1px solid #111E60;">
                    <p>Listado</p>
                  </div>
                </v-col>
                <v-col cols="12" xl="12" lg="10" sm="12" md="12" xs="12">
                  <v-text-field
                    v-model="search"
                    variant="solo"
                    label="Buscar"
                    placeholder="Ingrese procedencia"
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
                    :loading="utils.loader"
                    v-model:page="page"
                    :items-per-page="itemsPerPage"
                    :customHeader="true"
                  >
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