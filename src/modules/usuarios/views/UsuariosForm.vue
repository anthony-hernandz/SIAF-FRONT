<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { ref, onMounted } from 'vue'
import useUsuarios from '../composables/useUsuarios'

const {
  paises,
  obtenerPaises,
  obtenerPerfiles,
  perfiles,
  permisos,
  obtenerPermisos,
  perfil,
  getEstablecimiento,
  establecimientos,
  items,
  añadirTabla,
  permisosTemporales,
  deleteElement
} = useUsuarios()

const display = ref(useDisplay())
const stepVal = ref(1)

const goStepTwo = () => {
  stepVal.value = 2
}

const saveForm = () => {
  alert('Error!!')
}

const deleteItem = (item) => {
  deleteElement(item)
}

let headers = [
  { title: 'Rol', align: 'center', key: 'rol' },
  { title: 'Permiso', align: 'center', key: 'permiso' },
  { title: 'Acciones', value: 'actions', align: 'center', sortable: false }
]

onMounted(async () => {
  await obtenerPaises()
  await obtenerPerfiles()
  await getEstablecimiento()
})
</script>

<template>
  <v-container fluid class="mb-8">
    <v-row justify="center" :class="display.xs || display.sm || display.md ? 'mb-8' : ''">
      <v-col cols="12" lg="10" xl="10" md="12" sm="12" xs="12">
        <v-stepper v-model="stepVal" elevation="0" :mobile="!!(display.xs || display.sm)">
          <v-stepper-header style="box-shadow: none">
            <v-stepper-item title="Datos generales" :value="1" editable> </v-stepper-item>
            <v-divider></v-divider>
            <v-stepper-item title="Permisos" :value="2" editable> </v-stepper-item>
            <v-divider></v-divider>
          </v-stepper-header>
          <v-stepper-window>
            <v-stepper-window-item :value="1">
              <v-card
                color="backgroundSection"
                class="py-7"
                :class="display.xs || display.sm ? 'px-3' : 'px-7'"
                style="border: 1px solid #111e60"
              >
                <v-row justify="start">
                  <v-col cols="12" xl="12" lg="12" sm="12" md="12" xs="12" class="text-center">
                    <div
                      class="bg-secondaryBackground py-2"
                      style="border-radius: 7px; border: 1px solid #111e60"
                    >
                      <p>Datos Generales</p>
                    </div>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
                    <v-text-field
                      label="Primer nombre"
                      variant="solo"
                      v-model="primerNombre"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
                    <v-text-field
                      label="Segundo nombre"
                      variant="solo"
                      v-model="segundoNombre"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
                    <v-text-field
                      label="Tercer nombre"
                      variant="solo"
                      v-model="tercerNombre"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
                    <v-text-field
                      label="Primer apellido"
                      variant="solo"
                      v-model="primerApellido"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
                    <v-text-field
                      label="Segundo apellido"
                      variant="solo"
                      v-model="segundoApellido"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row justify="start">
                  <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
                    <v-date-input
                      label="Fecha de nacimiento"
                      prepend-icon=""
                      prepend-inner-icon="$calendar"
                      variant="solo"
                      v-model="fechaNacimiento"
                    ></v-date-input>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
                    <v-autocomplete
                      label="País de nacimiento"
                      variant="solo"
                      :items="paises"
                      :model-value="paisNacimiento"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
                    <v-text-field
                      label="N° Documento"
                      variant="solo"
                      v-model="documento"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
                    <v-text-field
                      label="Correo institucional"
                      variant="solo"
                      v-model="correoInstitucional"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
                    <v-text-field
                      label="Nombre de usuario"
                      variant="solo"
                      v-model="username"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row justify="start">
                  <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
                    <v-autocomplete
                      label="Establecimiento"
                      :items="establecimientos"
                      v-model="establecimiento"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
                    <v-select
                      label="Dependencia"
                      variant="solo"
                      :items="['a', 'b', 'c']"
                      v-model="dependencia"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4"></v-col>
                </v-row>
              </v-card>
              <v-row justify="end" class="mt-4 mb-7">
                <v-col
                  cols="12"
                  xs="12"
                  sm="12"
                  md="6"
                  lg="4"
                  xl="4"
                  :class="display.xs || display.sm ? 'text-center' : 'text-end'"
                >
                  <v-btn
                    class="mx-4"
                    :class="display.xs || display.sm ? 'mt-0' : ''"
                    variant="outlined"
                    color="primaryBackground"
                    style="width: 150px"
                    >Cancelar</v-btn
                  >
                  <v-btn
                    @click="goStepTwo()"
                    :class="display.xs || display.sm ? 'mt-5' : ''"
                    color="primaryBackground"
                    style="width: 150px"
                    >Siguiente</v-btn
                  >
                </v-col>
              </v-row>
            </v-stepper-window-item>
            <v-stepper-window-item :value="2">
              <v-card
                color="backgroundSection"
                class="py-7"
                :class="display.xs || display.sm ? 'px-3' : 'px-7'"
                style="border: 1px solid #111e60"
              >
                <v-row justify="center">
                  <v-col cols="12" xl="12" lg="12" sm="12" md="12" xs="12" class="text-center">
                    <div
                      class="bg-secondaryBackground py-2"
                      style="border-radius: 7px; border: 1px solid #111e60"
                    >
                      <p>Roles y Permisos</p>
                    </div>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4" lg="3" xl="3">
                    <v-select
                      label="Rol"
                      variant="solo"
                      :items="perfiles"
                      v-model="perfil"
                      @update:model-value="obtenerPermisos(perfil.value)"
                      return-object
                    ></v-select>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="4" lg="3" xl="3">
                    <v-select
                      multiple
                      label="Permiso"
                      variant="solo"
                      :items="permisos"
                      v-model="permisosTemporales"
                      return-object
                    ></v-select>
                  </v-col>
                  <v-col
                    cols="12"
                    xs="12"
                    sm="12"
                    md="4"
                    lg="3"
                    xl="3"
                    align-self="center"
                    class="mb-5"
                  >
                    <v-btn color="primaryBackground" @click="añadirTabla()">Añadir</v-btn>
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
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
                      <template v-slot:actions="{ item }">

                        <app-button-action-table-component
                          text="Eliminar"
                          icon="mdi-trash-can-outline"
                          size="small"
                          @btnAction="deleteItem(item)"
                        />
                      </template>
                    </app-data-table-component>
                  </v-col>
                </v-row>
              </v-card>
              <v-row justify="end" class="mt-4 mb-7">
                <v-col
                  cols="12"
                  xs="12"
                  sm="12"
                  md="6"
                  lg="4"
                  xl="4"
                  :class="display.xs || display.sm ? 'text-center' : 'text-end'"
                >
                  <v-btn
                    class="mx-4"
                    :class="display.xs || display.sm ? 'mt-0' : ''"
                    variant="outlined"
                    color="primaryBackground"
                    style="width: 150px"
                    >Regresar</v-btn
                  >
                  <v-btn
                    @click="saveForm()"
                    :class="display.xs || display.sm ? 'mt-5' : ''"
                    color="primaryBackground"
                    style="width: 150px"
                    >Guardar</v-btn
                  >
                </v-col>
              </v-row>
            </v-stepper-window-item>
          </v-stepper-window>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>
