import { createApp } from 'vue'
import { registerGlobalComponents, registerPlugins } from '@/plugins'
import App from './App.vue'

const app = createApp(App)

registerPlugins(app)
registerGlobalComponents(app)

app.mount('#app')
