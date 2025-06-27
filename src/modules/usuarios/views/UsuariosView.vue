<script setup>
import useUtils from '@/utils/useUtils'
import useUsuarios from '../composables/useUsuarios'
import { onMounted } from 'vue'

const {
  filtros,
  obtenerUsuarios,
  usuarios,
  loading,
  headers,
  itemsPerPage,
  totalItems,
  page,
  changePage,
  limpiarFiltros,
  showConfirmationDialog,
  showConfirmation,
  closeConfirmation,
  sendRequest,
  deleteUsuario,
  usuario,
  showFormDialog,
  showForm,
  closeForm,
  perfiles,
  permisos,
  loadingSelects,
  obtenerPerfiles,
  obtenerPermisos,
  v$,
  usernameErrors,
  emailErrors,
  passwordErrors,
  passwordRepeatErrors,
  perfilesErrors,
  guardarUsuario,
  verificarEstado,
} = useUsuarios()

const { verificarPermisoFtn } = useUtils()

onMounted(async () => {
  await obtenerUsuarios()
  if (verificarPermisoFtn('CREAR_USUARIO') || verificarPermisoFtn('EDITAR_USUARIO')) {
    await obtenerPerfiles()
    await obtenerPermisos()
  }
})
</script>

<template>
  <v-container fluid>
    <app-title-component title="Usuarios" />

    <v-row class="mb-4">
      <v-col
        xs="12"
        sm="12"
        md="4"
        lg="4"
        xl="4"
        xxl="4"
        class="d-flex align-center justify-center"
      >
        <v-text-field
          v-model="filtros.username"
          color="primary"
          label="Buscar por usuario"
          variant="outlined"
          density="compact"
          append-inner-icon="mdi-magnify"
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
        class="d-flex align-center justify-center"
      >
        <v-text-field
          v-model="filtros.email"
          color="primary"
          label="Buscar por correo"
          variant="outlined"
          density="compact"
          append-inner-icon="mdi-magnify"
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
        class="d-flex align-start justify-start"
      >
        <app-button-component
          class="mr-4"
          title="Buscar"
          colors="primary"
          @btnAction="
            () => {
              if (!filtros.username && !filtros.email) return
              obtenerUsuarios()
            }
          "
        />
        <app-button-component
          title="Limpiar"
          :outlined="true"
          colors="primary"
          @btnAction="limpiarFiltros"
        />
      </v-col>
      <v-col
        cols="12"
        xs="12"
        sm="12"
        md="12"
        lg="12"
        xl="12"
        xxl="12"
        class="d-flex align-center justify-end"
        v-if="verificarPermisoFtn('CREAR_USUARIO')"
      >
        <app-button-component
          title="Agregar"
          colors="primary"
          @btnAction="showForm"
          :send-request="loadingSelects"
        />
      </v-col>
    </v-row>

    <app-content-component>
      <app-data-table-component
        :correlativo="false"
        :headers="headers"
        :loading="loading"
        :items-per-page="itemsPerPage"
        :items="usuarios"
        :total-items="totalItems"
        :page="page"
        @changePage="changePage"
      >
        <template v-slot:estado="{ item }">
          <app-badge-component
            v-if="verificarEstado(item)"
            color="#E5FFE9"
            fontColor="#37AB47"
            title="Activo"
            border="#9AECA4 md"
          />
          <app-badge-component
            v-if="!verificarEstado(item)"
            color="#FCF2F2"
            fontColor="#B94A48"
            title="Inactivo"
            border="#E63946 md"
            />
        </template>
        <template v-slot:actions="{ item }">
          <app-button-action-table-component
            v-if="verificarPermisoFtn('EDITAR_USUARIO')"
            text="Editar"
            icon="mdi-pencil-outline"
            @btnAction="showForm(item)"
          />
          <app-button-action-table-component
            v-if="verificarPermisoFtn('ELIMINAR_USUARIO')"
            text="Eliminar"
            icon="mdi-trash-can-outline"
            @btnAction="showConfirmation(item)"
          />
        </template>
      </app-data-table-component>
    </app-content-component>

    <app-dialog-component
      :show="showConfirmationDialog"
      title="Eliminar"
      textBtn="Aceptar"
      @close="closeConfirmation"
      @confirm="deleteUsuario(usuario)"
      max-width="500"
      :send-request="sendRequest"
      :disabled-btn-cancelar="sendRequest"
    >
      <template v-slot:body>
        <v-row>
          <v-col cols="12" class="text-center">
            <span>
              <b>¿Desea eliminar el usuario seleccionado?</b><br />Al hacer esta acción, ya no podrá
              recuperar la información.
            </span>
          </v-col>
        </v-row>
      </template>
    </app-dialog-component>

    <app-dialog-component
      :show="showFormDialog"
      :title="usuario.id ? 'Editar usuario' : 'Agregar usuario'"
      textBtn="Guardar"
      @close="closeForm"
      @confirm="guardarUsuario"
      max-width="700"
      :send-request="sendRequest"
      :disabled-btn-cancelar="sendRequest"
    >
      <template v-slot:body>
        <v-row>
          <v-col sm="12" md="6" lg="6" xl="6" xxl="6">
            <v-text-field
              v-model="usuario.username"
              color="primary"
              label="Usuario*"
              variant="outlined"
              density="compact"
              @blur="v$.username.$touch"
              @change="v$.username.$touch"
              :error-messages="usernameErrors"
            ></v-text-field>
          </v-col>
          <v-col sm="12" md="6" lg="6" xl="6" xxl="6">
            <v-text-field
              v-model="usuario.email"
              color="primary"
              label="Correo*"
              variant="outlined"
              density="compact"
              @blur="v$.email.$touch"
              @change="v$.email.$touch"
              :error-messages="emailErrors"
            ></v-text-field>
          </v-col>
          <v-col sm="12" md="6" lg="6" xl="6" xxl="6" v-if="!usuario.id">
            <v-text-field
              v-model="usuario.password"
              color="primary"
              label="Contraseña*"
              variant="outlined"
              density="compact"
              type="password"
              @blur="v$.password.$touch"
              @change="v$.password.$touch"
              :error-messages="passwordErrors"
            ></v-text-field>
          </v-col>
          <v-col sm="12" md="6" lg="6" xl="6" xxl="6" v-if="!usuario.id">
            <v-text-field
              v-model="usuario.passwordRepeat"
              color="primary"
              label="Confirmar contraseña*"
              variant="outlined"
              density="compact"
              type="password"
              @blur="v$.passwordRepeat.$touch"
              @change="v$.passwordRepeat.$touch"
              :error-messages="passwordRepeatErrors"
            ></v-text-field>
          </v-col>
          <v-col sm="12" md="6" lg="6" xl="6" xxl="6">
            <v-autocomplete
              v-model="usuario.perfiles"
              chips
              label="Perfiles*"
              :items="perfiles"
              item-title="nombre"
              item-value="id"
              multiple
              variant="outlined"
              density="compact"
              closable-chips
              @blur="v$.perfiles.$touch"
              @change="v$.perfiles.$touch"
              :error-messages="perfilesErrors"
            ></v-autocomplete>
          </v-col>
          <v-col sm="12" md="6" lg="6" xl="6" xxl="6">
            <v-autocomplete
              v-model="usuario.permisos"
              chips
              label="Permisos*"
              :items="permisos"
              item-title="nombre"
              item-value="id"
              multiple
              variant="outlined"
              density="compact"
              closable-chips
            ></v-autocomplete>
          </v-col>
        </v-row>
      </template>
    </app-dialog-component>
  </v-container>
</template>
