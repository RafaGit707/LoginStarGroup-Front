import { createRouter, createWebHistory } from 'vue-router'
import CatalogoProductos from '@/components/CatalogoProductos.vue'
import UserList from '@/components/UserList.vue'
import { jwtDecode } from 'jwt-decode';
import HeaderPage from '@/components/HeaderPage.vue';
/*import IndexPage from '@/components/IndexPage.vue';*/

const ADMIN_EMAIL = 'antonio.carnero@star-group.net';

const routes = [
  { path: '/index', name: 'HeaderPage', component: HeaderPage },
  { path: '/admin-dashboard', name: 'Catalogo Productos', component: CatalogoProductos, meta: { requiresAdmin: true } },
  { path: '/users-dashboard', name: 'Admin', component: UserList, meta: { requiresAdmin: true } },
  /*{ path: '/', name: 'Index', component: IndexPage},*/
]

function isAuthenticatedAndAdmin() {
  const token = localStorage.getItem('authToken');
  if (!token) return { authenticated: false, isAdmin: false };
  try {
    const decoded = jwtDecode(token);
    const expired = decoded.exp * 1000 < Date.now();
    if (expired) {
        localStorage.removeItem('authToken');
        return { authenticated: false, isAdmin: false };
    }
    const isAdmin = decoded.email && decoded.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    return { authenticated: true, isAdmin: isAdmin };
  } catch (e) {
    localStorage.removeItem('authToken');
    return { authenticated: false, isAdmin: false };
  }
}

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const authStatus = isAuthenticatedAndAdmin();

  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (authStatus.authenticated && authStatus.isAdmin) {
      next(); // Permitido
    } else {
      alert('Acceso denegado. Se requieren permisos de administrador.');
      if (authStatus.authenticated) {
        next(from.path || '/admin-dashboard'); // Si está logueado pero no es admin, a la página anterior o catálogo
      } else {
        next('/index'); // Si no está logueado, a la página principal (que podría tener el login)
      }
    }
  } else if (to.matched.some(record => record.meta.requiresAuth)) { // Para rutas que solo requieren autenticación
    if (authStatus.authenticated) {
        next();
    } else {
        alert('Por favor, inicia sesión para acceder a esta página.');
        next('/index');
    }
  }
  else {
    next(); // Rutas públicas
  }
});

export default router;