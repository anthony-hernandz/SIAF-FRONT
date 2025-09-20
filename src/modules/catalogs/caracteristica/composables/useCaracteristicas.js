import { ref } from 'vue'
import caracteristicasService from '@/services/caracteristicas.sevices'

export default function useCaracteristicas() {
  // estado reactivo
  const caracteristicas = ref([])
  const pagination = ref({
    page: 1,
    per_page: 10,
    total: 0,
    offset: 1,
    limit: 10
  })
  const search = ref('')
  const loading = ref(false)
  const error = ref(null)

  /**
   * Obtener lista de características con búsqueda y paginación
   */
  const obtenerCaracteristicas = async () => {
    loading.value = true
    error.value = null
    try {
      const params = {
        page: pagination.value.page,
        per_page: pagination.value.per_page,
        paginate: true,
        nombre: search.value && search.value.length >= 3 ? search.value : undefined
      }

      const { data } = await caracteristicasService.obtenerCaracteristicas(params)

      caracteristicas.value = data.caracteristicas || []
      pagination.value.total = data.pagination.total
      pagination.value.limit = data.pagination.limit
      pagination.value.offset = data.pagination.offset
    } catch (err) {
      console.error('Error al obtener características:', err)
      error.value = err.response?.data?.message || 'Error al cargar características'
    } finally {
      loading.value = false
    }
  }

  /**
   * Obtener una característica por ID
   */
  const obtenerCaracteristica = async (id) => {
    try {
      const { data } = await caracteristicasService.obtenerCaracteristica(id)
      return data
    } catch (err) {
      console.error('Error al obtener característica:', err)
      throw err
    }
  }

  /**
   * Crear característica
   */
  const crearCaracteristica = async (payload) => {
    try {
      const { data } = await caracteristicasService.crearCaracteristica(payload)
      await obtenerCaracteristicas()
      return data
    } catch (err) {
      console.error('Error al crear característica:', err)
      throw err
    }
  }

  /**
   * Actualizar característica
   */
  const actualizarCaracteristica = async (id, payload) => {
    try {
      const { data } = await caracteristicasService.actualizarCaracteristica(id, payload)
      await obtenerCaracteristicas()
      return data
    } catch (err) {
      console.error('Error al actualizar característica:', err)
      throw err
    }
  }

  /**
   * Activar característica
   */
  const activarCaracteristica = async (id, payload) => {
    try {
      const { data } = await caracteristicasService.activarCaracteristica(id, payload)
      await obtenerCaracteristicas()
      return data
    } catch (err) {
      console.error('Error al activar característica:', err)
      throw err
    }
  }

  /**
   * Desactivar característica
   */
  const desactivarCaracteristica = async (id, payload) => {
    try {
      const { data } = await caracteristicasService.desactivarCaracteristica(id, payload)
      await obtenerCaracteristicas()
      return data
    } catch (err) {
      console.error('Error al desactivar característica:', err)
      throw err
    }
  }

  /**
   * Eliminar característica
   */
  const eliminarCaracteristica = async (id) => {
    try {
      await caracteristicasService.eliminarCaracteristica(id)
      await obtenerCaracteristicas()
    } catch (err) {
      console.error('Error al eliminar característica:', err)
      throw err
    }
  }

  return {
    // state
    caracteristicas,
    pagination,
    search,
    loading,
    error,

    // métodos
    obtenerCaracteristicas,
    obtenerCaracteristica,
    crearCaracteristica,
    actualizarCaracteristica,
    activarCaracteristica,
    desactivarCaracteristica,
    eliminarCaracteristica
  }
}
