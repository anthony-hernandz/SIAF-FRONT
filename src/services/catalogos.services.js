import network from '@/utils/useConfigApi'

import { ENDPOINTS } from '@/constants/endpoints'

// Tipo Activo
const obtenerTiposActivo = async (params = {}) => network.get(ENDPOINTS.CATALOGS.BASE, { params })

const crearTipoActivo = async (data) => network.post(ENDPOINTS.CATALOGS.BASE, data)

const eliminarTipoActivo = async (id) => network.delete(ENDPOINTS.CATALOGS.DELETE_TIPO_ACTIVO(id))

const activarTipoActivo = async (id, data) => network.patch(ENDPOINTS.CATALOGS.ACTIVAR_TIPO_ACTIVO(id), data)

const desactivarTipoActivo = async (id, data) => network.patch(ENDPOINTS.CATALOGS.DESACTIVAR_TIPO_ACTIVO(id), data)

export default {
  obtenerTiposActivo,
  crearTipoActivo,
  eliminarTipoActivo,
  activarTipoActivo,
  desactivarTipoActivo
}