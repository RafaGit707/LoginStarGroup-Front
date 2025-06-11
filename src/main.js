import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import mitt from 'mitt' // 1. Importa mitt
import "../src/assets/css/main.css"

// 2. Crea la instancia de la aplicación
const app = createApp(App)

// 3. Crea el emisor de eventos
const emitter = mitt()

// 4. Asigna el emisor a las propiedades globales de la app
//    Vue lo hará accesible en todos los componentes como `this.emitter`
app.config.globalProperties.emitter = emitter

// 5. Usa el router
app.use(router)

// 6. Finalmente, monta la aplicación en el DOM
app.mount('#app')