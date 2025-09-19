import network from '@/utils/useConfigApi'
import { ENDPOINTS } from '@/constants/endpoints'

const obtenerProcedencias = async (params = {}) => network.get(ENDPOINTS.PROCEDENCIAS.BASE, { params })

const obtenerProcedencia = async (id) => network.get(ENDPOINTS.PROCEDENCIAS.GET_ONE(id))

const crearProcedencia = async (data) => network.post(ENDPOINTS.PROCEDENCIAS.CREATE, data)

const actualizarProcedencia = async (id, data) => network.put(ENDPOINTS.PROCEDENCIAS.UPDATE(id), data)

const eliminarProcedencia = async (id) => network.delete(ENDPOINTS.PROCEDENCIAS.DELETE(id))

const activarProcedencia = async (id) => network.patch(ENDPOINTS.PROCEDENCIAS.ACTIVATE(id))

const desactivarProcedencia = async (id) => network.patch(ENDPOINTS.PROCEDENCIAS.DEACTIVATE(id))

export default {
  obtenerProcedencias,
  obtenerProcedencia,
  crearProcedencia,
  actualizarProcedencia,
  eliminarProcedencia,
  activarProcedencia,
  desactivarProcedencia
}
