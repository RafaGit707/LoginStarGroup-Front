<template>
  <div id="app">
    <router-view @login-success="handleLoginSuccess" />
    <FooterPage />
  </div>
</template>

<script>
import FooterPage from './components/FooterPage.vue'

export default {
  name: 'App',
  components: {
    FooterPage
  },
  data() {
    return {
      isAdmin: localStorage.getItem("isAdmin") === 'true'
    };
  },
  methods: {
    handleLoginSuccess(data) {
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
