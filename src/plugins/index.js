import { loadFonts } from './webfontloader'
import vuetify from './vuetify'
import pinia from '../store'
import router from '../router'
import Vue3Toasity from 'vue3-toastify'

import 'vue3-toastify/dist/index.css'

export function registerPlugins(app) {
  loadFonts()
  app.use(vuetify).use(pinia).use(router).use(Vue3Toasity)
}

export function registerGlobalComponents(app) {
  const components = import.meta.glob('@/components/**/*.vue', { eager: true })
  Object.entries(components).forEach(([path, definition]) => {
    const componentName = path
      .split('/')
      .pop()
      .replace(/\.\w+$/, '')
    app.component(componentName, definition.default)
  })
}
