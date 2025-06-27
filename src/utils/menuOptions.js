export const MENU_OPTIONS = [
  {
    id: 1,
    name: 'Ingreso de activos',
    icon: 'mdi-file-document-plus-outline',
    uri: '/ingreso',
    children: [
      { id: 2, name: 'Nueva solicitud de ingreso', icon: 'mdi-file-plus-outline', uri: '/ingreso/nueva-solicitud' },
      { id: 3, name: 'Listado de solicitudes', icon: 'mdi-clipboard-list-outline', uri: '/ingreso/listado-solicitudes' }
    ]
  },
  {
    id: 4,
    name: 'Traslado de activos',
    icon: 'mdi-truck-cargo-container',
    uri: '/traslado'
  },
  {
    id: 5,
    name: 'Descargo de activos',
    icon: 'mdi-archive-cancel-outline',
    uri: '/descargo'
  },
  {
    id: 6,
    name: 'Reportes',
    icon: 'mdi-file-chart-outline',
    uri: '/reportes',
    children: [
      { id: 7, name: 'Transacciones de activos', icon: 'mdi-chart-line-variant', uri: '/reportes/transacciones' },
      { id: 8, name: 'Reporte 2', icon: 'mdi-chart-bar-stacked', uri: '/reportes/reporte2' },
      { id: 9, name: 'Reporte 3', icon: 'mdi-chart-bar-stacked', uri: '/reportes/reporte3' }
    ]
  },
  {
    id: 10,
    name: 'Administración',
    icon: 'mdi-cog',
    uri: '/administracion',
    children: [
      { id: 11, name: 'Usuarios', icon: 'mdi-account-outline', uri: '/administracion/usuarios' },
      { id: 12, name: 'Catálogos', icon: 'mdi-list-box-outline', uri: '/administracion/catalogos', children: [
          { id: 21, name: 'Tipo activo', icon: 'mdi-barcode', uri: '/administracion/catalogos/tipo-activo-catalogo' },
          { id: 22, name: 'Características', icon: 'mdi-format-list-text', uri: '/administracion/catalogos/caracteristica' },
          { id: 22, name: 'Grupo', icon: 'mdi-arrange-send-backward', uri: '/administracion/catalogos/grupo' },
          { id: 23, name: 'Clase', icon: 'mdi-arrange-bring-to-front', uri: '/administracion/catalogos/clase' },
          { id: 24, name: 'Subclase', icon: 'mdi-arrange-send-to-back', uri: '/administracion/catalogos/subclase' },
          { id: 25, name: 'Tipo financiamiento', icon: 'mdi-currency-usd', uri: '/administracion/catalogos/tipo-financiamiento' },
          { id: 26, name: 'Procedencias', icon: 'mdi-account-outline', uri: '/administracion/catalogos/procedencia' },
          { id: 27, name: 'Estado activo físico', icon: 'mdi-list-status', uri: '/administracion/catalogos/estado-activo-fisico' },
          { id: 28, name: 'Estado de movimientos', icon: 'mdi-bell-badge-outline', uri: '/administracion/catalogos/estado-movimiento' },
          { id: 29, name: 'Tipo de transacción', icon: 'mdi-arrow-decision-outline', uri: '/administracion/catalogos/tipo-transaccion' },
          { id: 30, name: 'Tipo de movimiento', icon: 'mdi-swap-horizontal', uri: '/administracion/catalogos/tipo-movimiento' },
          { id: 31, name: 'Unidades', icon: 'mdi-home-city-outline', uri: '/administracion/catalogos/unidades' },
          { id: 32, name: 'Ambientes', icon: 'mdi-home-city-outline', uri: '/administracion/catalogos/ambientes' },
          { id: 33, name: 'Roles', icon: 'mdi-account-key-outline', uri: '/administracion/catalogos/rol' }
        ]},
      { id: 13, name: 'Establecimientos', icon: 'mdi-office-building-outline', uri: '/administracion/establecimiento' }
    ]
  }
]
