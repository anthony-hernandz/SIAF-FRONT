<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { onMounted, ref } from 'vue'
import useRoles from '../composables/useRoles'
import useUtils from '@/utils/useUtils'
import AppRightFromCatalaogComponent from '@/components/AppRightFormCatalogComponent.vue'
import AppButtonActionTableComponent from '@/components/AppButtonActionTableComponent.vue'
import AppDataTableComponent from '@/components/AppDataTableComponent.vue'
const { xs, sm, md, lg, xl } = useDisplay()
const display = ref(useDisplay())

let items = [
  {
    ambiente: 'A',
    register_by: 'Aquiles Vengo',
    estado: 'ACTIVO'
  },
  {
    ambiente: 'B',
    register_by: 'Aquiles Vengo',
    estado: 'ACTIVO'
  },
  {
    ambiente: 'C',
    register_by: 'Aquiles Vengo',
    estado: 'ACTIVO'
  },
  {
    ambiente: 'D',
    register_by: 'Aquiles Vengo',
    estado: 'ACTIVO'
  },
  {
    ambiente: 'E',
    register_by: 'Aquiles Vengo',
    estado: 'ACTIVO'
  }
]

const {
  headers,
  obtenerRoles,
  roles,
  role,
  loading,
  page,
  totalItems,
  itemsPerPage,
  changePage,
  filtros,
  limpiarFiltros,
  showConfirmationDialog,
  deleteRole,
  showConfirmation,
  closeConfirmation,
  sendRequest
} = useRoles()

const { verificarPermisoFtn } = useUtils()

onMounted(() => {

})
</script>

<template>
  <v-container fluid class="mb-8">
    <v-row justify="center" :class="display.xs || display.sm || display.md ? 'mb-8' : ''">
      <v-col cols="12" xl="4" lg="3" sm="12" md="4">
        <v-card
          :elevation="0"
          color="backgroundSection"
          class="px-7 py-7"
          style="border: 1px solid #6a83be; height: 100% !important"
        >
          <app-right-from-catalaog-component>
            <template #myCatalog>
              <v-text-field variant="solo" label="Ambiente *"></v-text-field>
            </template>
          </app-right-from-catalaog-component>
        </v-card>
      </v-col>
      <v-col cols="12" xl="6" lg="7" sm="12" md="8">
        <v-card
          :elevation="0"
          color="backgroundSection"
          class="px-7 py-7"
          style="border: 1px solid #6a83be"
        >
          <v-row justify="center">
            <v-col cols="12" xl="12" lg="11" sm="12" md="12" xs="12" class="text-center">
              <div
                class="bg-secondaryBackground py-2"
                style="border-radius: 7px; border: 1px solid #111e60"
              >
                <p>Listado</p>
              </div>
            </v-col>
            <v-col cols="12" xl="12" lg="11" sm="12" md="12" xs="12">
              <v-text-field
                variant="solo"
                label="Buscar"
                appendInnerIcon="mdi-magnify"
              ></v-text-field>
            </v-col>
            <v-col cols="12" xl="12" lg="11" sm="12" md="12" xs="12">
              <app-data-table-component
                :headers="headers"
                :correlativo="false"
                :items="items"
                :totalItems="items.length"
                :loading="false"
                :itemsPerPage="5"
                :customHeader="true"
              >
                <template v-slot:estado="{ item }">
                  <div>
                    <v-chip
                      label
                      size="small"
                      style="background: #e5ffe9; border: 1px solid #37ab47 !important"
                    >
                      <span class="text-successT">{{ item.estado }}</span></v-chip
                    >
                  </div>
                </template>
                <template v-slot:actions="{  }">
                  <app-button-action-table-component
                    text="Editar"
                    icon="mdi-pencil-outline"
                    size="small"
                  />
                  <app-button-action-table-component
                    text="Eliminar"
                    icon="mdi-trash-can-outline"
                    size="small"
                  />
                </template>
              </app-data-table-component>
            </v-col>

            <v-col cols="11" class="text-end">
              <v-btn color="primaryBackground" variant="outlined">Regresar</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <app-dialog-component
      :show="showConfirmationDialog"
      :title="role.id_estado === 1 ? 'Desactivar' : 'Activar'"
      textBtn="Aceptar"
      @close="closeConfirmation"
      @confirm="deleteRole(role)"
      max-width="500"
      :send-request="sendRequest"
      :disabled-btn-cancelar="sendRequest"
    >
      <template v-slot:body>
        <v-row>
          <v-col cols="12" class="text-center">
            <span v-if="role.id_estado === 1">
              <b>¿Desea desactivar el rol seleccionado?</b><br />Al hacer esta acción, todos los
              usuarios con este rol ya no tendrán los permisos asociados
            </span>
            <span v-else>
              <b>¿Desea activar el rol seleccionado?</b><br />Al hacer esta acción, todos los
              usuarios con este rol tendrán los permisos asociados
            </span>
          </v-col>
        </v-row>
      </template>
    </app-dialog-component>
  </v-container>
</template>
