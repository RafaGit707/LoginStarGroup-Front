<template>

  <div class="usuarios" v-if="currentUserIsAdmin">

    <section class="img-titulo">
        <h1 class="titulo-top">Usuarios</h1>
    </section>

    <div class="busqueda">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar por nombre o correo"
        class="filter-input"
      />
      <img class="search-button" src="../assets/search_icon.svg" alt="">
    </div>

    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Contraseña</th>
          <th class="botones-accion"><img class="add-button" src="../assets/ic-add.png" alt=""></th>
        </tr>
      </thead>
      <tbody>
        <!-- <tr v-for="usuario in usersList" :key="usuario.id"> -->
        <tr v-for="usuario in filteredUsers" :key="usuario.id">
          <td>{{ usuario.u_name }}</td>
          <td>{{ usuario.u_mail }}</td>
          <td>{{ usuario.u_password }}</td>
          <td class="botones-accion">
            <img class="edit" src="../assets/edit_ic.svg" alt="" @click="selectUserForEdit(usuario)">
            <img class="delete" src="../assets/delete_ic.svg" alt="" @click="confirmDelete(usuario.id)">
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-else class="usuarios">
    <h1>Acceso denegado</h1>
    <p>Solo los administradores pueden ver la lista de usuarios.</p>
    <p>Si eres un administrador, por favor inicia sesión.</p>
  </div>

  <div v-if="showEditForm" class="modal-overlay">
    <div class="modal-content">
      <form @submit.prevent="updateUser">
        <h2>Editar Usuario</h2>
        <div class="form-group">
          <label for="edit-name">Nombre</label>
          <input
            v-model="selectedUser.u_name"
            type="text"
            id="edit-name"
            required
          />
        </div>
        <div class="form-group">
          <label for="edit-email">Correo electrónico</label>
          <input
            v-model="selectedUser.u_mail"
            type="email"
            id="edit-email"
            required
          />
        </div>
        <div class="form-group">
          <label for="edit-password">Contraseña</label>
          <input
            v-model="selectedUser.u_password"
            type="password"
            id="edit-password"
            required
          />
        </div>
        <div class="modal-buttons">
          <button type="submit" class="submit-btn">Guardar</button>
          <button type="button" @click="closeEditForm" class="cancel-btn">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>

</template>

<script>
import HeaderPage from '@/components/HeaderPage.vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig.js';
import { jwtDecode } from 'jwt-decode';

const ADMIN_EMAIL = 'antonio.carnero@star-group.net';

export default {
  name: "UserList",
  props: ['isAdmin'],
  data() {
    return {
        usersList: [],
        selectedUser: null,
        showEditForm: false,
        searchQuery: ""
    };
  },
  mounted() {
    if (this.currentUserIsAdmin) {
      this.fetchUsers();
    }
  },
  computed: {
     currentUserIsAdmin() {
      const token = localStorage.getItem('authToken');
      if (!token) return false;
      try {
        const decodedToken = jwtDecode(token);
        // Verificar expiración también
        if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem('authToken'); // Limpiar token expirado
            return false;
        }
        return decodedToken.email && decodedToken.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      } catch (e) {
        localStorage.removeItem('authToken'); // Limpiar token inválido
        return false;
      }
    },
    filteredUsers() {
      const query = this.searchQuery.toLowerCase();
      return this.usersList.filter(user =>
        user.u_name.toLowerCase().includes(query) ||
        user.u_mail.toLowerCase().includes(query)
      );
    }
  },
  methods: {

    fetchUsers() {
      axios.get(API_BASE_URL+'Users')
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
      axios
        .delete(API_BASE_URL+`Users/${id}`)
        .then(() => {
          this.fetchUsers();
          HeaderPage.methods.logout();
          alert("Usuario eliminado correctamente");
        })
        .catch((error) => {
          console.error("Error al eliminar usuario", error);
        });
    },
    confirmDelete(id) {
      if (confirm("¿Deseas eliminar este usuario?")) {
        this.deleteUser(id);
      }
    },
    selectUserForEdit(usuario) {
      this.selectedUser = { ...usuario };
      this.showEditForm = true;
    },
    updateUser() {
      axios
        .put(
          API_BASE_URL+`Users/${this.selectedUser.id}`,
          this.selectedUser
        )
        .then(() => {
          this.fetchUsers();
          this.closeEditForm();
        })
        .catch((error) => {
          console.error("Error al actualizar usuario", error);
        });
    },
    closeEditForm() {
      this.showEditForm = false;
      this.selectedUser = null;
    }
  }
}
</script>
