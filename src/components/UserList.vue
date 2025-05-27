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
        @keyup.enter="performSearch" />
      <img
        class="search-button"
        src="../assets/search_icon.svg"
        alt="Buscar"
        @click="performSearch" >
    </div>

    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Contraseña</th>
          <th class="botones-accion">
            <img class="add-button" src="../assets/ic-add.png" alt="Añadir Usuario" @click="openAddUserForm">
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="usuario in paginatedUsers" :key="usuario.id">
          <td>{{ usuario.u_name }}</td>
          <td>{{ usuario.u_mail }}</td>
          <td>{{ usuario.u_password }}</td>
          <td class="botones-accion">
            <img class="edit" src="../assets/editar.png" alt="Editar" @click="selectUserForEdit(usuario)">
            <img class="delete" src="../assets/borrar.png" alt="Eliminar" @click="confirmDelete(usuario.id)">
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination-controls">
      <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Siguiente</button>
    </div>
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

  <div v-if="showAddForm" class="modal-overlay">
    <div class="modal-content">
      <form @submit.prevent="createUser">
        <div class="modal-header">
          <h2>Añadir Nuevo Usuario</h2>
          <button class="close-btn" @click="closeAddUserForm">&times;</button>
        </div>
        <div class="form-group">
          <label for="new-name">Nombre</label>
          <input
            v-model="newUser.u_name"
            type="text"
            id="new-name"
            required
          />
        </div>
        <div class="form-group">
          <label for="new-email">Correo electrónico</label>
          <input
            v-model="newUser.u_mail"
            type="email"
            id="new-email"
            required
          />
        </div>
        <div class="form-group">
          <label for="new-password">Contraseña</label>
          <input
            v-model="newUser.u_password"
            type="password"
            id="new-password"
            required
          />
        </div>
        <div class="modal-buttons">
          <button type="submit" class="submit-btn">Crear Usuario</button>
          <button type="button" @click="closeAddUserForm" class="cancel-btn">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig.js';
import { jwtDecode } from 'jwt-decode';

const ADMIN_EMAIL = 'antonio.carnero@star-group.net';
const ITEMS_PER_PAGE = 15; // Definir el número de elementos por página

export default {
  name: "UserList",
  props: ['isAdmin'],
  data() {
    return {
      usersList: [],
      selectedUser: null,
      showEditForm: false,
      showAddForm: false, // Nueva propiedad para controlar la visibilidad del formulario de añadir
      newUser: {          // Nueva propiedad para almacenar los datos del nuevo usuario
        u_name: '',
        u_mail: '',
        u_password: ''
      },
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: ITEMS_PER_PAGE,
      filteredUsersForPagination: [],
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
        if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem('authToken');
            return false;
        }
        return decodedToken.email && decodedToken.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      } catch (e) {
        localStorage.removeItem('authToken');
        return false;
      }
    },
    totalPages() {
      return Math.ceil(this.filteredUsersForPagination.length / this.itemsPerPage);
    },
    paginatedUsers() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredUsersForPagination.slice(startIndex, endIndex);
    }
  },
  methods: {
    fetchUsers() {
      axios.get(API_BASE_URL + 'Users')
        .then(response => {
          this.usersList = response.data;
          this.filteredUsersForPagination = response.data;
          this.currentPage = 1;
        })
        .catch(error => {
            console.error("Error al cargar usuarios", error);
        });
    },
    performSearch() {
      const query = this.searchQuery.toLowerCase();
      this.filteredUsersForPagination = this.usersList.filter(user =>
        user.u_name.toLowerCase().includes(query) ||
        user.u_mail.toLowerCase().includes(query)
      );
      this.currentPage = 1;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    deleteUser(id) {
      localStorage.setItem('userId', id); // Almacenas el ID del usuario que quieres eliminar
      const currentLoggedInUserId = this.getLoggedInUserId(); // Obtener el ID del usuario logueado
      // Si el ID que quieres eliminar coincide con el ID del usuario logueado
      if (id == currentLoggedInUserId) { // Usar '==' para comparación de tipo suelta si ID puede ser string/number
        alert("No puedes eliminar tu propio usuario.");
        return;
      }

      axios
        .delete(API_BASE_URL + `Users/${id}`)
        .then(() => {
          this.fetchUsers();
          alert("Usuario eliminado correctamente.");
          // Opcional: Si el usuario eliminado era el que tenía la sesión iniciada, forzar cierre de sesión
          if (id == currentLoggedInUserId) {
            // Esto solo sería relevante si el usuario administrador se elimina a sí mismo.
            // En ese caso, es posible que quieras redirigir o recargar la página.
            // Para la mayoría de los casos de uso, esta verificación ya es suficiente.
          }
        })
        .catch((error) => {
          console.error("Error al eliminar usuario", error);
          alert("Error al eliminar usuario.");
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
          API_BASE_URL + `Users/${this.selectedUser.id}`,
          this.selectedUser
        )
        .then(() => {
          this.fetchUsers();
          this.closeEditForm();
          alert("Usuario actualizado correctamente.");
        })
        .catch((error) => {
          console.error("Error al actualizar usuario", error);
          alert("Error al actualizar usuario.");
        });
    },
    closeEditForm() {
      this.showEditForm = false;
      this.selectedUser = null;
    },
    // --- Métodos para Crear Usuario ---
    openAddUserForm() {
      this.newUser = { u_name: '', u_mail: '', u_password: '' }; // Limpiar el formulario
      this.showAddForm = true;
    },
    closeAddUserForm() {
      this.showAddForm = false;
    },
    createUser() {
      axios.post(API_BASE_URL + 'Users', this.newUser)
        .then(() => {
          this.fetchUsers(); // Recargar la lista de usuarios para mostrar el nuevo
          this.closeAddUserForm(); // Cerrar el modal
          alert("Usuario creado correctamente.");
        })
        .catch(error => {
          console.error("Error al crear usuario", error);
          alert("Error al crear usuario: " + (error.response?.data?.message || error.message));
        });
    },
    // Método para obtener el ID del usuario logueado (necesario para la lógica de no eliminarse a sí mismo)
    getLoggedInUserId() {
      const token = localStorage.getItem('authToken');
      if (!token) return null;
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken.id; // Asume que el token decodificado tiene un 'id' del usuario
      } catch (e) {
        console.error("Error al decodificar el token para obtener el ID de usuario:", e);
        return null;
      }
    }
  }
}
</script>
