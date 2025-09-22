import network from '@/utils/useConfigApi'
import { ENDPOINTS } from '@/constants/endpoints'

// Tipo de Financiamiento
const obtenerTiposFinanciamiento = async (params = {}) => network.get(ENDPOINTS.TIPO_FINANCIAMIENTO.BASE, { params })

const crearTipoFinanciamiento = async (data) => network.post(ENDPOINTS.TIPO_FINANCIAMIENTO.BASE, data)

const activarTipoFinanciamiento = async (id) => network.patch(ENDPOINTS.TIPO_FINANCIAMIENTO.ACTIVAR(id))

const desactivarTipoFinanciamiento = async (id, motivo) => network.patch(ENDPOINTS.TIPO_FINANCIAMIENTO.DESACTIVAR(id), { motivo })

const eliminarTipoFinanciamiento = async (id) => network.delete(ENDPOINTS.TIPO_FINANCIAMIENTO.DELETE(id))

export default {
    obtenerTiposFinanciamiento,
    crearTipoFinanciamiento,
    activarTipoFinanciamiento,
    desactivarTipoFinanciamiento,
    eliminarTipoFinanciamiento
}
