import { ref } from 'vue'
import { catalogosServices } from '@/services'
import useToastAlert from '@/utils/useToastAlert'

const { showToastAlert } = useToastAlert()

export default function useTipoActivo() {
  // Columnas que se muestran en la tabla
  const headers = ref([
    { title: 'Tipo de Activo', value: 'nombre', align: 'center', sortable: false },
    { title: 'Personal que registró', value: 'registro', align: 'center', sortable: false },
    { title: 'Estado', value: 'estado', align: 'center', sortable: false },
    { title: 'Acciones', value: 'actions', align: 'center', sortable: false }
  ])

  const items = ref([])                                                 // Guarda los tipos de activo para la tabla
  const loading = ref(false)                                            // Indica si esta cargando informacion para la vista
  const sendRequest = ref(false)                                        // Indica que esta enviando una solicitud para deshabilitar los botones en el proceso
  const tipoActivo = ref({ id: null, nombre: '', estado: 'Activo' })    // Almacena temporalmente los datos de un nuevo tipo activo

  // Obtiene todos los tipos de activo, limpia la lista actual, llena la tabla con los resultados y controla el estado de carga
  const obtenerTipoActivos = async () => {
    loading.value = true
    items.value = []

    try {
      const { data: response } = await catalogosServices.obtenerTiposActivo()
      const resultados = response?.tipoactivo || response?.tipoActivos || response?.tipoActivo || []

      for (let i = 0; i < resultados.length; i++) {
        const tipoActivo = resultados[i]
        const t = {
          id: tipoActivo.id,
          nombre: tipoActivo.nombre,
          registro: tipoActivo.registro,
          estado: tipoActivo.estado,
          es_nuevo: tipoActivo.es_nuevo ?? false
        }
        items.value.push(t)
      }
    } catch (err) {
      console.error('Error al obtener tipos de activo:', err)
    } finally {
      loading.value = false
    }
  }

  // Crea un nuevo tipo de activo, valida que tenga nombre, envia los datos, actualiza la tabla y muestra notificacion de exito o de error
  const guardarTipoActivo = async () => {
    if (!tipoActivo.value.nombre || !tipoActivo.value.nombre.trim()) {
      console.warn('Nombre vacio')
      return
    }

    sendRequest.value = true
    try {
      const body = { nombre: tipoActivo.value.nombre.trim() }
      const response = await catalogosServices.crearTipoActivo(body)

      if (response && (response.status === 201 || response.status === 200)) {
        tipoActivo.value = { id: null, nombre: '', estado: 'Activo' }
        await obtenerTipoActivos()
        showToastAlert('Tipo de activo creado correctamente', 'success')
        return response
      } else {
        console.error('Respuesta inesperada al guardar:', response)
        showToastAlert('Error al guardar el tipo de activo', 'error')
        return response
      }
    } catch (err) {
      console.error('guardarTipoActivo error:', err)
      showToastAlert('Error al guardar el tipo de activo', 'error')
      throw err
    } finally {
      sendRequest.value = false
    }
  }

  // Elimina un tipo de activo por su ID, actualiza la tabla y muestra notificacion de exito o de error
  const eliminarTipoActivo = async (id) => {
    loading.value = true
    try {
      const response = await catalogosServices.eliminarTipoActivo(id)
      if (response.status === 200 || response.status === 204) {
        items.value = items.value.filter(item => item.id !== id)
        showToastAlert('Tipo de activo eliminado correctamente', 'success')
      } else {
        showToastAlert('Error al eliminar el tipo de activo', 'error')
      }
    } catch (error) {
      console.error('Error al eliminar tipo de activo:', error)
      showToastAlert(error.response?.data?.message || 'Error al conectar con el servidor', 'error')
    } finally {
      loading.value = false
    }
  }

  // Activa un tipo de activo por su ID, maneja errores en caso de error y muestra notificacion de exito o error
  const activarTipoActivo = async (id) => {
    try {
      const response = await catalogosServices.activarTipoActivo(id, { confirmar: true });
      showToastAlert('Tipo de activo ACTIVADO correctamente', 'success');
      return response;
    } catch (err) {
      console.error('Error al activar tipo de activo:', err);
      showToastAlert(err.response?.data?.message || 'Error al activar el tipo de activo', 'error');
      throw err;
    }
  }

  // Desactiva un tipo de activo con una justificacion, maneja errores en caso de error y muestra notificacion de exito o error
  const desactivarTipoActivo = async (id, motivo) => {
    try {
      const response = await catalogosServices.desactivarTipoActivo(id, { justificacion: motivo });
      showToastAlert('Tipo de activo DESACTIVADO correctamente', 'success');
      return response;
    } catch (err) {
      console.error('Error al desactivar tipo de activo:', err);
      showToastAlert(err.response?.data?.message || 'Error al desactivar el tipo de activo', 'error');
      throw err;
    }
  }

  return {
    headers,
    items,
    loading,
    tipoActivo,
    sendRequest,
    obtenerTipoActivos,
    guardarTipoActivo,
    eliminarTipoActivo,
    activarTipoActivo,
    desactivarTipoActivo
  }
}