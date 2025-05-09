<template>

  <div class="usuarios" v-if="isAdmin">
    <h1>Lista de Usuarios</h1>

    <input
      v-model="searchQuery"
      type="text"
      placeholder="Buscar por nombre o correo"
      class="filter-input"
    />

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
        <!-- <tr v-for="usuario in usersList" :key="usuario.id"> -->
        <tr v-for="usuario in filteredUsers" :key="usuario.id">
          <td>{{ usuario.u_name }}</td>
          <td>{{ usuario.u_mail }}</td>
          <td>{{ usuario.u_password }}</td>
          <td>
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
    if (this.isAdmin) {
      this.fetchUsers();
    }
  },
  computed: {
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
      axios.get('http://localhost:5289/api/Users')
      .then(response => {
          this.usersList = response.data;
      })
      .catch(error => {
          console.error("Error al cargar usuarios", error);
      });
    },
    deleteUser(id) {
      //cambiar la url Rafa
      localStorage.setItem('userId', id);
      if (id === localStorage.getItem("userId")) {
        alert("No puedes eliminar tu propio usuario");
        return;
      }
      axios
        .delete(`http://localhost:5289/api/Users/${id}`)
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
      // cambiar la url Rafa
        .put(
          `http://localhost:5289/api/Users/${this.selectedUser.id}`,
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

<style scoped>

.usuarios {
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  max-width: 100%;
  padding: var(--header-height);
  font-size: large;
  background: none;
  color: black;
  align-items: center;
  text-align: center;
}

.filter-input {
  padding: 10px;
  margin-bottom: 20px;
  font-size: 16px;
  width: 100%;
  max-width: 400px;
  border: 1px solid #ccc;
  border-radius: 5px;
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

.delete-btn {
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

.button {
  margin-top: 20px;
  background-color: #2e2f36;
  color: white;
  padding: 10px 20px;
  border: white 2px solid;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-inline: 50px;
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
  padding: 40px;
  border-radius: 10px;
  max-width: 90%;
  width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  color: white;
}

.modal-content h2 {
  margin-bottom: 20px;
  text-align: center;
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

.edit {
  cursor: pointer;
  width: 30px;
  height: 30px;
  margin-right: 20px;
}

.delete {
  cursor: pointer;
  width: 30px;
  height: 30px;
  margin-left: 20px;
}


/* Media Queries */

/* Para pantallas menores a 1024px (tablets y móviles grandes) */
@media (max-width: 1024px) {

  .usuarios {
    padding: 60px;
  }

  h1 {
    font-size: x-large;
  }

  table {
    font-size: medium;
  }

  .modal-content {
    max-width: 90%;
  }

  .modal-buttons {
    flex-direction: column;
    align-items: center;
  }

  .submit-btn, .cancel-btn {
    width: 100%;
    margin-bottom: 10px;
  }
  .submit-btn {
    margin-bottom: 0;
  }

  .edit {
    width: 24px;
    height: 24px;
    margin-right: 18px;
  }

  .delete {
    width: 24px;
    height: 24px;
    margin-left: 18px;
  }

}

/* Para pantallas menores a 768px (móviles) */
@media (max-width: 768px) {

  .usuarios {
    padding: 5px;
    padding: 50px;
  }

  table {
    max-width: 95%;
  }

  .modal-buttons {
    flex-direction: column;
    align-items: center;
  }

  .submit-btn, .cancel-btn {
    width: 100%;
    margin-bottom: 10px;
  }

  .submit-btn {
    margin-bottom: 0;
  }

  .edit {
    width: 22px;
    height: 22px;
    margin-right: 18px;
  }

  .delete {
    width: 22px;
    height: 22px;
    margin-left: 18px;
  }

}

/* Para pantallas muy pequeñas (menores a 480px) */
@media (max-width: 480px) {

  .usuarios {
    padding: 5px;
    padding: 35px;
  }

  table {
    max-width: 95%;
    font-size: 15px;
  }

  td {
    padding: 7px;
  }

  th {
    padding: 7px;
  }

  .modal-buttons {
    flex-direction: column;
    align-items: center;
  }

  .submit-btn, .cancel-btn {
    width: 100%;
  }

  .submit-btn {
    margin-bottom: 14px;
  }

  .edit {
    width: 18px;
    height: 18px;
    margin-right: 10px;
  }

  .delete {
    width: 18px;
    height: 18px;
    margin-left: 10px;
  }

}

</style>
  