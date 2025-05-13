<template>
  <div class="container-header">

    <header>
      <div class="topheader">
        <div class="logo">
          <router-link to="/">
            <img src="@/assets/app.png" class="img-logo" alt="Logo" />
          </router-link>
          <nav class="nav-enlaces">
            <ul>
              <li><router-link to="/">Inicio</router-link></li>
              <li><a class="enlaces" href="#contacto">Contacto</a></li>
            </ul>
          </nav>
        </div>
        <nav>
                <ul>
                    <li v-if="!loggedIn">
                    <a href="#mostrar">
                        <button type="button" class="button-iniciar-sesion" id="abrir-login" @click="showLoginModal">
                        Iniciar Sesión
                        </button>
                    </a>
                    </li>
                    <li class="user-sesion" v-else>
                        <span class="user" style="color: white; cursor: pointer;" @click="toggleUserDetails"> {{ currentUserName }}</span>
                        <button @click="logout" type="button" class="button-cerrar-sesion">Cerrar sesión</button>
                    </li>
                </ul>
            </nav>
      </div>
    </header>
  </div>

  <div class="catalogo-productos" v-if="isAdmin">
    <h1 class="catalogo-titulo">Articulos</h1>

    <input v-model="searchQuery" type="text" placeholder="Buscar por nombre, código o familia" class="search-input" />

    <div class="grid-container">
      <div v-for="producto in filteredProductos" :key="producto.a_id" class="producto-card">
        <h2>{{ producto.a_nombre }}</h2>
        <p><strong>Código:</strong> {{ producto.a_cod }}</p>
        <p><strong>Familia:</strong> {{ producto.fa_id }}</p>
        <p><strong>Unidad:</strong> {{ producto.un_id }}</p>
        <p><strong>Precio:</strong> {{ producto.a_pvp.toFixed(2) }}€</p>
        <p><strong>IVA:</strong> {{ producto.iva_id }}%</p>
        <p><strong>Ultimo precio compra:</strong> {{ producto.a_ultimo_pc.toFixed(2) }}€</p>
        <p><strong>Código de barras:</strong> {{ producto.a_cod_barras }}</p>
        <img class="edit" src="../assets/edit_ic.svg" alt="" @click="selectArticuloForEdit(producto)" />
        <img class="delete" src="../assets/delete_ic.svg" alt="" @click="confirmDelete(producto.a_id)" />
      </div>
      <!--<button class="agregar-btn" @click="agregarArticulo">Agregar Articulo</button>-->
    </div>
  </div>

  <div class="catalogo-unidades" v-if="isAdmin">
    <h1 class="catalogo-titulo">Unidades</h1>
    
    <!--<input v-model="searchQuery" type="text" placeholder="Buscar por nombre" class="search-input" />-->

    <div class="grid-container">
      <div v-for="unidad in filteredUnidades" :key="unidad.un_id" class="unidad-card">
        <p><strong>Id:</strong> {{ unidad.un_id }}</p>
        <p><strong>Nombre:</strong> {{ unidad.un_nombre }}</p>
      </div>
    </div>
  </div>

  <div class="catalogo-iva" v-if="isAdmin">
    <h1 class="catalogo-titulo">IVA</h1>
    
    <!--<input v-model="searchQuery" type="text" placeholder="Buscar por nombre o valor" class="search-input" />-->

    <div class="grid-container">
      <div v-for="iva in filteredIvas" :key="iva.iva_id" class="iva-card">
        <p><strong>Id:</strong> {{ iva.iva_id }}</p>
        <p><strong>Nombre:</strong> {{ iva.iva_nombre }}</p>
        <p><strong>Valor:</strong> {{ iva.iva_value }}%</p>
      </div>
    </div>
  </div>

  <div class="catalogo-familias" v-if="isAdmin">
    <h1 class="catalogo-titulo">Familias</h1>
    
    <!--<input v-model="searchQuery" type="text" placeholder="Buscar por nombre" class="search-input" />-->

    <div class="grid-container">
      <div v-for="familia in filteredFamilias" :key="familia.fa_id" class="familia-card">
        <p><strong>Id:</strong> {{ familia.fa_id }}</p>
        <p><strong>Nombre:</strong> {{ familia.fa_nombre }}</p>
      </div>
    </div>
  </div>

  <div v-else class="denegado">
    <h1>Acceso denegado</h1>
    <p>Solo los administradores pueden ver la lista de articulos y sus relaciones.</p>
    <p>Si eres un administrador, por favor inicia sesión.</p>
  </div>

  <!--FORMULARIO INICIO SESION -->

  <div v-if="showLogin" id="mostrar" class="container1">
    <div class="fondo"></div>
    <div class="contenido">
      <form class="form-container" @submit.prevent="handleLogin">
        <h1>Iniciar sesión</h1>
        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input v-model="user.u_mail" type="email" id="email" name="email" autocomplete="off" required />
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input v-model="user.u_password" type="password" id="password" name="password" autocomplete="off" required />
        </div>
        <button class="submit-btn" type="submit">Iniciar sesión</button>
        <p class="cuenta_p">
          ¿No tienes cuenta?
          <a href="#registro" class="registrarse" @click="showRegister = true">Registrarse</a>
        </p>
        <a id="cerrar" class="cerrar" href="#" @click="closeLoginModal"><img src="@/assets/X-green.png" class="X1"
            id="X1" /></a>
      </form>
    </div>
  </div>
  <!-- FORMULARIO REGISTRO-->

  <div v-if="showRegister" id="registro" class="container1">
    <div class="fondo"></div>
    <div class="contenido">
      <form class="form-container" @submit.prevent="handleRegister">
        <h1>Registrarse</h1>
        <div class="form-group">
          <label for="name">Nombre</label>
          <input v-model="user.u_name" type="text" id="name" name="name" autocomplete="off" required />
        </div>
        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input v-model="user.u_mail" type="email" id="email" name="email" autocomplete="off" required />
        </div>
        <div class="form-group">
          <label for="password2">Contraseña</label>
          <input v-model="user.u_password" type="password" id="password2" name="password2" autocomplete="off" required
            @input="validatePassword">
        </div>
        <div id="error_message" v-if="!isValidPassword">
          <p class="message">
            <img class="X2" :src="isValidLength ? '@/assets/tick.png' : '@/assets/X.png'" alt="X2" />La contraseña debe
            tener entre 8 y 16 caracteres
          </p>
          <p class="message">
            <img class="X2" :src="isValidLowercase ? '@/assets/tick.png' : '@/assets/X.png'" alt="X2" />La contraseña
            debe contener al menos una letra minúscula
          </p>
          <p class="message">
            <img class="X2" :src="isValidUppercase ? '@/assets/tick.png' : '@/assets/X.png'" alt="X2" />La contraseña
            debe contener al menos una letra mayúscula
          </p>
          <p class="message">
            <img class="X2" :src="isValidNumber ? '@/assets/tick.png' : '@/assets/X.png'" alt="X2" />La contraseña debe
            contener al menos un número
          </p>
          <p class="message">
            <img class="X2" :src="isValidSpecialChar ? '@/assets/tick.png' : '@/assets/X.png'" alt="X2" />La contraseña
            debe contener al menos un carácter especial
            (#$@!%&*?_)
          </p>
        </div>
        <button class="submit-btn" type="submit">Registrarse</button>
        <p class="cuenta_p">
          ¿Tienes cuenta?
          <a href="#mostrar" class="registrarse" @click="showLogin = true">Iniciar Sesion</a>
        </p>
        <a id="cerrar" class="cerrar" href="#" @click="closeRegisterModal"><img src="@/assets/X-green.png" class="X1"
            id="X1" /></a>
      </form>
    </div>
  </div>

  <!-- FORMULARIO DE EDICION-->
   <div v-if="showEditForm" class="modal-overlay">
    <div class="modal-content">
      <form @submit.prevent="updateProducto">
        <h2>Editar Articulo</h2>
        <div class="form-group">
          <label for="edit-name">Nombre</label>
          <input
            v-model="selectedProducto.a_nombre"
            type="text"
            id="edit-name"
            required
          />
        </div>
        <div class="form-group">
          <label for="edit-cod">Código</label>
          <input
            v-model="selectedProducto.a_cod"
            type="text"
            id="edit-cod"
            required
          />
        </div>
        <div class="form-group">
          <label for="edit-unidad_id">Unidad</label>
          <input
            v-model="selectedProducto.un_id"
            type="number"
            id="edit-unidad_id"
            required
          />
        </div>
        <div class="form-group">
          <label for="edit-iva_id">Iva</label>
          <input
            v-model="selectedProducto.iva_id"
            type="number"
            id="edit-iva_id"
            required
          />
        </div>
        <div class="form-group">
          <label for="edit-ultimo_costo">Costo</label>
          <input
            v-model="selectedProducto.a_ultimo_pc"
            type="number"
            id="edit-ultimo_costo"
            required
          />
        </div>
        <div class="form-group">
          <label for="edit-precio_venta">Precio</label>
          <input
            v-model="selectedProducto.a_pvp"
            type="number"
            id="edit-precio_venta"
            required
          />
        </div>
        <div class="form-group">
          <label for="edit-codigo-barras">Codigo de Barras</label>
          <input
            v-model="selectedProducto.a_cod_barras"
            type="text"
            id="edit-codigo-barras"
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
  name: "CatalogoProductos",
  emits: ['loginSuccess'],
  data() {
    return {
      productos: [],
      unidades: [],
      ivas: [],
      familias: [],
      user: {
        u_mail: "",
        u_password: "",
        u_name: ""
      },

      showLogin: false,
      loggedIn: false,
      currentUserName: '',
      showRegister: false,
      showEditForm: false,
      selectedProducto: null,

      isValidPassword: false,
      isValidLength: false,
      isValidLowercase: false,
      isValidUppercase: false,
      isValidNumber: false,
      isValidSpecialChar: false
      ,
      searchQuery: "",
    };
  },
  computed: {
    isAdmin() {
      const username = localStorage.getItem('userName');
      return username && username.toLowerCase() === 'admin';
    },
    filteredProductos() {
      const query = this.searchQuery.toLowerCase();
      return this.productos.filter((producto) =>
        [producto.a_nombre, producto.a_cod, producto.familia]
          .some((field) => field && field.toLowerCase().includes(query))
      );
    },
    filteredUnidades() {
      const query = this.searchQuery.toLowerCase();
      return this.unidades.filter((unidad) =>
        [unidad.un_nombre]
          .some((field) => field && field.toLowerCase().includes(query))
      );
    },
    filteredIvas() {
      const query = this.searchQuery.toLowerCase();
      return this.ivas.filter((iva) =>
        [iva.iva_nombre, iva.iva_value]
          .some((field) => field && field.toLowerCase().includes(query))
      );
    },

    filteredFamilias() {
      const query = this.searchQuery.toLowerCase();
      return this.familias.filter((familia) =>
        [familia.fa_nombre]
          .some((field) => field && field.toLowerCase().includes(query))
      );
    },

    

    

    isLoginValid() {
      return this.user.u_mail && this.user.u_password;
    },
    isRegisterValid() {
      return this.user.u_name && this.user.u_mail && this.user.u_password;
    }
    
  },
  mounted() {
    if (this.isAdmin) {
      this.fetchProductos();
      this.fetchUnidades();
      this.fetchIvas();
      this.fetchFamilias();
      this.checkRole();
    }
  },

  created() {
    // Verifica si ya hay sesión iniciada
    const token = localStorage.getItem('authToken');
        const userName = localStorage.getItem('userName');
        if (token && userName) {
            this.loggedIn = true;
            this.currentUserName = userName;
            this.isAdmin = localStorage.getItem("isAdmin") === 'true';
        }
  },

  watch: {
    showLogin(newValue) {
      if (newValue) {
        document.body.classList.add("no-scroll");
      } else {
        document.body.classList.remove("no-scroll");
      }
    },
    showRegister(newValue) {
      if (newValue) {
        document.body.classList.add("no-scroll");
      } else {
        document.body.classList.remove("no-scroll");
      }
    },
  },

  beforeUnmount() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
  },

  methods: {
    async fetchProductos() {
      try {
        const response = await axios.get("https://localhost:7198/api/articulos");
        this.productos = response.data.map((p) => ({
          ...p,
          familia: p.familia?.fa_nombre || "Sin familia",
          unidad: p.unidad?.un_nombre || "Sin unidad",
          iva: p.iva?.iva_value || 0,
        }));
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    },

    async fetchUnidades() {
      try {
        const response = await axios.get("https://localhost:7198/api/Unidades");
        this.unidades = response.data;
      } catch (error) {
        console.error("Error al cargar las unidades:", error);
      }
    },

    async fetchIvas() {
      try {
        const response = await axios.get("https://localhost:7198/api/Iva");
        this.ivas = response.data;
      } catch (error) {
        console.error("Error al cargar los IVA:", error);
      }
    },

    async fetchFamilias() {
      try {
        const response = await axios.get("https://localhost:7198/api/Familias");
        this.familias = response.data;
      } catch (error) {
        console.error("Error al cargar las familias:", error);
      }

    },

    deleteProduct(id) {
      localStorage.setItem('productId', id);
      axios.delete("https://localhost:7198/api/articulos/" + id)
        .then(() => {
          this.fetchProductos();
          alert("Producto eliminado correctamente");
        })
        .catch((error) => {
          console.error("Error al eliminar producto", error);
        })
    },

    confirmDelete(id) {
      if (confirm("¿Deseas eliminar este producto?")) {
        this.deleteProduct(id);
      }
    },

    selectArticuloForEdit(producto) {
      console.log("Producto seleccionado para edición:", producto);
      this.selectedProducto = {...producto};
      this.showEditForm = true;
    },
    updateProducto() {
      axios.put(`https://localhost:7198/api/Articulos/${this.selectedProducto.a_id}`, this.selectedProducto

      )
      .then(() => {
        alert("Producto actualizado correctamente");
        this.fetchProductos();
        this.closeEditForm();
      })
      .catch((error) => {
        console.error("Error al actualizar producto", error);
      });
    },

    closeEditForm() {
      this.showEditForm = false;
      this.selectedProducto = null;
    },
    checkRole() {
            this.isAdmin = localStorage.getItem("isAdmin") === 'true';
            console.log("isAdmin:", this.isAdmin);
            console.log("userName:", this.currentUserName);
        },
        showLoginModal() {
            this.showLogin = true;
            this.showRegister = false;
        },

        showRegisterModal() {
            this.showRegister = true;
            this.showLogin = false;
        },

        closeLoginModal() {
            this.showLogin = false;
        },

        closeRegisterModal() {
        this.showRegister = false;
        },

        validatePassword() {
            const password = this.user.u_password;

            this.isValidLength = password.length >= 8 && password.length <= 16;
            this.isValidLowercase = /[a-z]/.test(password);
            this.isValidUppercase = /[A-Z]/.test(password);
            this.isValidNumber = /\d/.test(password);
            this.isValidSpecialChar = /[#$@!%&*?_]/.test(password);

            this.isValidPassword = this.isValidLength &&
                                this.isValidLowercase &&
                                this.isValidUppercase &&
                                this.isValidNumber &&
                                this.isValidSpecialChar;

            return this.isValidPassword && this.isValidLength &&
                                this.isValidLowercase &&
                                this.isValidUppercase &&
                                this.isValidNumber &&
                                this.isValidSpecialChar;
        },

        handleLogin() {
            console.log("Iniciar sesión con:", this.user);// user es tu objeto reactivo
            if (!this.user.u_password || !this.user.u_mail) {
                alert("Por favor, completa todos los campos.");
                return;
            }

            console.log("Datos a enviar:", JSON.stringify(this.user));

            axios.post('https://localhost:7198/api/Login/login', this.user )
            .then(response => {
                if (response.data.message === 'Login exitoso') {
                    const userName = response.data.nombre;
                    const email = this.user.u_mail;

                    this.$emit('login-success', {
                        isAdmin: email === 'admin@admin.com'
                    });

                    localStorage.setItem('authToken', response.data.token);
                    localStorage.setItem('userName', userName);
                    localStorage.setItem('isAdmin', email === 'admin@admin.com' ? 'true' : 'false');

                    this.loggedIn = true;
                    this.currentUserName = userName;
                    this.isAdmin = email === 'admin@admin.com';

                    this.user = { u_name: '', u_mail: '', u_password: '' };
                    this.showLogin = false;

                    this.checkRole();
                    window.location.reload();
                    } else {
                        alert("Credenciales incorrectas");
                    }
                })
            .catch(error => {
                console.error("Error en la petición:", error);

                if (error.response) {
                    console.error("Respuesta del servidor:", error.response.data);
                } else if (error.request) {
                    console.error("No hubo respuesta del servidor:", error.request);
                    alert("No hubo respuesta del servidor.");
                } else {
                    console.error("Error al configurar la petición:", error.message);
                    alert(`Error: ${error.message}`);
                }

                alert("Hubo un problema con el inicio de sesión, intenta nuevamente.");
            });
        },

        fetchUsers() {
            console.log("Fetching users...");
        },

        handleRegister() {
            // if (!this.validatePassword()) return;
            axios.post('https://localhost:7198/api/Users', this.user)
            .then(response => {
                this.showRegister = false;
                this.fetchUsers();
                console.log(response.data);
            })
            .catch(error => {
                console.error("Error al registrar usuario", error);
                alert("Error al registrar usuario");
            });
        },

        logout() {
            this.$emit('logout');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userName');
            localStorage.setItem('isAdmin', 'false');
            localStorage.removeItem('isAdmin');
            this.loggedIn = false;
            this.currentUserName = '';
            this.isAdmin = false;
            window.location.reload();
        }
  },
};
</script>

<style scoped>
.catalogo-titulo {
  padding: 40px;
  text-align: center;
  color: #2e2f36;
}
.catalogo-productos {
  padding: 40px;
  text-align: center;
}
.catalogo-unidades {
  padding: 40px;
  text-align: center;
}
.catalogo-iva {
  padding: 40px;
  text-align: center;
}
.catalogo-familia {
  padding: 40px;
  text-align: center;
}

.search-input {
  padding: 10px;
  width: 100%;
  max-width: 400px;
  margin-bottom: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.producto-card h2 {
  margin-top: 0;
  margin-bottom: 15px;
  text-align: center;
}

.unidad-card h2 {
  margin-top: 0;
}
.iva-card h2 {
  margin-top: 0;
}
.familia-card h2 {
  margin-top: 0;
}

.edit {
  cursor: pointer;
  width: 30px;
  height: 30px;
  margin-left: 20px;
}

.delete {
  cursor: pointer;
  width: 30px;
  height: 30px;
  margin-left: 20px;
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

/* MEDIA */

.img-logo {
  width: min-content;
  height: min-content;
  max-width: 70px;
  max-height: 70px;
}

/* HEADER */

.container-header {
  display: flex;
  max-width: 100%;
  width: 100%;
  justify-content: center;
  padding-top: var(--header-height);
}

.img-titulo {
  display: flex;
  margin: 40px;
  max-width: 100%;
  align-items: center;
}

.img-top {
  width: 120px;
  height: auto;
}

.titulo-top {
  display: flex;
  max-width: 100%;
  font-size: 2.2em;
  font-weight: bold;
  color: black;
}

/* TOPHEADER */

.logo {
  display: flex;
  align-items: center;
  margin-left: 40px;
}

.nav-enlaces {
  margin-left: 30px;
}

.button-iniciar-sesion {
  padding: 8px 12px 8px 12px;
  background: none;
  font-size: 14px;
  margin-right: 40px;
  color: white;
  font-weight: 700;
  border: 2px solid white;
  width: fit-content;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.button-iniciar-sesion:hover {
  transform: translateY(-5px);
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.9);
}

.user-sesion {
  display: flex;
  align-items: center;
  justify-content: center;
}

.user {
  margin-right: 30px;
  font-size: 16px;
  font-weight: 700;
}

.button-cerrar-sesion {
  padding: 8px 12px 8px 12px;
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

.button-cerrar-sesion:hover {
  transform: translateY(-5px);
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.9);
}

ul {
  list-style: none;
  display: flex;
  gap: 20px;
}

ul li a {
  color: white;
  text-decoration: none;
}

header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 998;
  transition: all 0.3s ease-in-out;
}

.topheader {
  display: flex;
  max-width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: #2e2f36;
  color: black;
  transition: all 0.3s ease-in-out;
}

header nav ul li a {
  color: white;
  font-size: large;
}

header nav ul li a:hover {
  color: #cccccc;
}

.producto-card {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 10px;
  text-align: left;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.unidad-card {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 10px;
  text-align: left;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.iva-card {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 10px;
  text-align: left;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.familia-card {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 10px;
  text-align: left;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.producto-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.unidad-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.iva-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.familia-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.producto-card h2 {
  margin-top: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.unidad-card h2 {
  margin-top: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.iva-card h2 {
  margin-top: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.familia-card h2 {
  margin-top: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.producto-card p {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
}

.unidad-card p {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
}

.iva-card p {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
}

.familia-card p {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
}

.producto-card strong {
  font-weight: bold;
  color: #333;
}

.unidad-card strong {
  font-weight: bold;
  color: #333;
}

.iva-card strong {
  font-weight: bold;
  color: #333;
}

.familia-card strong {
  font-weight: bold;
  color: #333;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
}

@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 480px) {
  .grid-container {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}

/*** INICIAR SESION ***/

.container1 {
  display: none;
  position: fixed;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: visible;
  z-index: 999;
}

.fondo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(7px);
  transition: 0.5s ease-in-out;
  transition-delay: 0.25s;
  z-index: 1;
}

.contenido {
  position: relative;
  z-index: 2;
}

.form-container {
  background-color: #050715;
  border-radius: 8px;
  box-shadow: 0 0 20px 1px #ffffff;
  padding: 50px;
  width: 650px;
  max-width: 100%;
}

.form-container h1 {
  color: white;
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 32px;
  margin-top: 30px;
  text-align: center;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  color: white;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
}

.form-group label {
  display: block;
  color: white;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
}

.form-group input {
  background-color: transparent;
  border: none;
  border-bottom: 1px solid white;
  color: #ffffff;
  font-size: 16px;
  padding: 10px 0;
  width: 100%;
}

.form-group input:focus {
  outline: none;
  border-bottom-color: white;
}

.submit-btn {
  background-color: #41b883;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
  padding: 12px;
  width: 100%;
  transition: background-color 0.25s ease-in-out;
  transition-delay: 0.1s;
}

.X1 {
  width: 25px;
  height: 25px;
  cursor: pointer;
}

.X2 {
  width: 15px;
  height: 15px;
  margin-right: 5px;
}

.message {
  display: flex;
  margin-bottom: 5px;
  align-items: center;
}

.cerrar {
  top: 0;
  right: 12px;
  display: inline;
  position: absolute;
  margin-top: 12px;
  text-align: center;
  border: none;
  text-decoration: none;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  font-size: 15px;
  transition: transform 0.25s ease-out;
}

.registrarse {
  margin-top: 15px;
  text-align: center;
  color: #fff;
  cursor: pointer;
  font-size: 18px;
  text-decoration-color: grey;
  border: none;
  font-weight: 700;
  transition: background-color 0.25s ease-in-out;
  transition-delay: 0.1s;
}

.cuenta_p {
  display: block;
  margin-top: 24px;
  text-decoration: none;
  text-align: center;
  border: none;
  color: #fff;
  font-size: 18px;
  width: 100%;
  transition: background-color 0.25s ease-in-out;
  transition-delay: 0.1s;
}

#error_message {
  display: none;
  color: #ffffff;
  margin-top: 18px;
  margin-bottom: 20px;
}

.registrarse:hover {
  text-decoration-color: #ffffff;
}

.submit-btn:hover {
  background-color: #38996d;
}

#mostrar:target {
  display: flex;
}

#registro:target {
  display: flex;
}

#cerrar:target {
  display: none;
}

#cerrar:hover {
  transform: scale(1.2);
}

.denegado {
  color: black;
  text-align: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  font-size: large;
  padding: 60px;
}
</style>