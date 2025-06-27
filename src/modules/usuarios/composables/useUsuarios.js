import { computed, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { email, helpers, required, requiredIf, sameAs } from '@vuelidate/validators'
import { usuariosServices, rolesServices, dashboardServices } from '@/services'
import useToastAlert from '@/utils/useToastAlert'

const { showToastAlert } = useToastAlert()

const useUsuarios = () => {
  const usuarios = ref([])
  const usuario = ref({
    id: null,
    primerNombre: '',
    segundoNombre: '',
    tercerNombre: '',
    email: '',
    primerApellido: '',
    segundoApellido: '',
    fechaNacimiento: '',
    paisNacimiento: null,
    documento: '',
    username: '',
    establecimiento: null,
    dependencia: '',
    perfiles: [],
    permisos: []
  })
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

  const permisosTemporales = ref([])

  const items = ref([])

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

  const usernameErrors = computed(() => {
    return v$.value.username.$errors.map((error) => {
      return error.$message
    })
  })

  const emailErrors = computed(() => {
    return v$.value.email.$errors.map((error) => {
      return error.$message
    })
  })

  const passwordErrors = computed(() => {
    return v$.value.password.$errors.map((error) => {
      return error.$message
    })
  })

  const passwordRepeatErrors = computed(() => {
    return v$.value.passwordRepeat.$errors.map((error) => {
      return error.$message
    })
  })

  const perfilesErrors = computed(() => {
    return v$.value.perfiles.$errors.map((error) => {
      return error.$message
    })
  })

  const obtenerUsuarios = async () => {
    loading.value = true
    const params = {
      paginate: true,
      page: page.value,
      per_page: itemsPerPage.value
    }

    if (filtros.value.username) {
      params.username = filtros.value.username
    }

    if (filtros.value.email) {
      params.email = filtros.value.email
    }

    const { data: response } = await usuariosServices.obtenerUsuarios(params)
    const resultados = response?.users || []
    for (let i = 0; i < resultados.length; i++) {
      const element = resultados[i];
      const usuario = {
        codigo: element.n_documento,
        nombres: `${element.nombres} ${element.apellidos}`,
        institucion: element.establecimiento.institucion.nombre,
        establecimiento: element.establecimiento.nombre,
        rol: element.rol.name,
        estado: element.active
      }
      usuarios.value.push(usuario)
    }
    totalItems.value = response?.total || 0
    loading.value = false
  }

  const obtenerPerfiles = async () => {
    loadingSelects.value = true
    const { data: response } = await rolesServices.obtenerRoles()
    loadingSelects.value = false
    const array = []
    response.rols.forEach((item) => {
      array.push({title: item.name, value: item.id})
    })
    perfiles.value = array || []
  }

  const obtenerPermisos = async (id) => {
    loadingSelects.value = true
    const { data: response } = await rolesServices.obtenerPermisos(id)
    loadingSelects.value = false
    const array = []
    response.permisos.forEach((item) => {
      item.items.forEach((element) => {
        array.push({ title: element.label, value:element.id, disabled: false })
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
      const message = response?.data?.message
        ? response?.data?.message
        : 'Usuario eliminado correctamente'
      sendRequest.value = false
      showConfirmationDialog.value = false
      usuario.value = {}
      showToastAlert(message, 'success')
      await obtenerUsuarios()
    }
  }

  const guardarUsuario = async () => {
    let response = null

    if (v$.value.$invalid) {
      v$.value.$touch()
      return
    }

    const body = {
      primerNombre: primerNombre.value,
      segundoNombre: segundoNombre.value,
      tercerNombre: tercerNombre.value,
      email: correoInstitucional,
      primerApellido: primerApellido.value,
      segundoApellido: segundoApellido.value,
      fechaNacimiento: fechaNacimiento.value,
      paisNacimiento: paisNacimiento.value,
      documento: documento.value,
      username: username.value,
      establecimiento: establecimiento.value,
      dependencia: dependencia.value,
      perfiles: usuario.value.perfiles.map((perfil) => {
        return { id: perfil }
      }),
      permisos: usuario.value.permisos.map((permiso) => {
        return { id: permiso }
      })
    }

    if (usuario.value.id) {
      delete body.password
      delete body.passwordRepeat
    }

    sendRequest.value = true
    if (usuario.value.id) {
      response = await usuariosServices.actualizarUsuario(usuario.value.id, body)
    } else {
      response = await usuariosServices.crearUsuario(body)
    }
    sendRequest.value = false

    if (response.status === 201 || response.status === 200) {
      const message = response?.data?.message
        ? response.data.message
        : response.status === 201
          ? 'Usuario creado correctamente'
          : 'Usuario actualizado correctamente'
      showToastAlert(message, 'success').then(() => {
        showFormDialog.value = false
        usuario.value = {
          id: null,
          username: '',
          email: '',
          password: '',
          passwordRepeat: '',
          perfiles: [],
          permisos: []
        }
        v$.value.$reset()
        obtenerUsuarios()
      })
    }
  }

  const verificarEstado = (item) => {
    if (item.estado) {
      return true
    }
  }

  const obtenerPaises = async () => {
    const response = await usuariosServices.obtenerPaises()

    if (response) {
      response.data.forEach((item) => {
        paises.value.push({ value: item.id, title: item.nombre })
      })
    }
  }

  const getEstablecimiento = async () => {
    const response = await dashboardServices.getEstablecimientos()
    const array = []
    if (response.status == 200) {
      response.data.establecimientos.forEach((item) => {
        array.push({ title: item.nombre, value: item.id, disabled: false });
      })
      establecimientos.value = array;
    }
  }


  const añadirTabla = () => {
    let permisos = ''
    permisosTemporales.value.forEach((item, index) => {
      permisos += item.title + (index < permisosTemporales.value.length - 1 ? ', ' : '')
    })
    items.value.push({ rol: perfil.value.title, permiso: permisos })
    permisosTemporales.value = null
    perfil.value = null
  }

  const deleteElement = (item) => {
    items.value.splice(items.value.indexOf(item), 1);
  }

  return {
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
      usuario.value = {}
    },
    showFormDialog,
    showForm: (item) => {
      showFormDialog.value = true
      v$.value.$reset()
      if (item) {
        item.perfiles = item.perfiles.map((perfil) => perfil?.id)
        item.permisos = item.permisos.map((permiso) => permiso?.id)
        usuario.value = { ...item }
      } else {
        usuario.value = {
          id: null,
          username: '',
          email: '',
          password: '',
          passwordRepeat: '',
          perfiles: [],
          permisos: []
        }
      }
    },
    closeForm: () => {
      showFormDialog.value = false
      usuario.value = {
        id: null,
        username: '',
        email: '',
        password: '',
        passwordRepeat: '',
        perfiles: [],
        permisos: []
      }
    },
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
    deleteElement
  }
}

export default useUsuarios
