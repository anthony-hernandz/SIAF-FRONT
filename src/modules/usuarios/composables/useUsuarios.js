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
 //Para el manejo de las dependencias en el formulario
 const dependencias = ref([])

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
        nombres: `${element.primerNombre} ${element.primerApellido}`,
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

  // Creando un array de IDs de roles y permisos a partir de `items`.
  const rolesIds = items.value.map(item => item.rolId);

  //validacion
   /* if (v$.value.$invalid) {
    v$.value.$touch()
    console.log('Validación fallida en el frontend. Revise los mensajes de error en el formulario.');
  return
   } */
 

  
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
  }
console.log( perfil.value);
 

  // Las contraseñas se añaden SOLO si estamos creando un nuevo usuario
  if (!usuario.value.id) { // Si NO hay ID de usuario (es una creación)
    body.password = usuario.value.password; // Campo 'password' capturado desde formulario
    // Nota: 'passwordRepeat' es solo para validación en el frontend y no se envía al backend.
  }
  

  console.log('Body de la petición a enviar (solo email, password, idRol):', body);

  // Enviar la petición al backend
  sendRequest.value = true
  try {
    if (usuario.value.id) {
      // Si el usuario tiene ID, es una actualización (PUT).
      // updateUsersDTO en backend omite la contraseña, así que no se envia.
      response = await usuariosServices.actualizarUsuario(usuario.value.id, body)
    } else {
      // Si el usuario no tiene ID, es una creación (POST).
      response = await usuariosServices.crearUsuario(body)
    }

    // Maneja la respuesta del backend
    if (response.status === 201 || response.status === 200) {
      const message = response?.data?.message
        ? response.data.message
        : response.status === 201
          ? 'Usuario creado correctamente'
          : 'Usuario actualizado correctamente'
      
      showToastAlert(message, 'success').then(() => {
        showFormDialog.value = false
        // Resetear el objeto usuario completamente para limpiar el formulario
        usuario.value = {
          id: null, primerNombre: '', segundoNombre: '', tercerNombre: '', email: '',
          primerApellido: '', segundoApellido: '', fechaNacimiento: '', paisNacimiento: null,
          documento: '', username: '', establecimiento: null, dependencia: '',
          password: '', passwordRepeat: '', perfiles: [], permisos: []
        }
        //  habilitar la validación de frontend 
        // v$.value.$reset() 
        obtenerUsuarios()
      })
    } else {
      // Manejar otros códigos de estado o errores de la API que no sean 200/201
      const errorMessage = response?.data?.message || 'Error al guardar el usuario (respuesta no exitosa).'
      showToastAlert(errorMessage, 'error')
    }
  } catch (error) {
    // Capturar errores de red o errores lanzados por el servicio
    console.error('Error al guardar el usuario:', error)
    // El mensaje de error del backend suele estar en error.response.data.message
    const errorMessage = error.response?.data?.message || 'Hubo un problema al conectar con el servidor.'
    showToastAlert(errorMessage, 'error')
  } finally {
    sendRequest.value = false // Finalizar el estado de petición en curso
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
  const permisosTitles = permisosTemporales.value.map(p => p.title).join(', ');
  const permisosIds = permisosTemporales.value.map(p => p.value);

  items.value.push({
    rol: perfil.value.title,
    rolId: perfil.value.value, 
    permiso: permisosTitles,
    permisoIds: permisosIds, 
  });

  permisosTemporales.value = []; // Resetear para la siguiente selección
  perfil.value = null; // Resetear el perfil para la siguiente selección
}

  const deleteElement = (item) => {
    items.value.splice(items.value.indexOf(item), 1);
  }

  //Para dependencias
  const obtenerDependencias = async (idEstablecimiento) => {
  if (!idEstablecimiento) {
    dependencias.value = []
    return
  }
  try {
    const response = await dashboardServices.getDependencias(idEstablecimiento) 
    const array = []
    if (response.status === 200) {
      response.data.dependencias.forEach((item) => {
        array.push({ title: item.nombre, value: item.id, disabled: false })
      })
      dependencias.value = array
    }
  } catch (error) {
    console.error('Error al obtener dependencias:', error)
    dependencias.value = []
  }
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
    deleteElement,
    dependencias,
    obtenerDependencias
  }
}

export default useUsuarios
