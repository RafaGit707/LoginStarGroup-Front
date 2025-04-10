import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import UserList from '../components/UserList.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/usuarios', name: 'users', component: UserList }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
