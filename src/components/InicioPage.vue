<template>
  <div>
    <HomePage @login-success="handleLoginSuccess" />
    <UserList :isAdmin="isAdmin" />
  </div>
</template>

<script>
import HomePage from './HomePage.vue'
import UserList from './UserList.vue'

export default {
  name: 'InicioPage',
  components: { HomePage, UserList },
  data() {
    return {
      isAdmin: localStorage.getItem("isAdmin") === 'true'
    }
  },
  methods: {
    handleLoginSuccess(data) {
      this.isAdmin = data.isAdmin
      localStorage.setItem("isAdmin", data.isAdmin)
    }
  }
}


</script>
