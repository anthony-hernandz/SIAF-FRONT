export default [
  {
    path: '/',
    name: 'dashboard',
    meta: {
      title: 'Dashboard',
      canAccess: ['VIEW_DASHBOARD', 'ADMIN_SUPER_USER']
    },
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/DashboardView.vue')
  },
  {
    path: '/ingreso',
    name: 'ingreso',
    meta: {
      title: 'Ingreso de activos',
      canAccess: ['VIEW_ADMIN']
    },
    component: () => import('../views/DashboardView.vue')
  },
  {
    path: '/reportes',
    name: 'reportes',
    meta: {
      title: 'Reportes',
      canAccess: ['VIEW_ADMIN']
    },
    component: () => import('../views/DashboardView.vue')
  },
  {
    path: '/administracion',
    name: 'administracion',
    meta: {
      title: 'Administración',
      canAccess: ['VIEW_ADMIN']
    },
    component: () => import('../views/DashboardView.vue')
  },
  {
    path: '/administracion/usuarios',
    name: 'usuarios',
    meta: {
      title: 'Usuarios',
      canAccess: ['VIEW_ADMIN']
    },
    component: () => import('../../usuarios/views/UsuariosView.vue')
  },

  {
    path: '/administracion/catalogos/rol',
    name: 'roles',
    meta: {
      title: 'Roles',
    },
    component: () => import(/* webpackChunkName: "unidades" */ '../../roles/views/RolesView.vue')
  },
  {
    path: '/administracion/catalogos',
    name: 'catalogos',
    meta: {
      title: 'Catálogos',
      canAccess: ['VIEW_CATALOGS']
    },
    component: () => import('../../catalogs/CatalogsView.vue')
  },
  {
    path: '/administracion/establecimiento',
    name: 'establecimiento',
    meta: {
      title: 'Establecimiento',
      canAccess: ['VIEW_ESTABLISHMENT']
    },
    component: () => import('../../catalogs/establecimiento/establecimiento.vue')
  },
  {
    path: '/administracion/catalogos/ambientes',
    name: 'ambiente',
    meta: {
      title: 'Ambiente',
    },
    component: () => import(/* webpackChunkName: "ambiente" */ '../../catalogs/ambiente/ambiente.vue')},
  {
    path: '/administracion/catalogos/caracteristica',
    name: 'caracteristica',
    meta: {
      title: 'caracteristica',
    },
    component: () => import(/* webpackChunkName: "caracteristica" */ '../../catalogs/caracteristica/caracteristica.vue')},
  {
    path: '/administracion/catalogos/establecimiento',
    name: 'establecimiento',
    meta: {
      title: 'establecimiento',
    },
    component: () => import(/* webpackChunkName: "establecimiento" */ '../../catalogs/establecimiento/establecimiento.vue')},
  {
    path: '/administracion/catalogos/clase',
    name: 'clase',
    meta: {
      title: 'Clase',
    },
    component: () => import(/* webpackChunkName: "clase" */ '../../catalogs/clase/clase.vue')},
  {
    path: '/administracion/catalogos/estado-activo-fisico',
    name: 'estado-activo-fisico',
    meta: {
      title: 'Estado activo físico',
    },
    component: () => import(/* webpackChunkName: "estadoActivoFisico" */ '../../catalogs/estadoActivoFisico/estadoActivoFisico.vue')},
  {
    path: '/administracion/catalogos/estado-movimiento',
    name: 'estado-movimiento',
    meta: {
      title: 'Estado movimiento',
    },
    component: () => import(/* webpackChunkName: "estadoMovimiento" */ '../../catalogs/estadoMovimiento/estadoMovimiento.vue')},
  {
    path: '/administracion/catalogos/grupo',
    name: 'grupo',
    meta: {
      title: 'Grupo',
    },
    component: () => import(/* webpackChunkName: "grupo" */ '../../catalogs/grupo/grupo.vue')},
  {
    path: '/administracion/catalogos/procedencia',
    name: 'procedencia',
    meta: {
      title: 'Procedencia',
    },
    component: () => import(/* webpackChunkName: "procedencia" */ '../../catalogs/procedencia/procedencia.vue')},
  {
    path: '/administracion/catalogos/subclase',
    name: 'subclase',
    meta: {
      title: 'Subclase',
    },
    component: () => import(/* webpackChunkName: "subclase" */ '../../catalogs/subclase/subclase.vue')},
  {
    path: '/administracion/catalogos/tipo-activo-catalogo',
    name: 'tipo-activo-catalogo',
    meta: {
      title: 'Tipo activo',
    },
    component: () => import(/* webpackChunkName: "tipoActivo" */ '../../catalogs/tipoActivo/tipoActivo.vue')},
  {
    path: '/administracion/catalogos/tipo-financiamiento',
    name: 'tipo-financiamiento',
    meta: {
      title: 'Tipo financiamiento',
    },
    component: () => import(/* webpackChunkName: "tipoFinanciamiento" */ '../../catalogs/tipoFinanciamiento/tipoFinanciamiento.vue')},
  {
    path: '/administracion/catalogos/tipo-movimiento',
    name: 'tipo-movimiento',
    meta: {
      title: 'Tipo movimiento',
    },
    component: () => import(/* webpackChunkName: "tipoMovimiento" */ '../../catalogs/tipoMovimiento/tipoMovimiento.vue')},
  {
    path: '/administracion/catalogos/tipo-transaccion',
    name: 'tipo-transaccion',
    meta: {
      title: 'Tipo transaccion',
    },
    component: () => import(/* webpackChunkName: "tipoTransaccion" */ '../../catalogs/tipoTransaccion/tipoTransaccion.vue')},
  {
    path: '/administracion/catalogos/unidades',
    name: 'unidades',
    meta: {
      title: 'Unidades',
    },
    component: () => import(/* webpackChunkName: "unidades" */ '../../catalogs/unidades/unidad.vue')}
]
