<template>
  <div class="usuarios" v-if="isAdmin">
    <h1>Lista de Usuarios</h1>
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Contraseña</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="usuario in usersList" :key="usuario.id">
          <td>{{ usuario.u_name }}</td>
          <td>{{ usuario.u_mail }}</td>
          <td>{{ usuario.u_password }}</td>
          <td>
            <button @click="selectUserForEdit(usuario)" class="edit-btn">
              Editar
            </button>
            <button @click="confirmDelete(usuario.id)" class="delete-btn">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-else class="error">
    <h1>Inicia sesion como Administrador</h1>
  </div>
  

  <!-- Editar Usuario-->

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
import axios from "axios";

export default {
  name: "UserList",
  data() {
    return {
      usersList: [],
      selectedUser: null,
      showEditForm: false,
      isAdmin: false
    };
  },
  created() {
  // Verificar si el usuario es admin
  this.isAdmin = localStorage.getItem("isAdmin") === 'true';
  if (!this.isAdmin) {
    this.$router.push('/'); // Redirigir a home si no es admin
    alert("No tienes permisos para acceder a esta página");
    return; // Agregar este return
  } else {
    this.isAdmin = true;
    this.fetchUsers();
  }
},
  methods: {
    fetchUsers() {
      axios
      //cambiar la url Rafa
        .get("https://localhost:7198/api/Users")
        .then((response) => {
          this.usersList = response.data;
        })
        .catch((error) => {
          console.error("Error al cargar usuarios", error);
        });
    },
    selectUserForEdit(usuario) {
      this.selectedUser = { ...usuario };
      this.showEditForm = true;
    },
    closeEditForm() {
      this.showEditForm = false;
      this.selectedUser = null;
    },
    updateUser() {
      axios
      // cambiar la url Rafa
        .put(
          `https://localhost:7198/api/Users/${this.selectedUser.id}`,
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
    confirmDelete(id) {
      if (confirm("¿Deseas eliminar este usuario?")) {
        this.deleteUser(id);
      }
    },
    deleteUser(id) {
      //cambiar la url Rafa
      axios
        .delete(`https://localhost:7198/api/Users/${id}`)
        .then(() => {
          this.fetchUsers();
          alert("Usuario eliminado correctamente");
        })
        .catch((error) => {
          console.error("Error al eliminar usuario", error);
        });
    },
    mounted() {
      if (localStorage.getItem("isAdmin") === "true") {
        this.isAdmin = true;
      }
    }
  },
};
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
  background-color: #2e2f36;
  color: white;
  padding: 10px 20px;
  border: white 2px solid;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-inline: 50px;
}

.edit-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.9);
}

.delete-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.9);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #222;
  padding: 30px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  color: white;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 8px;
  background-color: #333;
  border: 1px solid #555;
  color: white;
  border-radius: 5px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.submit-btn {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 10px 16px;
  cursor: pointer;
  border-radius: 5px;
}

.cancel-btn {
  background-color: #e67e22;
  color: white;
  border: none;
  padding: 10px 16px;
  cursor: pointer;
  border-radius: 5px;
}

.error {
  color: red;
  text-align: center;
  margin-top: 30px;
  margin-bottom: 30px;
}
</style>
