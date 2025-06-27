export default [
  {
    path: '/administracion/usuarios',
    name: 'usuarios',
    meta: {
      title: 'Usuarios',
      canAccess: ['ADMIN_SUPER_USER', 'LISTAR_USUARIO']
    },
    component: () => import(/* webpackChunkName: "usuarios" */ '../views/UsuariosView.vue')
  },
  {
    path: '/administracion/usuarios/agregar',
    name: 'usuarios-agregar',
    meta: {
      title: 'Formulario Usuarios',
    },
    component: () => import(/* webpackChunkName: "usuarios-form" */ '../views/UsuariosForm.vue')
  }
]
