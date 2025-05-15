import { createRouter, createWebHistory } from 'vue-router'
import CatalogoProductos from '@/components/CatalogoProductos.vue'
import UserList from '@/components/UserList.vue'

const routes = [
  { path: '/admin-dashboard', name: 'Admin', component: UserList },
  { path: '/catalogo', name: 'Catalogo', component: CatalogoProductos }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
