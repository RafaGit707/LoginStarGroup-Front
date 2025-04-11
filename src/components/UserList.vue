<template>
  <div class="usuarios">
    <h1>Lista de Usuarios</h1>
    <ul>
      <li v-for="usuario in usersList" :key="usuario.id">
        {{ usuario.u_name }} / {{ usuario.u_mail }}
        <button class="delete" @click="deleteUser(usuario.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
import HomePage from '@/components/HomePage.vue';
import axios from 'axios';

export default {
  name: "UserList",
  data() {
    return {
        usersList: []
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      axios.get('http://localhost:5289/api/Users')
      .then(response => {
          this.usersList = response.data;
      })
      .catch(error => {
          console.error("Error al cargar usuarios", error);
      });
    },
    deleteUser(id) {
      localStorage.setItem('userId', id);
      if (id === localStorage.getItem("userId")) {
        alert("No puedes eliminar tu propio usuario");
        return;
      }
      if (confirm("¿Seguro que quieres eliminar este usuario?")) {
        try {
          axios.delete(`http://localhost:5289/api/Users/${id}`);
          this.fetchUsers();
          HomePage.methods.logout();
        } catch (err) {
          console.error("Error al eliminar usuario", err);
        }
      }
    },
  }
}
</script>

<style scoped>

.usuarios {
  display: flex;
  flex-direction: column;
  padding: 20px;
  max-width: 100%;
  padding: var(--header-height);
  font-size: large;
  background: none;
}

h1 {
  text-align: center;
  font-size: xx-large;
  margin-bottom: 20px;
}

ul {
  list-style: none;
  text-align: center;
  padding: 10px;
}

li {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  font-size: large;
}
.delete {
  font-size: large;
  padding: 10px 15px 10px 15px;
  background: none;
  font-size: 14px;
  margin-right: 30px;
  font-weight: 700;
  color: red;
  border: 2px solid red;
  width: fit-content;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
</style>
  