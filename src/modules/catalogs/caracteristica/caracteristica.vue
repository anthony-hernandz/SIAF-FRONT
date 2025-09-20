<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { ref, onMounted, computed } from 'vue'
import AppRightFromCatalaogComponent from '@/components/AppRightFormCatalogComponent.vue'
import AppDataTableComponent from '@/components/AppDataTableComponent.vue'
import AppButtonActionTableComponent from '@/components/AppButtonActionTableComponent.vue'
import AppLoaderComponent from '@/components/AppLoaderComponent.vue'
import useCaracteristicas from './composables/useCaracteristicas.js'


const { xs, sm, md } = useDisplay()
const display = ref(useDisplay())

// composable
const { caracteristicas, loading, obtenerCaracteristicas } = useCaracteristicas()

// búsqueda
const search = ref('')

const headers = [
  { title: 'Característica', align: 'center', key: 'nombre' },
  { title: 'Tipo de activo al que aplica', align: 'center', key: 'tipoActivo.nombre' },
  { title: 'Persona que registró', align: 'center', key: 'registro' },
  { title: 'Estado', align: 'center', key: 'estado' },
  { title: 'Acciones', value: 'actions', align: 'center', sortable: false }
]

const filteredItems = computed(() => {
  if (!search.value) return caracteristicas.value
  return caracteristicas.value.filter(item =>
    item.nombre?.toLowerCase().includes(search.value.toLowerCase()) ||
    item.tipoActivo?.nombre?.toLowerCase().includes(search.value.toLowerCase()) ||
    item.registro?.toLowerCase().includes(search.value.toLowerCase()) ||
    item.estado?.toLowerCase().includes(search.value.toLowerCase())
  )
})

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
            <app-right-from-catalaog-component>
              <template #myCatalog>
                <v-text-field variant="solo" label="Nombre de característica: *"></v-text-field>
                <v-select variant="solo" label="Tipo activo:" :items="['a','b','c']"></v-select>
              </template>
            </app-right-from-catalaog-component>
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
                  :items="filteredItems"
                  :totalItems="filteredItems.length"
                  :loading="loading"
                  :itemsPerPage="5"
                  :customHeader="true"
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
                          : 'background: #FFE5E5; border: 1px solid #AB3737 !important'"
                      >
                        <span :class="item.estado === 'Activo' ? 'text-successT' : 'text-errorT'">
                          {{ item.estado }}
                        </span>
                      </v-chip>
                    </div>
                  </template>

                  <!-- Acciones -->
                  <template v-slot:actions="{ item }">
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

              <!-- Botón regresar -->
              <v-col cols="11" class="text-end">
                <v-btn color="primaryBackground" variant="outlined">Regresar</v-btn>
              </v-col>

            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
