<template>
  <div class="usuarios">
    <h1>Lista de Usuarios</h1>
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Contraseña</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="usuario in usersList" :key="usuario.id">
          <td>{{ usuario.u_name }}</td>
          <td>{{ usuario.u_mail }}</td>
          <td>{{ usuario.u_password }}</td>
        </tr>
      </tbody>
    </table>
    <button @click="deleteUser">Eliminar</button>
    <button @click="selectUserForEdit(usuario)">Editar</button>
  </div>



  <!--FORMULARIO EDITAR USUARIO -->

  <div v-if="showEditForm" class="edit-modal">
      <div class="modal-content">
        <form @submit.prevent="updateUser">
          <h2>Editar Usuario</h2>
          <div class="form-group">
            <label for="edit-name">Nombre</label>
            <input v-model="selectedUser.u_name" type="text" id="edit-name" required>
          </div>
          <div class="form-group">
            <label for="edit-email">Correo electrónico</label>
            <input v-model="selectedUser.u_mail" type="email" id="edit-email" required>
          </div>
          <div class="form-group">
            <label for="edit-password">Contraseña</label>
            <input v-model="selectedUser.u_password" type="password" id="edit-password" required>
          </div>
          <button type="submit" class="submit-btn">Guardar cambios</button>
          <button type="button" @click="closeEditForm" class="cancel-btn">Cancelar</button>
        </form>
      </div>
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
        axios.get('https://localhost:7198/api/Users')
        .then(response => {
            this.usersList = response.data;
        })
        .catch(error => {
            console.error("Error al cargar usuarios", error);
        });
    },

    showEditUser() {
        this.showEditUser = true;
    }
    
    },

    mounted() {
        this.fetchUsers();
    }

  }
  </script>
  
  <style scoped>
  .usuarios {
    background-color: #000000;
  }

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

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  td {
    padding: 8px;
    text-align: center;
    border-bottom: 1px solid #ddd;
  }

  
  th {
    background-color: #f2f2f2;
    color: black;
    padding: 8px;
    text-align: center;
    border-bottom: 1px solid #ddd;
  }

  button {
   margin-top: 20px;
   background-color:#2e2f36;
   color: white;
   padding: 10px 20px;
   border: white 2px solid;
   cursor: pointer;
   transition: background-color 0.3s ease;
   margin-inline: 50px;
  }
  

  </style>
  