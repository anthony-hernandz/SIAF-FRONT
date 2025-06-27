<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { ref, onMounted } from 'vue'
import AppDataTableComponent from '@/components/AppDataTableComponent.vue'
const { xs, sm, md, lg, xl } = useDisplay()
const display = ref(useDisplay())

let items = [
  {
    unidad:'A',
    ambiente:'A',
    descripcion:'A',
    register_by: "Aquiles Vengo",
    estado: "ACTIVO",
  },
  {
    unidad:'A',
    ambiente:'A',
    descripcion:'A',
    register_by: "Aquiles Vengo",
    estado: "ACTIVO",
  },
  {
    unidad:'A',
    ambiente:'A',
    descripcion:'A',
    register_by: "Aquiles Vengo",
    estado: "ACTIVO",
  },
  {
    unidad:'A',
    ambiente:'A',
    descripcion:'A',
    register_by: "Aquiles Vengo",
    estado: "ACTIVO",
  },
  {
    unidad:'A',
    ambiente:'A',
    descripcion:'A',
    register_by: "Aquiles Vengo",
    estado: "ACTIVO",
  },
]

let headers = [
  { title: 'Unidad', align: 'center', key: 'unidad'},
  { title: 'Ambiente', align: 'center', key: 'ambiente'},
  { title: 'Descripción', align: 'center', key: 'descripcion'},
  { title: 'Registrado por', align: 'center', key: 'register_by'},
  { title: 'Estado', align: 'center', key: 'estado',value:'estado' },
  { title: 'Acciones', value: 'actions', align: 'center', sortable: false }
]

onMounted(() => {})
</script>

<template>
  <div>
    <app-loader-component />
    <v-container fluid class="mb-8">
      <v-row justify="center" :class="display.xs || display.sm || display.md ? 'mb-8':''">
        <v-col cols="12" xl="11" lg="11" sm="12" md="11">
          <v-card
            :elevation="0"
            color="backgroundSection"
            class="px-7 py-7"
            style="border: 1px solid #6a83be">
            <v-row justify="center">
              <v-col cols="12" xl="5" lg="5" sm="12" md="12" xs="12" class="text-center">
                <div class="bg-secondaryBackground py-2" style="border-radius: 7px;border: 1px solid #111E60;">
                  <p>Estructura del establecimiento</p>
                </div>
              </v-col>
              <v-col cols="12" xl="8" lg="8" sm="12" md="12" xs="12" >
                <v-form style="margin: 0 !important;padding: 0 !important;">
                    <v-row justify="space-around">
                        <v-col cols="12" xl="5" lg="5" sm="12" md="12" xs="12">
                            <v-select variant="solo" label="Unidad: *" :items="['a','b','c']"></v-select>
                        </v-col>
                        <v-col cols="12" xl="5" lg="5" sm="12" md="12" xs="12">
                            <v-select variant="solo" label="Ambiente: *" :items="['d','e','f']"></v-select>
                        </v-col>
                        <v-col cols="12" xl="5" lg="5" sm="12" md="12" xs="12">
                            <v-textarea variant="solo" label="Descripción: *" rows="3"></v-textarea>
                        </v-col>
                        <v-col cols="12" xl="5" lg="5" sm="12" md="12" xs="12" align-self="end">
                           <v-btn class="mb-5" color="primaryBackground">Agregar</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
              </v-col>
              <v-col cols="12" xl="8" lg="8" sm="12" md="12" xs="12">
                <v-text-field variant="solo" label="Buscar" appendInnerIcon="mdi-magnify"></v-text-field>
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
                    <v-chip label size="small" style="background: #E5FFE9;border: 1px solid #37AB47 !important">
                      <span class="text-successT">{{ item.estado }}</span></v-chip>
                  </div>
              </template>
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