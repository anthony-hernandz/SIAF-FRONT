<script setup>
import useUtils from '@/utils/useUtils'
import useUsuarios from '../composables/useUsuarios' 
import { onMounted } from 'vue'
import UsuariosForm from './UsuariosForm.vue' 
import { watch } from 'vue'

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
  }
})

// Funcion que realiza un pequeña espera antes de ejecutar la busqueda en el backend, 
// pero si se escribe algo nuevo se reinicia la espera
function debounce(fn, delay) {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// Realiza la busqueda pero con 500ms despues de que el usuario deja de escribir
const debouncedBuscarUsuarios = debounce(() => {
  obtenerUsuarios()
}, 500)

// Cuando cambia el texto en el buscador se esperan 500ms y se realiza la busqueda automatica
watch(() => [filtros.value.username], debouncedBuscarUsuarios)
</script>

<template>
  <v-container fluid class="bg-backgroundLay dashboard-usuarios">

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
          label="Ingrese nombre del usuario"
          variant="outlined"
          density="compact"
          append-inner-icon="mdi-magnify"
        ></v-text-field>
      </v-col>
      <v-spacer></v-spacer>
      <v-col
        cols="12"
        xs="12"
        sm="12"
        md="4"
        lg="4"
        xl="4"
        xxl="4"
        class="d-flex align-start justify-end"
        v-if="verificarPermisoFtn('CREAR_USUARIO')"
      >
        <app-button-component
          title="Agregar"
          colors="primaryBackground"
          @btnAction="() => $router.push({ name: 'usuarios-agregar' })"
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
    <!--Boton para poder regresar a la pagina anterior-->
    <v-row class="mt-6">
      <v-col
        cols="12"
        class="d-flex justify-end"
      >
        <app-button-component
          title="Regresar"
          colors="primaryBackground"
          @btnAction="() => $router.back()"
          :send-request="false"
        />
      </v-col>
    </v-row>

    <app-dialog-component
      :show="showFormDialog"
      :title="usuario.id ? 'Editar usuario' : 'Agregar usuario'"
      textBtn="Guardar"
      @close="closeForm"
      @confirm="guardarUsuario"
      max-width="1200"
      :send-request="sendRequest"
      :disabled-btn-cancelar="sendRequest"
    >
      <template v-slot:body>
        <!-- inserta componente UsuariosForm.vue -->
        <UsuariosForm @close="closeForm" />
      </template>
    </app-dialog-component>
  </v-container>
</template>
<style>
.dashboard-usuarios {
  padding: 30px;
  margin-top: -30px;
  margin-bottom: 10px;
  min-height: 850px;
  height: auto;
}
</style>