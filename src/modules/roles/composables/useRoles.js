import { ref } from 'vue'
import { rolesServices } from '@/services'
import useToastAlert from '@/utils/useToastAlert'

const { showToastAlert } = useToastAlert()

const useRoles = () => {
  const roles = ref([])
  const role = ref({})
  const headers = ref([
    { title: 'Nombre', value: 'nombre', align: 'center', sortable: false },
    { title: 'Acrónimo', value: 'acronimo', align: 'center', sortable: false },
    { title: 'Estado', value: 'id_estado', align: 'center', sortable: false },
    { title: 'Acciones', value: 'actions', align: 'center', sortable: false }
  ])
  const loading = ref(false)
  const itemsPerPage = ref(5)
  const page = ref(1)
  const totalItems = ref(0)
  const filtros = ref({
    nombre: '',
    acronimo: ''
  })
  const showConfirmationDialog = ref(false)
  const sendRequest = ref(false)

  const obtenerRoles = async () => {
    loading.value = true
    const params = {
      paginate: true,
      page: page.value,
      per_page: itemsPerPage.value
    }

    if (filtros.value.nombre) {
      params.nombre = filtros.value.nombre
    }

    if (filtros.value.acronimo) {
      params.acronimo = filtros.value.acronimo
    }

    const { data: response } = await rolesServices.obtenerRoles(params)
    roles.value = response?.data || []
    totalItems.value = response?.total || 0
    loading.value = false
  }

  const changePage = async (value) => {
    page.value = value
    await obtenerRoles()
  }

  const limpiarFiltros = async () => {
    if (!filtros.value.nombre && !filtros.value.acronimo) return
    filtros.value.nombre = ''
    filtros.value.acronimo = ''
    page.value = 1
    await obtenerRoles()
  }

  const deleteRole = async (data) => {
    sendRequest.value = true
    const idEstado = data.id_estado === 1 ? 2 : 1
    const response = await rolesServices.eliminarRol(data.id, idEstado)
    if (response.status === 200) {
      const message = response?.data?.message
        ? response?.data?.message
        : idEstado === 1
          ? 'Perfil activado correctamente'
          : 'Perfil desactivado correctamente'
      sendRequest.value = false
      showConfirmationDialog.value = false
      role.value = {}
      showToastAlert(message, 'success')
      await obtenerRoles()
    }
  }

  return {
    changePage,
    headers,
    obtenerRoles,
    role,
    roles,
    totalItems,
    loading,
    page,
    itemsPerPage,
    filtros,
    limpiarFiltros,
    deleteRole,
    showConfirmationDialog,
    showConfirmation: (item) => {
      showConfirmationDialog.value = true
      role.value = { ...item }
    },
    closeConfirmation: () => {
      showConfirmationDialog.value = false
      role.value = {}
    },
    sendRequest
  }
}

export default useRoles
