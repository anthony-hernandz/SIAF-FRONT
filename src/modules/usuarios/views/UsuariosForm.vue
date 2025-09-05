<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { ref, onMounted, watch, computed  } from 'vue'
import useUsuarios from '../composables/useUsuarios'
import dependenciaService from '@/services/dependencias.services';

const {
  usuario,
  paises,
  obtenerPaises,
  obtenerPerfiles,
  perfiles,
  permisos,
  obtenerPermisos,
  perfil,
  getEstablecimiento,
  establecimientos,
  dependencias,
  obtenerDependencias,
  items,
  añadirTabla,
  permisosTemporales,
  deleteElement,
  v$,
  usernameErrors,
  emailErrors,
  passwordErrors,
  passwordRepeatErrors,
  perfilesErrors,
  sendRequest,
  guardarUsuario
} = useUsuarios()

const display = ref(useDisplay())
const stepVal = ref(1)

const deleteItem = (item) => {
  deleteElement(item)
}

//exclusivo para la carga de las dependencias
const dependenciasFormulario = ref([]);
const cargarDependenciasFormulario = async () => {
  try {
    const resultado = await dependenciaService.obtenerDependencias();
    dependenciasFormulario.value = resultado.data; //  extrae solo el array
  } catch (error) {
    console.error('Error al cargar dependencias del formulario:', error);
    dependenciasFormulario.value = [];
  }
};




let headers = [
  { title: 'Rol', align: 'center', key: 'rol' },
  { title: 'Permiso', align: 'center', key: 'permiso' },
  { title: 'Acciones', value: 'actions', align: 'center', sortable: false }
]

watch(perfil, (newPerfil) => {
  if (newPerfil && newPerfil.value) {
    obtenerPermisos(newPerfil.value);
  } else {
    permisos.value = [];
  }
});

//Para obtener establecimiento
watch(() => usuario.establecimiento, (newEstablecimiento) => {
  if (newEstablecimiento) {
    obtenerDependencias(newEstablecimiento)
  } else {
    dependencias.value = []
  }
})


onMounted(async () => {
  await obtenerPaises()
  await obtenerPerfiles()
  await getEstablecimiento()
  await cargarDependenciasFormulario()
})

// Fecha máxima permitida para el registro de un usuario ( 18 años)
const maxDate = computed(() => {
  const today = new Date()
  today.setFullYear(today.getFullYear() - 18)
  return today.toISOString().split('T')[0] // formato YYYY-MM-DD
})

//regla de validación para verificar que la fecha seleccionada cumple
const fechaNacimientoRules = [
  v => !!v || 'Este campo es obligatorio',
  v => {
    if (!v) return true
    return v <= maxDate.value || 'Debe ser mayor de 18 años'
  }
]

// Reglas dinámicas para el ingreso del DUI
const documentoRules = computed(() => {
  if (usuario.paisNacimiento === 68) {
    return [
      v => !!v || 'Este campo es obligatorio',
      v => /^[0-9]{8}-[0-9]{1}$/.test(v) || 'Ingrese un número de documento válido' // DUI formato 12345678-9
    ]
  } else {
    return [
      v => !!v || 'Este campo es obligatorio',
      v => /^[A-Za-z0-9-]{1,25}$/.test(v) || 'Ingrese un número de documento válido'
    ]
  }
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
                      v-model="usuario.primerNombre"
                      maxlength="20"
                      :rules="[v => !!v || 'Este campo es obligatorio']"
                      @input="usuario.primerNombre = usuario.primerNombre.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '')"                    
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
                    <v-text-field
                      label="Segundo nombre"
                      variant="solo"
                      v-model="usuario.segundoNombre"
                      maxlength="20"
                      @input="usuario.segundoNombre = usuario.segundoNombre.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '')"                    
                    
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
                    <v-text-field
                      label="Tercer nombre"
                      variant="solo"
                      v-model="usuario.tercerNombre"
                      maxlength="20"
                      @input="usuario.tercerNombre = usuario.tercerNombre.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '')"                    
                    
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
                    <v-text-field
                      label="Primer apellido"
                      variant="solo"
                      v-model="usuario.primerApellido"
                      maxlength="20"
                      :rules="[v => !!v || 'Este campo es obligatorio']"
                      @input="usuario.primerApellido = usuario.primerApellido.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '')"                    
                    
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
                    <v-text-field
                      label="Segundo apellido"
                      variant="solo"
                      v-model="usuario.segundoApellido"
                      maxlength="20"
                      :rules="[v => !!v || 'Este campo es obligatorio']"
                      @input="usuario.segundoApellido = usuario.segundoApellido.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '')"                    
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row justify="start">
                  <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
                    <v-text-field
                      label="Fecha de nacimiento"
                      type="date"
                      variant="solo"
                      :rules="fechaNacimientoRules"
                      v-model="usuario.fechaNacimiento"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
                    <v-autocomplete
                      label="País de nacimiento"
                      variant="solo"
                      :items="paises"
                      :rules="[v => !!v || 'Este campo es obligatorio']"
                      v-model="usuario.paisNacimiento"
                      item-title="title"
                      item-value="value"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
                    <v-text-field
                      label="N° Documento"
                      variant="solo"
                      v-model="usuario.documento"
                      :rules="documentoRules"
                      @input="filtrarDocumento"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
                    <v-text-field
                      label="Correo institucional"
                      variant="solo"
                      v-model="usuario.email"
                      @blur="v$.email.$touch"
                      @change="v$.email.$touch"
                      :error-messages="emailErrors"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
                    <v-text-field
                      label="Nombre de usuario"
                      variant="solo"
                      v-model="usuario.username"
                      @blur="v$.username.$touch"
                      @change="v$.username.$touch"
                      :error-messages="usernameErrors"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row justify="start">
                  <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
                    <v-autocomplete
                      label="Establecimiento"
                      :items="establecimientos"
                      v-model="usuario.establecimiento"
                      item-title="title"
                      item-value="value"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
                    <v-select
                      label="Dependencia"
                      variant="solo"
                      :items="dependenciasFormulario"
    item-title="nombre"
    item-value="id"
    v-model="usuario.dependencia"

                    ></v-select>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4"></v-col>
                </v-row>
                <!-- Ingreso de contraseña -->
                <v-row justify="start">
                  <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
                    <v-text-field
                      label="Contraseña"
                      variant="solo"
                      v-model="usuario.password"
                      @blur="v$.password.$touch"
                      @change="v$.password.$touch"
                      :error-messages="passwordErrors"
                      type="password"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12" md="6" lg="4" xl="4">
                    <v-text-field
                      label="Repetir Contraseña"
                      variant="solo"
                      v-model="usuario.passwordRepeat"
                      @blur="v$.passwordRepeat.$touch"
                      @change="v$.passwordRepeat.$touch"
                      :error-messages="passwordRepeatErrors"
                      type="password"
                    ></v-text-field>
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
                    @click="$emit('close')"
                    >Cancelar</v-btn
                  >
                  <v-btn
                    @click="stepVal = 2"
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
                      item-title="title"
                      item-value="value"
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
                      item-title="title"
                      item-value="value"
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
                    @click="stepVal = 1"
                    >Regresar</v-btn
                  >
                  <v-btn
                    @click="guardarUsuario()"
                    :class="display.xs || display.sm ? 'mt-5' : ''"
                    color="primaryBackground"
                    style="width: 150px"
                    :disabled="sendRequest"
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
