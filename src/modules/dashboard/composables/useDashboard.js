import { ref } from 'vue'
import useDashboardStore from '@/store/dashboard'

const useDashboard = () => {
  const { obtenerEstablecimientos } = useDashboardStore();

  const establecimientos = ref([]);
  const establecimiento = ref();

  const llenarEstablecimientos = async () => {
    const array = [];
    const response = await obtenerEstablecimientos();
    response.forEach((item) => {
      array.push({ title: item.nombre, value: item.id, disabled: false });
    })
    establecimientos.value = array
  }

  return {
    llenarEstablecimientos,
    establecimientos,
    establecimiento,
  }
}

export default useDashboard
