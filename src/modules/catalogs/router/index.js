export default [
    {
        path: '/administracion/catalogos/ambientes',
        name: 'ambiente',
        meta: {
            title: 'Ambiente',
        },
        component: () => import(/* webpackChunkName: "ambiente" */ '../ambiente/ambiente.vue')},
    {
      path: '/administracion/establecimiento',
      name: 'ambiente',
      meta: {
        title: 'Ambiente',
      },
      component: () => import(/* webpackChunkName: "ambiente" */ '../establecimiento/establecimiento.vue')},
    {
        path: '/administracion/catalogos/caracteristica',
        name: 'caracteristica',
        meta: {
            title: 'caracteristica',
        },
        component: () => import(/* webpackChunkName: "caracteristica" */ '../caracteristica/caracteristica.vue')},
    {
        path: '/administracion/catalogos/establecimiento',
        name: 'establecimiento',
        meta: {
              title: 'establecimiento',
        },
        component: () => import(/* webpackChunkName: "establecimiento" */ '../establecimiento/establecimiento.vue')},
    {
        path: '/administracion/catalogos/clase',
        name: 'clase',
        meta: {
            title: 'Clase',
        },
        component: () => import(/* webpackChunkName: "clase" */ '../clase/clase.vue')},
    {
        path: '/administracion/catalogos/estado-activo-fisico',
        name: 'estado-activo-fisico',
        meta: {
            title: 'Estado activo físico',
        },
        component: () => import(/* webpackChunkName: "estadoActivoFisico" */ '../estadoActivoFisico/estadoActivoFisico.vue')},
    {
        path: '/administracion/catalogos/estado-movimiento',
        name: 'estado-movimiento',
        meta: {
          title: 'Estado movimiento',
        },
        component: () => import(/* webpackChunkName: "estadoMovimiento" */ '../estadoMovimiento/estadoMovimiento.vue')},
    {
        path: '/administracion/catalogos/grupo',
        name: 'grupo',
        meta: {
          title: 'Grupo',
        },
        component: () => import(/* webpackChunkName: "grupo" */ '../grupo/grupo.vue')},
    {
        path: '/administracion/catalogos/procedencia',
        name: 'procedencia',
        meta: {
          title: 'Procedencia',
        },
        component: () => import(/* webpackChunkName: "procedencia" */ '../procedencia/procedencia.vue')},
    {
        path: '/administracion/catalogos/subclase',
        name: 'subclase',
        meta: {
          title: 'Subclase',
        },
        component: () => import(/* webpackChunkName: "subclase" */ '../subclase/subclase.vue')},
    {
        path: '/administracion/catalogos/tipo-activo-catalogo',
        name: 'tipo-activo-catalogo',
        meta: {
          title: 'Tipo activo',
        },
        component: () => import(/* webpackChunkName: "tipoActivo" */ '../tipoActivo/tipoActivo.vue')},
    {
        path: '/administracion/catalogos/tipo-financiamiento',
        name: 'tipo-financiamiento',
        meta: {
          title: 'Tipo financiamiento',
        },
        component: () => import(/* webpackChunkName: "tipoFinanciamiento" */ '../tipoFinanciamiento/tipoFinanciamiento.vue')},
    {
        path: '/administracion/catalogos/tipo-movimiento',
        name: 'tipo-movimiento',
        meta: {
          title: 'Tipo movimiento',
        },
        component: () => import(/* webpackChunkName: "tipoMovimiento" */ '../tipoMovimiento/tipoMovimiento.vue')},
    {
        path: '/administracion/catalogos/tipo-transaccion',
        name: 'tipo-transaccion',
        meta: {
          title: 'Tipo transaccion',
        },
        component: () => import(/* webpackChunkName: "tipoTransaccion" */ '../tipoTransaccion/tipoTransaccion.vue')},
    {
        path: '/administracion/catalogos/unidades',
        name: 'unidades',
        meta: {
          title: 'Unidades',
        },
        component: () => import(/* webpackChunkName: "unidades" */ '../unidades/unidad.vue')},
  ]
