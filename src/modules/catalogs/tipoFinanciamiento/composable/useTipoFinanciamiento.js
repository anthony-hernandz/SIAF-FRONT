import { ref } from 'vue'
import { tipoFinanciamientoServices } from '@/services'
import useToastAlert from '@/utils/useToastAlert'
import useAuthStore from '@/store/auth'

const { showToastAlert } = useToastAlert()
const auth = useAuthStore()

export default function useTipoFinanciamiento() {
    // Columnas que se muestran en la tabla
    const headers = ref([
        { title: 'Tipo de financiamiento', value: 'nombre', align: 'center', sortable: false },
        { title: 'Personal que registró', value: 'registro', align: 'center', sortable: false },
        { title: 'Estado', value: 'estado', align: 'center', sortable: false },
        { title: 'Acciones', value: 'actions', align: 'center', sortable: false }
    ])

    const items = ref([])                                                        // Guarda los tipos de financiamiento para la tabla
    const loading = ref(false)                                                   // Indica si está cargando información para la vista
    const sendRequest = ref(false)                                               // Indica si está enviando una solicitud para deshabilitar botones en el proceso
    const tipoFinanciamiento = ref({ id: null, nombre: '', estado: 'INACTIVO' }) // Almacena temporalmente los datos de un nuevo tipo de financiamiento
    const searchTimeout = ref(null)                                              // Controla el tiempo de espera en la búsqueda (debounce)

    // Obtiene todos los tipos de financiamiento, limpia la lista actual, llena la tabla con los resultados y controla el estado de carga
    const obtenerTiposFinanciamiento = async (params = {}) => {
        loading.value = true
        items.value = []

        try {
            const { data: response } = await tipoFinanciamientoServices.obtenerTiposFinanciamiento(params)
            const resultados = response || []

            for (let i = 0; i < resultados.length; i++) {
                const tipo = resultados[i]
                const t = {
                    id: tipo.id,
                    nombre: tipo.nombre,
                    registro: tipo.personal_que_registro,
                    estado: tipo.estado,
                    es_nuevo: tipo.esNuevo ?? false
                }
                items.value.push(t)
            }
        } catch (err) {
            console.error('Error al obtener tipos de financiamiento:', err)
            showToastAlert('Error al obtener tipos de financiamiento', 'error')
        } finally {
            loading.value = false
        }
    }

    // Crea un nuevo tipo de financiamiento, valida que tenga nombre, envía los datos, actualiza la tabla y muestra notificación de éxito o error
    const guardarTipoFinanciamiento = async () => {
        if (!tipoFinanciamiento.value.nombre || !tipoFinanciamiento.value.nombre.trim()) {
            showToastAlert('El tipo de financiamiento es obligatorio', 'error')
            return
        }

        sendRequest.value = true
        try {
            const body = {
                nombre: tipoFinanciamiento.value.nombre.trim(),
                personal_que_registro: `${auth.user.nombres} ${auth.user.apellidos}`.trim()
            }

            const response = await tipoFinanciamientoServices.crearTipoFinanciamiento(body)

            tipoFinanciamiento.value = { id: null, nombre: '', estado: 'INACTIVO' }
            await obtenerTiposFinanciamiento()
            showToastAlert('Tipo de financiamiento creado correctamente', 'success')
            return response
        } catch (err) {
            console.error('Error al guardar tipo de financiamiento:', err)
            showToastAlert(err.response?.data?.message || 'Error al guardar el tipo de financiamiento', 'error')
            throw err
        } finally {
            sendRequest.value = false
        }
    }

    // Elimina un tipo de financiamiento por su ID, actualiza la tabla y muestra notificación de éxito o de error
    const eliminarTipoFinanciamiento = async (id) => {
        loading.value = true
        try {
            const response = await tipoFinanciamientoServices.eliminarTipoFinanciamiento(id)
            if (response.status === 200 || response.status === 204) {
                items.value = items.value.filter(item => item.id !== id)
                showToastAlert('Tipo de financiamiento eliminado correctamente', 'success')
            } else {
                showToastAlert('Error al eliminar el tipo de financiamiento', 'error')
            }
        } catch (err) {
            console.error('Error al eliminar tipo de financiamiento:', err)
            showToastAlert(err.response?.data?.message || 'Error al conectar con el servidor', 'error')
        } finally {
            loading.value = false
        }
    }

    // Activa un tipo de financiamiento por su ID, maneja errores y muestra notificación de éxito o error
    const activarTipoFinanciamiento = async (id) => {
        try {
            await tipoFinanciamientoServices.activarTipoFinanciamiento(id)
            showToastAlert('Tipo de financiamiento ACTIVADO correctamente', 'success')
            await obtenerTiposFinanciamiento()
        } catch (err) {
            console.error('Error al activar tipo de financiamiento:', err)
            showToastAlert(err.response?.data?.message || 'Error al activar', 'error')
            throw err
        }
    }

    // Desactiva un tipo de financiamiento con un motivo, maneja errores y muestra notificación de éxito o error
    const desactivarTipoFinanciamiento = async (id, motivo) => {
        try {
            const response = await tipoFinanciamientoServices.desactivarTipoFinanciamiento(id, motivo)
            showToastAlert('Tipo de financiamiento DESACTIVADO correctamente', 'success')
            return response
        } catch (err) {
            console.error('Error al desactivar tipo de financiamiento:', err)
            showToastAlert(err.response?.data?.message || 'Error al desactivar', 'error')
            throw err
        }
    }

    // Búsqueda de tipos de financiamiento con debounce, valida longitud mínima y máxima del término de búsqueda
    const buscarTipoFinanciamiento = (search) => {
        if (searchTimeout.value) clearTimeout(searchTimeout.value)

        searchTimeout.value = setTimeout(async () => {
            if (search && search.length < 3) {
                items.value = []
                showToastAlert('El término de búsqueda debe tener al menos 3 caracteres', 'error')
                return
            }

            if (search && search.length > 50) {
                showToastAlert('El término de búsqueda no puede exceder 50 caracteres', 'error')
                return
            }

            try {
                await obtenerTiposFinanciamiento({ q: search })
            } catch (err) {
                console.error('Error al buscar tipo de financiamiento:', err)
            }
        }, 500) // espera 500ms después de dejar de escribir
    }

    return {
        headers,
        items,
        tipoFinanciamiento,
        loading,
        sendRequest,
        obtenerTiposFinanciamiento,
        guardarTipoFinanciamiento,
        eliminarTipoFinanciamiento,
        activarTipoFinanciamiento,
        desactivarTipoFinanciamiento,
        buscarTipoFinanciamiento
    }
}
