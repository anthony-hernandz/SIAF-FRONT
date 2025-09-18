
import { computed, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { email, helpers, required, requiredIf, sameAs } from '@vuelidate/validators'
import { usuariosServices, rolesServices, dashboardServices } from '@/services'
import useToastAlert from '@/utils/useToastAlert'

const { showToastAlert } = useToastAlert()

let _sharedUseUsuarios = null

export default function useUsuarios() {
  if (_sharedUseUsuarios) return _sharedUseUsuarios

  
  const usuarios = ref([])
  const usuario = ref(crearUsuarioVacio())
  const perfiles = ref([])
  const permisos = ref([])
  const headers = ref([
    { title: 'N°Documento', value: 'codigo', align: 'center', sortable: false },
    { title: 'Nombres', value: 'nombres', align: 'center', sortable: false },
    { title: 'Institución', value: 'institucion', align: 'center', sortable: false },
    { title: 'Establecimiento', value: 'establecimiento', align: 'center', sortable: false },
    { title: 'Rol', value: 'rol', align: 'center', sortable: false },
    { title: 'Estado', value: 'estado', align: 'center', sortable: true },
    { title: 'Acciones', value: 'actions', align: 'center', sortable: false }
  ])
  const loading = ref(false)
  const loadingSelects = ref(false)
  const itemsPerPage = ref(5)
  const page = ref(1)
  const totalItems = ref(0)
  const filtros = ref({
    username: '',
    email: ''
  })
  const showConfirmationDialog = ref(false)
  const showFormDialog = ref(false)
  const sendRequest = ref(false)
  const paises = ref([])
  const perfil = ref()
  const establecimientos = ref([])
  const dependencias = ref([]) // dependencias del formulario
  const permisosTemporales = ref([])
  const items = ref([])

  // Validaciones para formulario de usuario
  const rules = computed(() => ({
    username: {
      required: helpers.withMessage('El nombre de usuario es requerido', required)
    },
    email: {
      required: helpers.withMessage('El correo electrónico es requerido', required),
      email: helpers.withMessage('El correo electrónico no es válido', email)
    },
    password: {
      required: helpers.withMessage(
        'La contraseña es requerida',
        requiredIf(() => !usuario.value.id)
      )
    },
    passwordRepeat: {
      required: helpers.withMessage(
        'La confirmación de la contraseña es requerida',
        requiredIf(() => !usuario.value.id)
      ),
      sameAsPassword: helpers.withMessage(
        'Las contraseñas no coinciden',
        sameAs(usuario.value.password)
      )
    },
    perfiles: {
      required: helpers.withMessage(
        'Debe seleccionar al menos un perfil',
        (value) => value.length > 0
      )
    }
  }))

  const v$ = useVuelidate(rules, usuario)

  const usernameErrors = computed(() =>
    v$.value.username.$errors.map((error) => error.$message)
  )
  const emailErrors = computed(() =>
    v$.value.email.$errors.map((error) => error.$message)
  )
  const passwordErrors = computed(() =>
    v$.value.password.$errors.map((error) => error.$message)
  )
  const passwordRepeatErrors = computed(() =>
    v$.value.passwordRepeat.$errors.map((error) => error.$message)
  )
  const perfilesErrors = computed(() =>
    v$.value.perfiles.$errors.map((error) => error.$message)
  )

  
  const obtenerUsuarios = async () => {
  loading.value = true
  usuarios.value = [] // Limpia la lista de usuarios para mostrar los nuevos segun la busqueda
  const params = {
    paginate: false,
    page: page.value,
    per_page: itemsPerPage.value
  }
  if (filtros.value.username) params.username = filtros.value.username
  if (filtros.value.email) params.email = filtros.value.email

  const { data: response } = await usuariosServices.obtenerUsuarios(params)
  const resultados = response?.users || []

  for (let i = 0; i < resultados.length; i++) {
    const element = resultados[i]

    // soporta distintos formatos de nombre de campo que el backend pueda devolver
    const createdAtStr =
      element.createAt ?? element.createdAt ?? element.created_at ?? null
    const updatedAtStr =
      element.updateAt ?? element.updatedAt ?? element.update_at ?? null

    // parse a timestamps (si existen)
    const createdTs = createdAtStr ? Date.parse(createdAtStr) : null
    const updatedTs = updatedAtStr ? Date.parse(updatedAtStr) : null

    // Se considera  "nuevo" cuando:
    //  - updateAt es null/undefined (no se ha actualizado aún)
    //  - o cuando la diferencia entre created y updated <= 1000 ms (tolerancia)
    const esNuevo = (() => {
      if (updatedTs === null) return true
      if (createdTs === null) return false
      return Math.abs(createdTs - updatedTs) <= 1000 // <= 1s => igual
    })()

    const u = {
      id: element.id,
      codigo: element.n_documento,
      nombres: `${element.primerNombre} ${element.primerApellido}`,
      institucion: element.establecimiento?.institucion?.nombre || '',
      establecimiento: element.establecimiento?.nombre || '',
      rol: element.rol?.name || '',
      estado: element.active,
      createAt: createdAtStr,
      updateAt: updatedAtStr,
      esNuevo
    }
    usuarios.value.push(u)
  }

  totalItems.value = response?.total || 0
  loading.value = false
}



  const obtenerPerfiles = async () => {
    loadingSelects.value = true
    const { data: response } = await rolesServices.obtenerRoles()
    loadingSelects.value = false
    perfiles.value = response.rols.map((item) => ({
      title: item.name,
      value: item.id
    }))
  }

  const obtenerPermisos = async (id) => {
    loadingSelects.value = true
    const { data: response } = await rolesServices.obtenerPermisos(id)
    loadingSelects.value = false
    const array = []
    response.permisos.forEach((item) => {
      item.items.forEach((element) => {
        array.push({ title: element.label, value: element.id, disabled: false })
      })
    })
    permisos.value = array
  }

  const changePage = async (value) => {
    page.value = value
    await obtenerUsuarios()
  }

  const limpiarFiltros = async () => {
    if (!filtros.value.username && !filtros.value.email) return
    filtros.value.username = ''
    filtros.value.email = ''
    page.value = 1
    await obtenerUsuarios()
  }

  const deleteUsuario = async (data) => {
    sendRequest.value = true
    const response = await usuariosServices.eliminarUsuario(data.id)
    if (response.status === 200) {
      const message = response?.data?.message || 'Usuario eliminado correctamente'
      sendRequest.value = false
      showConfirmationDialog.value = false
      usuario.value = crearUsuarioVacio()
      showToastAlert(message, 'success')
      await obtenerUsuarios()
    }
  }

  
  const guardarUsuario = async (router) => {
    let response = null

    // Creando un array de IDs de roles y permisos a partir de `items`.
    const rolesIds = items.value.map(item => item.rolId);

    const body = {
      email: usuario.value.email,
      //  DTO del backend espera 'idRol' como un string.
      idRol: rolesIds[0], // <--- tomando el primer ID del rol del array
      primerNombre: usuario.value.primerNombre,
      segundoNombre: usuario.value.segundoNombre,
      tercerNombre:usuario.value.tercerNombre,
      primerApellido:usuario.value.primerApellido,
      segundoApellido:usuario.value.segundoApellido,
      fecha_nacimiento:usuario.value.fechaNacimiento,
      n_documento:usuario.value.documento,
      establecimiento:usuario.value.establecimiento,
      username:usuario.value.username,
      pais:usuario.value.paisNacimiento,
      dependencia:usuario.value.dependencia,
    }

    // Las contraseñas se añaden SOLO si estamos creando un nuevo usuario
    if (!usuario.value.id) { // Si NO hay ID de usuario (es una creación)
      body.password = usuario.value.password; // Campo 'password' capturado desde formulario
      // Nota: 'passwordRepeat' es solo para validación en el frontend y no se envía al backend.
    }

    sendRequest.value = true
    try {
      if (usuario.value.id) {
        
        
        response = await usuariosServices.actualizarUsuario(usuario.value.id, body)
      } else {
        response = await usuariosServices.crearUsuario(body)
      }

      if (response.status === 201 || response.status === 200) {
        const message =
          response?.data?.message ||
          (response.status === 201
            ? 'Usuario creado correctamente'
            : 'Usuario actualizado correctamente')

        showToastAlert(message, 'success').then(() => {
          showFormDialog.value = false
          usuario.value = crearUsuarioVacio()
          obtenerUsuarios()
          if (router) router.push({ name: 'usuarios' })
        })
      } else {
        const errorMessage =
          response?.data?.message || 'Error al guardar el usuario (respuesta no exitosa).'
        showToastAlert(errorMessage, 'error')
      }
    } catch (error) {
      console.error('Error al guardar el usuario:', error)
      const errorMessage =
        error.response?.data?.message || 'Hubo un problema al conectar con el servidor.'
      showToastAlert(errorMessage, 'error')
    } finally {
      sendRequest.value = false
    }
  }

  // Edicion y agregar nuevo usuario
  const showForm = async (item = null) => {
    showFormDialog.value = true
    v$.value.$reset()

    if (item?.id) {
      loading.value = true;
      try {
        const { data: response } = await usuariosServices.obtenerUsuario(item.id);
        Object.assign(usuario.value, mapearUsuario(response))

        // Busca el objeto de perfil completo para precargar el v-select
        const rolSeleccionado = perfiles.value.find(p => p.value === usuario.value.rol);
        if (rolSeleccionado) {
          perfil.value = rolSeleccionado;
          await obtenerDependencias(usuario.value.establecimiento);
          await obtenerPermisos(rolSeleccionado.value);
        }

        // Carga todos los perfiles y permisos del usuario en la tabla de items
        items.value = [];
        if (response.perfiles && Array.isArray(response.perfiles)) {
          response.perfiles.forEach(p => {
            if (p.permisos && Array.isArray(p.permisos)) {
              p.permisos.forEach(permiso => {
                items.value.push({
                  rol: p.nombre,
                  rolId: p.id,
                  permiso: permiso.nombre || '',
                  permisoIds: [permiso.id]
                });
              });
            }
          });
        }
        await obtenerPaises();
        await getEstablecimiento();

      } catch (error) {
        console.error('Error al obtener usuario para editar:', error);
        showToastAlert('Error al obtener los datos del usuario', 'error');
      } finally {
        loading.value = false;
      }
    } else {
      Object.assign(usuario.value, crearUsuarioVacio())
    }
  }

  const closeForm = () => {
    showFormDialog.value = false
    usuario.value = crearUsuarioVacio()
  }

  
  const verificarEstado = (item) => !!item.estado

  const obtenerPaises = async () => {
    const response = await usuariosServices.obtenerPaises()
    if (response) {
      paises.value = response.data.map((item) => ({
        value: item.id,
        title: item.nombre
      }))
    }
  }

  const getEstablecimiento = async () => {
    const response = await dashboardServices.getEstablecimientos()
    if (response.status === 200) {
      establecimientos.value = response.data.establecimientos.map((item) => ({
        title: item.nombre,
        value: item.id,
        disabled: false
      }))
    }
  }

  const obtenerDependencias = async (idEstablecimiento) => {
    if (!idEstablecimiento) {
      dependencias.value = []
      return
    }
    try {
      const response = await dashboardServices.getDependencias(idEstablecimiento)
      if (response.status === 200) {
        dependencias.value = response.data.dependencias.map((item) => ({
          title: item.nombre,
          value: item.id,
          disabled: false
        }))
      }
    } catch (error) {
      console.error('Error al obtener dependencias:', error)
      dependencias.value = []
    }
  }

  const añadirTabla = () => {
    const permisosTitles = permisosTemporales.value.map((p) => p.title).join(', ')
    const permisosIds = permisosTemporales.value.map((p) => p.value)

    items.value.push({
      rol: perfil.value.title,
      rolId: perfil.value.value,
      permiso: permisosTitles,
      permisoIds: permisosIds
    })

    permisosTemporales.value = []
    perfil.value = null
  }

  const deleteElement = (item) => {
    items.value.splice(items.value.indexOf(item), 1)
  }

  function crearUsuarioVacio() {
    return {
      id: null,
      primerNombre: '',
      segundoNombre: '',
      tercerNombre: '',
      primerApellido: '',
      segundoApellido: '',
      fechaNacimiento: '',
      paisNacimiento: null,
      documento: '',
      username: '',
      email: '',
      establecimiento: null,
      dependencia: null,
      perfiles: [],
      permisos: [],
      rol: null,
      password: '',
      passwordRepeat: ''
    }
  }

  function mapearUsuario(response) {
    return {
      id: response.id,
      primerNombre: response.primerNombre,
      segundoNombre: response.segundoNombre,
      tercerNombre: response.tercerNombre,
      primerApellido: response.primerApellido,
      segundoApellido: response.segundoApellido || '',
      email: response.email || '',
      username: response.username || '',
      paisNacimiento: response.paisNacimiento ?? response.pais_nacimiento ?? null,
      fechaNacimiento: response.fechaNacimiento ?? response.fecha_nacimiento ?? '',
      documento: response.n_documento ?? response.documento ?? '',
      establecimiento: response.establecimiento?.id ?? response.establecimiento_id ?? null,
      dependencia: response.dependencia?.id ?? response.dependencia_id ?? null,
      rol: response.rol?.id ?? response.rol_id ?? null,
      password: '',
      passwordRepeat: ''
    }
  }

  const actualizarEstadoUsuario = async (usuarioId, nuevoEstado) => {
  sendRequest.value = true
  try {
    // El backend espera el campo 'activo' para el estado
    const body = { activo: nuevoEstado }
    const response = await usuariosServices.actualizarEstadoUsuario(usuarioId, body)
    if (response.status === 200) {
      showToastAlert('Estado actualizado correctamente', 'success')
      await obtenerUsuarios()
    } else {
      showToastAlert('No se pudo actualizar el estado', 'error')
    }
  } catch (error) {
    showToastAlert('Error al actualizar el estado', 'error')
  } finally {
    sendRequest.value = false
  }
}


  
  _sharedUseUsuarios = {
    filtros,
    headers,
    usuarios,
    usuario,
    obtenerUsuarios,
    loading,
    itemsPerPage,
    page,
    totalItems,
    changePage,
    limpiarFiltros,
    showConfirmationDialog,
    showConfirmation: (item) => {
      showConfirmationDialog.value = true
      usuario.value = { ...item }
    },
    closeConfirmation: () => {
      showConfirmationDialog.value = false
      usuario.value = crearUsuarioVacio()
    },
    showFormDialog,
    showForm,
    closeForm,
    deleteUsuario,
    sendRequest,
    v$,
    usernameErrors,
    emailErrors,
    passwordErrors,
    passwordRepeatErrors,
    perfilesErrors,
    loadingSelects,
    perfiles,
    permisos,
    paises,
    perfil,
    establecimientos,
    items,
    permisosTemporales,
    obtenerPerfiles,
    obtenerPermisos,
    guardarUsuario,
    verificarEstado,
    obtenerPaises,
    getEstablecimiento,
    añadirTabla,
    deleteElement,
    dependencias,
    obtenerDependencias,
    crearUsuarioVacio,
    mapearUsuario,
    actualizarEstadoUsuario
  }

  return _sharedUseUsuarios
}
