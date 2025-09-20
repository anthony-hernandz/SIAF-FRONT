import network from '@/utils/useConfigApi'
import { ENDPOINTS } from '@/constants/endpoints'

const obtenerCaracteristicas = async (params = {}) => network.get(ENDPOINTS.CARACTERISTICAS.BASE, { params })

const obtenerCaracteristica = async (id) => network.get(ENDPOINTS.CARACTERISTICAS.GET_ONE(id))

const crearCaracteristica = async (data) => network.post(ENDPOINTS.CARACTERISTICAS.CREATE, data)

const actualizarCaracteristica = async (id, data) => network.put(ENDPOINTS.CARACTERISTICAS.UPDATE(id), data)

const eliminarCaracteristica = async (id) => network.delete(ENDPOINTS.CARACTERISTICAS.DELETE(id))

const activarCaracteristica = async (id, data) => network.patch(ENDPOINTS.CARACTERISTICAS.ACTIVATE(id), data)

const desactivarCaracteristica = async (id, data) => network.patch(ENDPOINTS.CARACTERISTICAS.DEACTIVATE(id), data)

export default {
  obtenerCaracteristicas,
  obtenerCaracteristica,
  crearCaracteristica,
  actualizarCaracteristica,
  eliminarCaracteristica,
  activarCaracteristica,
  desactivarCaracteristica
}
