<template>
  <div id="app">
    <HeaderPage @login-success="handleLoginSuccess" @navigate-admin-section="handleAdminSectionNavigation"/>

    <main class="main-container">
      <router-view :key="$route.fullPath + (keySuffixForView || '')" ref="currentView"/>
    </main>

    <FooterPage/>
  </div>
</template>

<script>
import HeaderPage from './components/HeaderPage.vue'
import FooterPage from './components/FooterPage.vue'
import { jwtDecode } from 'jwt-decode';
import CatalogoProductos from './components/CatalogoProductos.vue';

export default {
  name: 'App',
  components: {
    HeaderPage,
    FooterPage
  },
  data() {
    return {
      appIsAdmin: false,
      keySuffixForView: '',
      isAdmin: localStorage.getItem("isAdmin") === 'true'
    };
  },
   created() {
    // Opcional: Si App.vue necesita saber el estado de admin al cargar
    const token = localStorage.getItem('authToken');
    if (token) {
        try {
            const decoded = jwtDecode(token); // Necesitas importar jwtDecode aquí también
            if (decoded.exp * 1000 > Date.now()) {
                 this.appIsAdmin = decoded.email && decoded.email.toLowerCase() === 'antonio.carnero@star-group.net';
            }
        } catch(e) {
            this.appIsAdmin = false;
        }
    }
  },
  methods: {
    handleLoginSuccess(data) {
      this.appIsAdmin = data.isAdmin;
      this.isAdmin = data.isAdmin;
      localStorage.setItem("isAdmin", data.isAdmin);
    },
    // handleAdminSectionNavigation(sectionName) {
    //   // console.log("App.vue - Recibido navigateAdminSection para:", sectionName);
    //   // Actualizar la key puede ayudar si el componente necesita reaccionar incluso si la ruta es la misma
    //   this.currentAdminSectionForView = sectionName + Date.now(); // Añadir timestamp para asegurar cambio de key

    //   this.$nextTick(() => {
    //     const currentViewComponent = this.$refs.currentView;
    //     if (currentViewComponent && typeof currentViewComponent.selectSection === 'function') {
    //       // currentViewComponent.selectSection(sectionName);
    //       this.selectSection(sectionName);
    //     } else if (currentViewComponent && currentViewComponent.$options.name === 'UserList' && sectionName === '/users_dashboard') {
    //       // No es necesario hacer nada si ya estamos en UserList y la "sección" es la propia ruta
    //     } else {
    //       console.warn("App.vue: No se pudo llamar a selectSection en currentView o no es el componente esperado para la sección:", sectionName);
    //     }
    //   });
    // },
    handleAdminSectionNavigation(sectionName) {
      // console.log("App.vue - Recibido evento navigateAdminSection para:", sectionName);

      this.$nextTick(() => {
        // this.$refs.currentView es la instancia del componente <router-view>
        // El componente actualmente renderizado por el router-view es accesible a través de $refs.currentView.$refs.default (si no tiene nombre)
        // o más genéricamente, a través de $refs.currentView.$slots.default()[0].component.ctx (más complejo y menos estable)
        // Una forma más robusta es acceder al componente de la ruta activa.
        
        // Obtener el componente de la ruta actualmente activa
        // Esto asume que la ruta /admin-dashboard tiene un solo componente principal
        //const routeComponentInstance = this.$refs.currentView?.$refs?.default || this.$refs.currentView; 
        // A veces, si <router-view> tiene un slot por defecto, el componente está en $refs.default
        // Si no, routeComponentInstance podría ser el componente mismo si router-view no anida más.

        // Es más seguro obtener el componente activo a través de las rutas coincidentes
        //const matchedRoute = this.$route.matched[this.$route.matched.length - 1]; // Última ruta coincidente
        
        // Para acceder a la instancia del componente actual de la ruta, necesitamos la instancia del router-view.
        // Y de la instancia del router-view, podemos obtener el componente hijo
        // Esta parte es un poco más complicada porque Vue Router no expone directamente la instancia del componente hijo de manera sencilla.

        // *Manera más sencilla si $refs.currentView es el componente deseado (depende de cómo Vue renderice router-view)*
        // A veces, this.$refs.currentView SÍ es el componente que router-view renderiza directamente.
        const actualViewComponent = this.$refs.currentView;

        // console.log("App.vue - actualViewComponent:", actualViewComponent);
        // console.log("App.vue - actualViewComponent.$options.name:", actualViewComponent ? actualViewComponent.$options.name : 'undefined');
        CatalogoProductos.methods?.selectSection(sectionName);

        if (actualViewComponent && actualViewComponent.$options.name === 'CatalogoProductos') {
          if (typeof actualViewComponent.selectSection === 'function') {
            // console.log(`App.vue: Llamando a selectSection('${sectionName}') en CatalogoProductos`);
            actualViewComponent.selectSection(sectionName);
          } else {
            console.warn("App.vue: CatalogoProductos no tiene un método selectSection.");
          }
        } else if (actualViewComponent && actualViewComponent.$options.name === 'UserList' && this.$route.path === '/users-dashboard') {
            // Si es UserList y la navegación fue a su propia ruta /admin-users (lo cual ya ocurrió), no hacer nada especial.
            // El componente UserList se montará y cargará sus propios datos.
            // console.log("App.vue: Navegación a UserList, no se requiere selectSection aquí.");
        } else {
          console.warn(
            "App.vue: No se pudo llamar a selectSection. Componente actual:", 
            actualViewComponent ? actualViewComponent.$options.name : 'ninguno',
            "Ruta actual:", this.$route.path,
            "Sección solicitada:", sectionName
          );
        }
      });
    }
  }
}
</script>
