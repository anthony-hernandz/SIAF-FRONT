<script setup>
import useFormRoles from '../composables/useFormRoles'
import { onMounted } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import router from '@/router'

const {
  title,
  form,
  permisos,
  loading,
  obtenerPermisos,
  collectionIds,
  v$,
  nombreErrors,
  acronimoErrors,
  guardarRole,
  obtenerRole
} = useFormRoles()

const { xs, sm } = useDisplay()

onMounted(async () => {
  await obtenerPermisos()
  if (router.currentRoute.value.params.id) {
    await obtenerRole(router.currentRoute.value.params.id)
  }
})
</script>

<template>
  <v-container fluid>
    <app-title-component :title="title" />

    <v-row class="mb-4 d-flex justify-space-between">
      <v-col
        cols="12"
        xs="12"
        sm="12"
        md="4"
        lg="4"
        xl="4"
        xxl="4"
        class="d-flex align-center justify-center"
      >
        <v-text-field
          v-model="form.nombre"
          color="primary"
          label="Nombre*"
          clearable
          variant="outlined"
          density="compact"
          @blur="v$.nombre.$touch"
          @change="v$.nombre.$touch"
          :error-messages="nombreErrors"
        ></v-text-field>
      </v-col>

      <v-col cols="12" xs="12" sm="12" md="4" lg="4" xl="4" xxl="4" class="d-flex align-center">
        <v-text-field
          v-model="form.acronimo"
          color="primary"
          label="Acrónimo*"
          clearable
          variant="outlined"
          density="compact"
          @blur="v$.acronimo.$touch"
          @change="v$.acronimo.$touch"
          :error-messages="acronimoErrors"
        ></v-text-field>
      </v-col>

      <v-col
        cols="12"
        xs="12"
        sm="12"
        md="4"
        lg="4"
        xl="4"
        xxl="4"
        class="d-flex align-start justify-end"
        :class="xs ? 'justify-center' : 'justify-end'"
      >
        <app-button-component
          title="Guardar"
          colors="primary"
          @btnAction="guardarRole"
          :send-request="loading"
          class="mr-4"
        />

        <app-button-component
          title="Cancelar"
          colors="primary"
          :outlined="true"
          @btnAction="() => $router.push({ name: 'perfiles' })"
        />
      </v-col>
    </v-row>

    <app-content-component>
      <v-card :loading="loading">
        <template v-slot:title>
          <v-row no-gutters>
            <v-col class="d-flex justify-start" cols="12">
              <h3 class="text-capitalize" style="color: #1d1e4c">Permisos</h3>
            </v-col>
            <v-col cols="12" class="d-flex justify-start align-center flex-wrap mt-4">
              <app-button-component
                title="Seleccionar todos"
                class="my-2 mr-2"
                outlined
                colors="primary"
                width-size="180px"
                @btnAction="collectionIds(permisos, 'seleccionar')"
                :disabled="loading"
              />
              <app-button-component
                title="Deseleccionar todos"
                class="my-2"
                outlined
                colors="primary"
                width-size="180px"
                @btnAction="collectionIds(permisos, 'deseleccionar')"
                :disabled="loading"
              />
            </v-col>
            <v-divider class="my-4"></v-divider>
          </v-row>
        </template>
        <v-card-text>
          <v-row
            no-gutters
            class="overflow-auto"
            :style="
              sm
                ? {
                    'max-height': '280px'
                  }
                : {
                    'max-height': '320px'
                  }
            "
          >
            <v-col cols="12" class="d-flex justify-center align-center">
              <v-row no-gutters>
                <v-col v-for="(permiso, index) in permisos" :key="index" cols="6">
                  <v-checkbox color="primary" v-model="form.permisos" :value="permiso.id">
                    <template v-slot:label>
                      <span
                        class="text-capitalize"
                        style="font-weight: 500; color: #1d1e4c"
                        :style="
                          xs
                            ? {
                                fontSize: 'small'
                              }
                            : {
                                fontSize: 'medium'
                              }
                        "
                        >{{ permiso.nombre }}</span
                      >
                    </template>
                  </v-checkbox>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </app-content-component>
  </v-container>
</template>
