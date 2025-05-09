import { createRouter, createWebHistory } from 'vue-router'
import InicioPage from '../components/InicioPage.vue'
import CatalogoProductos from '../components/CatalogoProductos.vue'

const routes = [
  { path: '/', name: 'home', component: InicioPage },
  { path: '/catalogo', name: 'catalogo', component: CatalogoProductos }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
