import network from '@/utils/useConfigApi'

import { ENDPOINTS } from '@/constants/endpoints'

const obtenerRoles = async (params = {}) => network.get(ENDPOINTS.ROLES.BASE, { params })

const crearRole = async (data) => network.post(ENDPOINTS.ROLES.BASE, data)

const obtenerRole = async (id) => network.get(ENDPOINTS.ROLES.GET_ROLE(id))

const actualizarRole = async (id, data) => network.put(ENDPOINTS.ROLES.UPDATE_ROLE(id), data)

const eliminarRol = async (id, idEstado) => network.put(ENDPOINTS.ROLES.DELETE_ROLE(id, idEstado))

const obtenerPermisos = async (id) => network.get(ENDPOINTS.ROLES.PERMISSIONS(id))

export default {
  obtenerRoles,
  crearRole,
  obtenerRole,
  actualizarRole,
  eliminarRol,
  obtenerPermisos
}
