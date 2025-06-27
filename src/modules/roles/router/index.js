export default [
  {
    path: '/perfiles',
    name: 'perfiles',
    meta: {
      title: 'Perfiles',
      canAccess: ['ADMIN_SUPER_USER', 'LISTAR_PERFIL']
    },
    component: () => import(/* webpackChunkName: "perfiles" */ '../views/RolesView.vue')
  },
  {
    path: '/perfiles/:operation/:id?',
    name: 'perfiles-form',
    meta: {
      title: 'Perfiles',
      canAccess: ['ADMIN_SUPER_USER', 'CREAR_PERFIL', 'EDITAR_PERFIL']
    },
    component: () => import(/* webpackChunkName: "perfiles-form" */ '../views/RolesFormView.vue')
  }
]
