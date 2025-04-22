<template>
  
  <HomePage @login-success="handleLoginSuccess"/>
  <main class="main-container">
    <UserList :isAdmin="isAdmin"/>
  </main>

</template>

<script>
import HomePage from './components/HomePage.vue'
import UserList from './components/UserList.vue'

export default {
  name: 'App',
  components: {
    HomePage,
    UserList
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
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(7px);
}

</style>
