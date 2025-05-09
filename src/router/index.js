import { createRouter, createWebHistory } from 'vue-router'
import ArticulosPage from '../components/ArticulosPage.vue'

const routes = [
  { path: '/articulos', name: 'Articulos', component: ArticulosPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
