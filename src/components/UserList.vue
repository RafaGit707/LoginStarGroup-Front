<template>
    <div class="usuarios">
      <h1>Lista de Usuarios</h1>
      <ul>
        <li v-for="usuario in usersList" :key="usuario.id">
          {{ usuario.u_name }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';

  export default {
    name: "UserList",
    data() {
    return {
        usersList: []
    };
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
    }
    },
    mounted() {
        this.fetchUsers();
    }

  }
  </script>
  
  <style scoped>
  .usuarios {
    padding: 20px;
    max-width: 100%;
    padding: var(--header-height);
    text-align: center;
    font-size: large;
  }
  ul {
    list-style: none;
    padding: 10px;
  }
  li {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
    font-size: large;
  }
  </style>
  