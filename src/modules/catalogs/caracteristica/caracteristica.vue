<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { ref, onMounted, computed } from 'vue'
import AppRightFormCatalogComponent from '@/components/AppRightFormCatalogComponent.vue'
import AppDataTableComponent from '@/components/AppDataTableComponent.vue'
import AppButtonActionTableComponent from '@/components/AppButtonActionTableComponent.vue'
import AppLoaderComponent from '@/components/AppLoaderComponent.vue'
import useCaracteristicas from './composables/useCaracteristicas.js'

const { xs, sm, md } = useDisplay()
const display = ref(useDisplay())

// composable
const { caracteristicas, loading, obtenerCaracteristicas, crearCaracteristica, actualizarCaracteristica, eliminarCaracteristica, activarCaracteristica, desactivarCaracteristica } = useCaracteristicas()

// Búsqueda
const search = ref('')

// Estados para la ventana modal de edición
const dialogVisible = ref(false)
const editedItem = ref(null)
const loadingEdit = ref(false)

// Estados para el snackbar de notificaciones
const snackbarVisible = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('')

// Estados para el diálogo de confirmación de eliminación
const deleteDialogVisible = ref(false)
const itemToDelete = ref(null)
const loadingDelete = ref(false)

// Paginación
const page = ref(1)
const itemsPerPage = ref(5)

const headers = [
  { title: 'Característica', align: 'center', key: 'nombre' },
  { title: 'Tipo de activo al que aplica', align: 'center', key: 'tipoActivo.nombre' },
  { title: 'Persona que registró', align: 'center', key: 'registro' },
  { title: 'Estado', align: 'center', key: 'estado' },
  { title: 'Acciones', value: 'actions', align: 'center', sortable: false }
]

const filteredItems = computed(() => {
  if (!caracteristicas.value) return []
  
  let items = caracteristicas.value.filter(item =>
    item.nombre?.toLowerCase().includes(search.value.toLowerCase()) ||
    item.tipoActivo?.nombre?.toLowerCase().includes(search.value.toLowerCase()) ||
    item.registro?.toLowerCase().includes(search.value.toLowerCase()) ||
    item.estado?.toLowerCase().includes(search.value.toLowerCase())
  )
  return items
})

const paginatedItems = computed(() => {
  const startIndex = (page.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return filteredItems.value.slice(startIndex, endIndex)
})

const totalItemsFiltered = computed(() => {
  return filteredItems.value.length
})

// Form para nueva característica 
const form = ref({
  nombre: '',
  tipoActivoId: null
})

// Computed que extrae y devuelve lista única de tipoActivo desde las características
const tiposActivos = computed(() => {
  const map = new Map()
  for (const c of caracteristicas.value) {
    const t = c?.tipoActivo
    if (t?.id && !map.has(t.id)) {
      map.set(t.id, { id: t.id, nombre: t.nombre })
    }
  }
  return Array.from(map.values())
})

// Muestra un snackbar
const showSnackbar = (text, color) => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbarVisible.value = true
}

// Acción para crear nueva característica
const agregarCaracteristica = async () => {
    if (!form.value.nombre || !form.value.tipoActivoId) {
        showSnackbar('Debe completar todos los campos antes de guardar.', 'error')
        return
    }
    const tipoActivoId = form.value.tipoActivoId?.id || form.value.tipoActivoId
    try {
        await crearCaracteristica({
            nombre: form.value.nombre,
            tipoActivoId: tipoActivoId
        })
        form.value = { nombre: '', tipoActivoId: null }
        showSnackbar('Característica creada con éxito', 'success')
    } catch (error) {
        console.error(error)
        showSnackbar(error.response?.data?.message || 'Error al crear la característica', 'error')
    }
}

// Abre el diálogo de edición con los datos del ítem
const openEditDialog = (item) => {
  editedItem.value = { ...item, tipoActivoId: item.tipoActivo?.id }
  dialogVisible.value = true
}

// Guarda los cambios del ítem editado
const saveChanges = async () => {
  loadingEdit.value = true
  try {
    if (!editedItem.value.nombre || !editedItem.value.tipoActivoId) {
      showSnackbar('Debe completar todos los campos antes de guardar.', 'error')
      return
    }
    const tipoActivoId = editedItem.value.tipoActivoId?.id || editedItem.value.tipoActivoId

    const payload = {
      nombre: editedItem.value.nombre,
      tipoActivoId: tipoActivoId
    }

    await actualizarCaracteristica(editedItem.value.id, payload)
    showSnackbar('Característica actualizada con éxito', 'success')
    dialogVisible.value = false

  } catch (error) {
    console.error('Error al actualizar:', error)
    showSnackbar(error.response?.data?.message || 'Error al actualizar la característica.', 'error')
  } finally {
    loadingEdit.value = false
  }
}

// Abre el diálogo de confirmación para eliminar
const confirmDelete = (item) => {
  itemToDelete.value = item
  deleteDialogVisible.value = true
}

// Ejecuta la eliminación
const deleteItem = async () => {
  loadingDelete.value = true
  try {
    await eliminarCaracteristica(itemToDelete.value.id)
    showSnackbar('Característica eliminada con éxito', 'success')
  } catch (error) {
    console.error('Error al eliminar:', error)
    showSnackbar(error.response?.data?.message || 'Error al eliminar la característica.', 'error')
  } finally {
    deleteDialogVisible.value = false
    itemToDelete.value = null
    loadingDelete.value = false
  }
}

// Maneja la activación de una característica
const handleActivar = async (item) => {
  try {
    await activarCaracteristica(item.id, { estado: 'Activo' })
    showSnackbar('Característica activada con éxito', 'success')
  } catch (error) {
    console.error('Error al activar:', error)
    showSnackbar(error.response?.data?.message || 'Error al activar la característica.', 'error')
  }
}

// Maneja la desactivación de una característica
const handleDesactivar = async (item) => {
  try {
    await desactivarCaracteristica(item.id, { estado: 'Inactivo' })
    showSnackbar('Característica desactivada con éxito', 'success')
  } catch (error) {
    console.error('Error al desactivar:', error)
    showSnackbar(error.response?.data?.message || 'Error al desactivar la característica.', 'error')
  }
}

onMounted(() => {
  obtenerCaracteristicas()
})
</script>

<template>
  <div>
    <app-loader-component v-if="loading" />

    <v-container fluid class="mb-8">
      <v-row justify="center" :class="display.xs || display.sm || display.md ? 'mb-8':''">
        
        <!-- Formulario lateral -->
        <v-col cols="12" xl="4" lg="3" sm="12" md="4">
          <v-card
            :elevation="0"
            color="backgroundSection"
            class="px-7 py-7"
            style="border: 1px solid #6a83be; height: 100% !important"
          >
            <app-right-form-catalog-component
              @save="agregarCaracteristica"

            >
              <template #myCatalog>
                <!-- Input -->
                <v-text-field
                  v-model="form.nombre"
                  variant="solo"
                  label="Nombre de característica: *"
                />

                <!-- Select -->
                <v-select
                  v-model="form.tipoActivoId"
                  :items="tiposActivos"
                  item-title="nombre"
                  item-value="id"
                  variant="solo"
                  label="Tipo activo:"
                  :disabled="loading || tiposActivos.length === 0"
                  :hint="tiposActivos.length === 0 ? 'No hay tipos de activo cargados aún' : ''"
                  persistent-hint
                />

                
              </template>
            </app-right-form-catalog-component>
          </v-card>
        </v-col>

        <!-- Tabla -->
        <v-col cols="12" xl="6" lg="7" sm="12" md="8">
          <v-card
            :elevation="0"
            color="backgroundSection"
            class="px-7 py-7"
            style="border: 1px solid #6a83be"
          >
            <v-row justify="center">
              <v-col cols="12" class="text-center">
                <div class="bg-secondaryBackground py-2" style="border-radius: 7px;border: 1px solid #111E60;">
                  <p>Listado</p>
                </div>
              </v-col>

              <!-- Buscador -->
              <v-col cols="12">
                <v-text-field
                  v-model="search"
                  variant="solo"
                  label="Buscar"
                  appendInnerIcon="mdi-magnify"
                />
              </v-col>

              <!-- Data Table -->
              <v-col cols="12">
                <app-data-table-component
                  :headers="headers"
                  :correlativo="false"
                  :items="paginatedItems"
                  :totalItems="totalItemsFiltered"
                  :loading="loading"
                  :items-per-page="itemsPerPage"
                  :customHeader="true"
                  v-model:page="page"
                >
                  <!-- TipoActivo -->
                  <template v-slot:tipoActivo="{ item }">
                    {{ item.tipoActivo?.nombre }}
                  </template>

                  <!-- Estado -->
                  <template v-slot:estado="{ item }">
                    <div>
                      <v-chip
                        label
                        size="small"
                        :style="item.estado === 'Activo'
                          ? 'background: #E5FFE9; border: 1px solid #37AB47 !important'
                          : 'background: #FFE5E5; border: 1px solid #AB3737 !important'">
                        <span :class="item.estado === 'Activo' ? 'text-successT' : 'text-errorT'">
                          {{ item.estado }}
                        </span>
                      </v-chip>
                    </div>
                  </template>

                  <!-- Acciones -->
                  <template v-slot:actions="{ item }">
                    <!-- Botón Editar: solo si NO es nuevo -->
                    <app-button-action-table-component
                      v-if="!item.es_nuevo"
                      text="Editar"
                      icon="mdi-pencil-outline"
                      size="small"
                      @btnAction="openEditDialog(item)"
                    />

                    <!-- Botón Eliminar: solo si es nuevo -->
                    <app-button-action-table-component
                      v-if="item.es_nuevo"
                      text="Eliminar"
                      icon="mdi-trash-can-outline"
                      size="small"
                      @btnAction="confirmDelete(item)"
                    />

                    <!-- Botón Activar/Desactivar: según estado -->
                    <app-button-action-table-component
                      v-if="item.estado === 'Activo'"
                      text="Desactivar"
                      icon="mdi-cancel"
                      size="small"
                      color="warning"
                      @btnAction="handleDesactivar(item)"
                    />
                    <app-button-action-table-component
                      v-else
                      text="Activar"
                      icon="mdi-check-circle-outline"
                      size="small"
                      color="success"
                      @btnAction="handleActivar(item)"
                    />
                  </template>

                </app-data-table-component>
              </v-col>
              
              

              <!-- Botón regresar -->
              <v-col cols="11" class="text-end">
                <v-btn color="primaryBackground" variant="outlined">Regresar</v-btn>
              </v-col>

            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Diálogo de edición -->
    <v-dialog v-model="dialogVisible" max-width="600px">
      <v-card>
        <v-card-title class="bg-primaryBackground">
          <span class="text-h5">Editar Característica</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogVisible = false" size="small">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="py-5">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-if="editedItem"
                  v-model="editedItem.nombre"
                  variant="solo"
                  label="Nombre de característica"
                />
              </v-col>
              <v-col cols="12">
                <v-select
                  v-if="editedItem"
                  v-model="editedItem.tipoActivoId"
                  :items="tiposActivos"
                  item-title="nombre"
                  item-value="id"
                  variant="solo"
                  label="Tipo activo"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="dialogVisible = false">
            Cancelar
          </v-btn>
          <v-btn color="success" variant="text" @click="saveChanges" :loading="loadingEdit">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación para eliminar -->
    <v-dialog v-model="deleteDialogVisible" max-width="500px">
      <v-card>
        <v-card-title class="headline text-center">¿Estás seguro de que quieres eliminar esta característica?</v-card-title>
        <v-card-text class="text-center">
          Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="flat" @click="deleteDialogVisible = false">
            Cancelar
          </v-btn>
          <v-btn color="error" variant="flat" :loading="loadingDelete" @click="deleteItem">
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar para notificaciones -->
    <v-snackbar
      v-model="snackbarVisible"
      :color="snackbarColor"
      timeout="3000"
      location="bottom right"
    >
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>
