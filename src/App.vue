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

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: white;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
    scroll-behavior: smooth;
}

:root {
    --header-height: 80px;
    --scroll-y: 0;
}

body.no-scroll {
    overflow: hidden;
}

.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
}

ul li a {
    color: white;
    text-decoration: none;
}

</style>
