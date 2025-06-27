import { computed, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import router from '@/router'
import { rolesServices } from '@/services'
import useToastAlert from '@/utils/useToastAlert'

const { showToastAlert } = useToastAlert()

const useFormRoles = () => {
  const permisos = ref([])
  const loading = ref(false)

  const form = ref({
    id: null,
    nombre: '',
    acronimo: '',
    permisos: []
  })

  const title = computed(() => {
    const op = router.currentRoute.value.params.operation
    if (op === 'create') {
      return 'Nuevo perfil'
    } else if (op === 'edit') {
      return 'Editar perfil'
    } else {
      return 'Ver perfil'
    }
  })

  const rules = computed(() => ({
    nombre: {
      required: helpers.withMessage('El nombre es requerido', required)
    },
    acronimo: {
      required: helpers.withMessage('El acrónimo es requerido', required)
    }
  }))

  const v$ = useVuelidate(rules, form)

  const nombreErrors = computed(() => {
    return v$.value.nombre.$errors.map((error) => {
      return error.$message
    })
  })

  const acronimoErrors = computed(() => {
    return v$.value.acronimo.$errors.map((error) => {
      return error.$message
    })
  })

  const obtenerPermisos = async () => {
    loading.value = true
    const { data: response } = await rolesServices.obtenerPermisos()
    loading.value = false
    permisos.value = response || []
  }

  const collectionIds = (permisos, operation) => {
    const ids = []
    permisos.forEach((permiso) => {
      ids.push(permiso.id)
    })

    if (operation === 'seleccionar') {
      ids.forEach((id) => {
        if (!form.value.permisos.includes(id)) {
          form.value.permisos.push(id)
        }
      })
    } else if (operation === 'deseleccionar') {
      ids.forEach((id) => {
        form.value.permisos = form.value.permisos.filter((permisoId) => permisoId !== id)
      })
    }
  }

  const obtenerRole = async (idRole) => {
    loading.value = true
    const { data: response } = await rolesServices.obtenerRole(idRole)
    loading.value = false
    form.value.id = response?.id
    form.value.nombre = response?.nombre
    form.value.acronimo = response?.acronimo
    form.value.permisos = response?.permisos.map((permiso) => permiso.id)
  }

  const guardarRole = async () => {
    let response = null

    if (v$.value.$invalid) {
      v$.value.$touch()
      return
    }

    if (form.value.permisos.length === 0) {
      showToastAlert('Selecciona al menos un permiso', 'info')
      return
    }

    const body = {
      nombre: form.value.nombre,
      acronimo: form.value.acronimo,
      permisos: form.value.permisos
    }
    loading.value = true
    if (form.value.id) {
      response = await rolesServices.actualizarRole(form.value.id, body)
    } else {
      response = await rolesServices.crearRole(body)
    }
    loading.value = false

    if (response.status === 201 || response.status === 200) {
      const message = response?.data?.message
        ? response.data.message
        : response.status === 201
          ? 'Perfil creado correctamente'
          : 'Perfil actualizado correctamente'
      showToastAlert(message, 'success').then(() => {
        router.push({ name: 'perfiles' })
      })
    }
  }

  return {
    title,
    form,
    permisos,
    obtenerPermisos,
    collectionIds,
    v$,
    nombreErrors,
    acronimoErrors,
    loading,
    guardarRole,
    obtenerRole
  }
}

export default useFormRoles
