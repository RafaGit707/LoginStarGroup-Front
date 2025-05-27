<template>
  
  <HeaderPage @login-success="handleLoginSuccess"/>
  <main class="main-container">
    <router-view/>
  </main>
  
  <FooterPage/>

</template>

<script>
import HeaderPage from './components/HeaderPage.vue'
import FooterPage from './components/FooterPage.vue'
import { jwtDecode } from 'jwt-decode'; 

export default {
  name: 'App',
  components: {
    HeaderPage,
    FooterPage
  },
  data() {
    return {
      appIsAdmin: false,
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
    }
  }
}
</script>
