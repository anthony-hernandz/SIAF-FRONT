import network from '@/utils/useConfigApi'

const getMenu = async () => await network.get('/api/v1/menu')
const getEstablecimientos = async () => await network.get('api/v1/establecimientos')

export default { getMenu, getEstablecimientos }
