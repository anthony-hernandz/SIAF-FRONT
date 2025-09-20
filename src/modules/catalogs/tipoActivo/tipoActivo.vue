<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { ref, onMounted, computed } from 'vue'
import AppRightFromCatalaogComponent from '@/components/AppRightFormCatalogComponent.vue'
import AppDataTableComponent from '@/components/AppDataTableComponent.vue'
import useTipoActivo from './composables/useTipoActivo'
import { useRouter } from 'vue-router'

// Variables y funciones de `useTipoActivo` para manejar datos, estado y acciones de los tipos de activo
const { 
  headers,
  items,
  loading,
  tipoActivo,
  obtenerTipoActivos,
  guardarTipoActivo,
  eliminarTipoActivo,
  activarTipoActivo,
  desactivarTipoActivo,
  buscarTipoActivo
} = useTipoActivo()

const { xs, sm, md, lg, xl } = useDisplay()
const display = ref(useDisplay())
const router = useRouter()
const itemsPerPage = ref(6)                 // Cantidad de datos que se muestran por pagina en la tabla
const page = ref(1)                         // Pagina actual de la tabla
const showConfirmDialog = ref(false)        // Controla la visibilidad del modal
const tipoActivoSeleccionado = ref(null)    // Guarda el tipo activo seleccionado para mostrarlo en el modal
const accionConfirmar = ref('')             // Controla la accion a realizar: eliminar, activar o desactivar
const justificacion = ref('')               // Almacena el mesnaje de justificacion ingresado por el usuario al desactivar
const errorJustificacion = ref('')          // Mensaje de error en el modal si la justificacion es invalida o vacia
const searchTerm = ref('')  // Valor ingresado en el buscador

// Al cargar la vista, obtiene todos los tipos de activo
onMounted(async () => {
  await obtenerTipoActivos()
})

// Obtiene los tipos de activo que se mostraran en la pagina actual según la paginacion
const paginatedItems = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return items.value.slice(start, end)
})

// Cambia la pagina que se muestra en la tabla cuando el usuario selecciona otra
const cambiarPagina = (nuevaPagina) => {
  page.value = nuevaPagina
}

// Prepara modal para activar o desactivar un tipo de activo en base a su estado actual
function cambiarEstado(item) {
  tipoActivoSeleccionado.value = item
  accionConfirmar.value = item.estado === 'Activo' ? 'desactivar' : 'activar'
  showConfirmDialog.value = true
  justificacion.value = ''
  errorJustificacion.value = ''
}

// Prepara el modal para eliminar un tipo de activo
function eliminarTipoActivoConfirm(item) {
  tipoActivoSeleccionado.value = item
  accionConfirmar.value = 'eliminar'
  showConfirmDialog.value = true
}

// Ejecuta la accion de activar, desactivar o eliminar un tipo de activo según corresponda, actualiza la tabla y valida la justificacion
async function confirmarAccion() {
  if (!tipoActivoSeleccionado.value) return
  try {
    if (accionConfirmar.value === 'activar') {
      await activarTipoActivo(tipoActivoSeleccionado.value.id)
    } else if (accionConfirmar.value === 'desactivar') {
      if (!justificacion.value.trim()) {
        errorJustificacion.value = 'Debe ingresar un motivo para desactivar'
        return
      }
      errorJustificacion.value = ''
      await desactivarTipoActivo(tipoActivoSeleccionado.value.id, justificacion.value.trim())
    } else if (accionConfirmar.value === 'eliminar') {
      await eliminarTipoActivo(tipoActivoSeleccionado.value.id)
    }
    await obtenerTipoActivos()
    showConfirmDialog.value = false
    justificacion.value = ''
  } catch (error) {
    console.error(error)
  }
}

// Función que redirige a la pagina de catalogos
function regresarAcatalogos() {
  router.push({
    name: 'catalogos'
  })
}
</script>

<template>
  <div>
    <app-loader-component />

    <v-container fluid class="mb-8 bg-backgroundLay view-tipoActivo">

      <v-row justify="left"  :class="display.xs || display.sm || display.md ? 'mb-8':''">
        <v-col cols="12" xl="4" lg="3" sm="12" md="4">
          <v-card
            :elevation="0"
            color="backgroundSection"
            class="px-7 py-7"
            style="border: 1px solid #6a83be; min-height: 750px !important"
          >
            <app-right-from-catalaog-component buttonClass="mi-margin-boton" @submit="guardarTipoActivo">
              <template #myCatalog>
                <v-text-field v-model="tipoActivo.nombre" variant="solo" label="Ingrese tipo de activo"></v-text-field>
              </template>
            </app-right-from-catalaog-component>
          </v-card>
        </v-col>
        <v-col cols="12" xl="8" lg="9" sm="12" md="8">
          <v-card
            :elevation="0"
            color="backgroundSection"
            class="px-7 py-7"
            style="border: 1px solid #6a83be; min-height: 750px !important"
          >
            <v-row justify="center">
              <v-col cols="12" xl="12" lg="11" sm="12" md="12" xs="12" class="text-center">
                <div class="bg-secondaryBackground py-2" style="border-radius: 7px;border: 1px solid #111E60;">
                  <p>Listado</p>
                </div>
              </v-col>
              <v-col cols="12" xl="12" lg="11" sm="12" md="12" xs="12">
                <v-text-field
                  v-model="searchTerm"
                  variant="solo"
                  label="Ingrese tipo de activo"
                  appendInnerIcon="mdi-magnify"
                  @input="() => buscarTipoActivo(searchTerm)"
                />
              </v-col>
              <v-col cols="12" xl="12" lg="11" sm="12" md="12" xs="12">
              <!-- Componente de tabla que muestra los tipos de activo con paginación, loader, y encabezado personalizado -->
              <app-data-table-component
                :headers="headers"
                :items="paginatedItems"
                :totalItems="items.length"
                :loading="loading"
                :itemsPerPage="itemsPerPage"
                :page="page"
                @update:page="cambiarPagina"
                :correlativo="false"
              >
                <template v-slot:estado="{ item }">
                  <!-- Verde si el tipo de activo está activo -->
                  <app-badge-component
                    v-if="item.estado === 'Activo'"
                    color="#E5FFE9"
                    fontColor="#37AB47"
                    title="Activo"
                    border="#9AECA4 md"
                  />
                  <!-- Rojo si el tipo de activo está inactivo -->
                  <app-badge-component
                    v-else
                    color="#FCF2F2"
                    fontColor="#B94A48"
                    title="Inactivo"
                    border="#E63946 md"
                  />
                </template>
                <!-- Muestra los botones de accion segun el estado del tipo de activo -->
                <template v-slot:actions="{ item }">
                  <!-- Si esta activo muestra el boton 'desactivar' -->
                  <app-button-action-table-component
                    v-if="item.estado === 'Activo'"
                    text="Desactivar"
                    icon="mdi-cancel"
                    size="small"
                    @btnAction="() => cambiarEstado(item)"
                  />
                  <div v-else>
                    <!-- Si esta inactivo muestra el boton 'activar' -->
                    <app-button-action-table-component
                      text="Activar"
                      icon="mdi-check-circle-outline"
                      size="small"
                      @btnAction="() => cambiarEstado(item)"
                    />
                    <!-- Muestra el boton eliminar solo si es nuevo y no ha sido activado -->
                    <app-button-action-table-component
                      v-if="item.es_nuevo"
                      text="Eliminar"
                      icon="mdi-trash-can-outline"
                      size="small"
                      @btnAction="() => eliminarTipoActivoConfirm(item)"
                    />
                  </div>
                </template>
              </app-data-table-component>
              </v-col>
              <v-col cols="11" class="text-end" style="margin-top: 25px; margin-bottom: -10%;">
                <v-btn color="primaryBackground" variant="outlined" @click="regresarAcatalogos">Regresar</v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- Modal de confirmacion -->
    <app-dialog-component
      v-model="showConfirmDialog"
      :title="accionConfirmar === 'eliminar' ? 'Eliminar registro' : 'Cambiar estado del registro'"
      textBtn="Aceptar"
      @close="showConfirmDialog = false"
      @confirm="confirmarAccion"
      max-width="550"
    >
    <!-- Mensaje principal -->
      <template v-slot:body>
        <v-row>
          <v-col cols="12" class="text-center">
            <span>
              <b>
                ¿Está seguro de
                {{ accionConfirmar === 'activar' ? 'activar' : accionConfirmar === 'desactivar' ? 'desactivar' : 'eliminar' }}
                el tipo de activo <u>{{ tipoActivoSeleccionado?.nombre }}</u>?
              </b>
            </span>
          </v-col>
          <!-- Campo de justificación solo para desactivar -->
          <v-col cols="12" v-if="accionConfirmar === 'desactivar'">
            <v-textarea
              v-model="justificacion"
              label="Agregue una justificacion de la accion"
              rows="3"
              outlined
              :error="!!errorJustificacion"
              :error-messages="errorJustificacion"
              required
            ></v-textarea>
          </v-col>
        </v-row>
      </template>
    </app-dialog-component>
  </div>
</template>
<style>
.view-tipoActivo {
  padding: 30px;
  margin-top: -30px;
  margin-bottom: 10px;
  min-height: 810px;
  height: auto;
}

.mi-margin-boton {
  margin-top: 500px !important;
  margin-bottom: -10%;
}
</style>