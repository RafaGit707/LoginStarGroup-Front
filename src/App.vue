<template>
  <HomePage/>
  <UserList/>
</template>

<script>
import HomePage from './components/HomePage.vue'
import UserList from './components/UserList.vue'

export default {
  name: 'App',
  components: {
    HomePage,
    UserList
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

</style>
