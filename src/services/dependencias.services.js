import network from '@/utils/useConfigApi';
import { ENDPOINTS } from '@/constants/endpoints';

const obtenerDependencias = async (params = {}) =>
  network.get(ENDPOINTS.DEPENDENCIAS.BASE, { params });

export default {
  obtenerDependencias,
};