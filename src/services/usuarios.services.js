import network from '@/utils/useConfigApi'

import { ENDPOINTS } from '@/constants/endpoints'

const obtenerUsuarios = async (params = {}) => network.get(ENDPOINTS.USERS.BASE, { params })

const obtenerUsuario = async (id) => network.get(ENDPOINTS.USERS.GET_USER(id))

const crearUsuario = async (data) => network.post(ENDPOINTS.USERS.BASE, data)

const actualizarUsuario = async (id, data) => network.put(ENDPOINTS.USERS.UPDATE_USER(id), data)

const eliminarUsuario = async (id) => network.delete(ENDPOINTS.USERS.DELETE_USER(id))

const obtenerPaises = async () => network.get('api/v1/admin/usuarios/paises')

export default {
  obtenerUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerPaises
}
