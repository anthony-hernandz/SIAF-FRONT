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
import procedenciasService from '@/services/procedencias.services' 

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
const showDeleteModal = ref(false)


// Cabeceras para la tabla
// Ajustamos las claves para que coincidan con la respuesta del backend
const headers = ref([
  { title: 'Procedencia', align: 'start', key: 'nombre' }, 
  { title: 'Registrado por', align: 'start', key: 'registro' }, 
  { title: 'Estado', align: 'center', key: 'estado' },
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

// Referencias y estados para el modal de edición
const showEditModal = ref(false);
const editFormRef = ref(null);
const editedProcedencia = ref({
  id: null,
  nombre: ''
});

// Maneja la acción de edición
const handleEdit = (item) => {
    // 1. Almacena el ítem seleccionado en editedProcedencia
    editedProcedencia.value = { ...item };
    // 2. Muestra el modal de edición
    showEditModal.value = true;
};

// Confirma y guarda los cambios de la edición
const confirmEdit = async () => {
    const { valid } = await editFormRef.value.validate();
    if (!valid) return;

    try {
        utils.loader = true;
        const payload = {
            nombre: editedProcedencia.value.nombre
        };
        
        // Llama a la función correcta de tu servicio
        await procedenciasService.actualizarProcedencia(editedProcedencia.value.id, payload);
        
        // Actualiza el registro en la lista local (optimista)
        const index = items.value.findIndex(i => i.id === editedProcedencia.value.id);
        if (index !== -1) {
            items.value[index].nombre = editedProcedencia.value.nombre;
        }

        closeModals();
        utils.showSuccess('Registro actualizado con éxito.');

    } catch (error) {
        console.error('Error al editar procedencia:', error);
        utils.showError?.('No se pudo actualizar el registro.');
    } finally {
        utils.loader = false;
    }
};

// Actualiza la función closeModals para ocultar el nuevo modal y limpiar la validación
const closeModals = () => {
    showActivateModal.value = false;
    showDeactivateModal.value = false;
    showEditModal.value = false; 
    showDeleteModal.value = false; 
    justificacion.value = '';
    if (modalFormRef.value) {
        modalFormRef.value.resetValidation();
    }
    if (editFormRef.value) { // <-- condicional para limpiar la validación del formulario de edición
        editFormRef.value.resetValidation();
    }
};

// Función para obtener los datos desde el backend
const obtenerProcedencias = async () => {
  utils.loader = true
  try {
    // La respuesta del servicio viene dentro de la propiedad 'data'
    const { data } = await procedenciasService.obtenerProcedencias()
    // Asignamos la lista de procedencias a 'items.value'
    items.value = data.procedencia ?? []
  } catch (error) {
    console.error('Error al obtener procedencias:', error)
  } finally {
    utils.loader = false
  }
}


// Maneja la acción de agregar un nuevo registro
const agregarprocedencia = async () => {
  const { valid } = await formRef.value.validate()
  if (valid) {
    utils.loader = true
    try {
      const payload = {
        nombre: procedencia.value,  
      }

      const { data } = await procedenciasService.crearProcedencia(payload)

      // agregar el registro devuelto a la tabla
      items.value.push(data)

      // llevar al usuario a la última página
      const totalItemsCount = filteredItems.value.length
      const lastPage = Math.max(1, Math.ceil(totalItemsCount / itemsPerPage.value))
      page.value = lastPage

      // limpiar formulario
      procedencia.value = ''
      formRef.value.resetValidation()
      utils.showSuccess('Procedencia agregada con exito.'); 

    } catch (error) {
      console.error('Error al crear procedencia:', error)
      utils.showError?.('No se pudo registrar la procedencia')
    } finally {
      utils.loader = false
    }
  }
}


// Búsqueda y Paginación (lógica de la pantalla clase)
const filteredItems = computed(() => {
  let filtered = items.value;
  if (search.value.length >= 3) {
    const searchTerm = search.value.toLowerCase();
    filtered = filtered.filter(item =>
      // Asegúrate de que esta clave coincida con tu backend
      item.nombre.toLowerCase().includes(searchTerm)
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
  // 1. Almacena el ítem actual en una variable de estado.
  currentItem.value = item;
  // 2. Cambia el estado para mostrar el modal.
  showActivateModal.value = true;
};


const handleDeactivate = (item) => {
  currentItem.value = item
  showDeactivateModal.value = true
}

const handleDelete = (item) => {
    currentItem.value = item;
    showDeleteModal.value = true;
};

// Crea la función para confirmar la eliminación
const confirmDelete = async () => {
    try {
        utils.loader = true;
        await procedenciasService.eliminarProcedencia(currentItem.value.id); 
        items.value = items.value.filter(i => i.id !== currentItem.value.id);
        closeModals();
        utils.showSuccess('Registro eliminado con éxito.');
    } catch (error) {
        console.error('Error al eliminar procedencia:', error);
        utils.showError?.('No se pudo eliminar el registro.');
    } finally {
        utils.loader = false;
    }
};

const confirmActivate = async () => {
  try {
    utils.loader = true
    await procedenciasService.activarProcedencia(currentItem.value.id, { confirmar: true }); 
    const index = items.value.findIndex(i => i.id === currentItem.value.id)
    if (index !== -1) items.value[index].estado = 'ACTIVO'
    closeModals()
  } catch (error) {
    console.error('Error al activar:', error)
    utils.showError?.('No se pudo activar el registro')
  } finally {
    utils.loader = false
  }
}

const confirmDeactivate = async () => {
  const { valid } = await modalFormRef.value.validate()
  if (!valid) return

  try {
    utils.loader = true
    await procedenciasService.desactivarProcedencia(currentItem.value.id, {
      justificacion: justificacion.value
    })
    const index = items.value.findIndex(i => i.id === currentItem.value.id)
    if (index !== -1) items.value[index].estado = 'INACTIVO'
    closeModals()
  } catch (error) {
    console.error('Error al desactivar:', error)
    utils.showError?.('No se pudo inactivar el registro')
  } finally {
    utils.loader = false
  }
}




function regresarAcatalogos() {
  router.push({
    name: 'catalogos'
  })
}


// Cargar datos iniciales
onMounted(async () => {
  // Llama a la función para obtener datos del backend
  await obtenerProcedencias()
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
      <p
        class="text-center bg-warningBackground pa-4 rounded"
        style="border: 1px solid #FFC107;"
      >
        ¿Está seguro que desea inactivar el registro?<br />
        Ingrese la justificación de la acción:
      </p>
      <v-textarea
        v-model="justificacion"
        label="Justificación"
        placeholder="Agregue una justificación de la acción"
        counter
        :rules="reglasJustificacion"
        maxlength="250"
        variant="solo"
        class="mt-4 custom-textarea-placeholder"
        required
      />
    </v-form>
  </template>
</app-dialog-component>

<app-dialog-component
    :show="showEditModal"
    title="Editar Procedencia"
    text-btn="Guardar Cambios"
    @close="closeModals"
    @confirm="confirmEdit"
>
    <template #body>
        <v-form ref="editFormRef">
            <v-text-field
                v-model="editedProcedencia.nombre"
                label="Procedencia: *"
                :rules="reglasprocedencia"
                variant="solo"
            ></v-text-field>
        </v-form>
    </template>
</app-dialog-component>

<app-dialog-component
    :show="showDeleteModal"
    title="Eliminar Registro"
    text-btn="Eliminar"
    @close="closeModals"
    @confirm="confirmDelete"
>
    <template #body>
        <p class="text-center bg-dangerBackground pa-4 rounded" style="border: 1px solid #FF5252;">
            ¿Está seguro que desea eliminar este registro?
        </p>
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
             
<!-- <template v-slot:estado="{ item }">
  <template v-if="item.estado  === 'Activo'">
    <v-chip
      label
      size="small"
      class="font-weight-bold"
      style="background-color: #E5FFE9; color: #37AB47; border: 1px solid #9AECA4;"
    >
      Activo
    </v-chip>
  </template>
  <template v-else-if="item.estado === 'Inactivo'">
    <v-chip
      label
      size="small"
      class="font-weight-bold"
      style="background-color: #FCF2F2; color: #B94A48; border: 1px solid #E63946;"
    >
      Inactivos
    </v-chip>
  </template>
</template>  -->




                     <template v-slot:actions="{ item }">
  <!-- Eliminar: solo si está INACTIVO y sigue siendo NUEVO -->
  <app-button-action-table-component
    v-if="item.estado?.toUpperCase() === 'INACTIVO' && item.es_nuevo"
    text="Eliminar"
    icon="mdi-trash-can-outline"
    size="small"
    color="red"
    @btnAction="handleDelete(item)"
  />

  <!-- Activar: disponible si está INACTIVO -->
  <app-button-action-table-component
    v-if="item.estado?.toUpperCase() === 'INACTIVO'"
    text="Habilitar registro"
    icon="mdi-check-circle-outline"
    size="small"
    color="success"
    @btnAction="handleActivate(item)"
  />

  <!-- Desactivar: disponible si está ACTIVO -->
  <app-button-action-table-component
    v-if="item.estado?.toUpperCase() === 'ACTIVO'"
    text="Deshabilitar registro"
    icon="mdi-cancel"
    size="small"
    color="warning"
    @btnAction="handleDeactivate(item)"
  />
<!-- Editar usuario -->
  <app-button-action-table-component
  v-if="!item.es_nuevo"
    text="Editar registro"
    icon="mdi-pencil-outline"
    size="small"
    color="primary"
    @btnAction="handleEdit(item)"
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

<style >
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