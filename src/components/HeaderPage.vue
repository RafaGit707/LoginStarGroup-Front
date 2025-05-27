<template>

<div class="container-header">

    <section class="img-titulo">
        <img src="../assets/app-black.png" class="img-top" alt="Imagen de fondo arriba">
        <h1 class="titulo-top">Bienvenidos al Proyecto</h1>
    </section>

    <header id="#">
        <div class="topheader">
            <div class="logo">
                <a href="/">
                    <img src="@/assets/app.png" class="img-logo">
                </a>
                <nav class="nav-enlaces">
                    <ul>
                        <router-link to="/catalogo">
                            <li><a class="enlaces">Catalogo</a></li>
                        </router-link>
                        <li><a class="enlaces" href = #contacto>Contacto</a></li>
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
                        <router-link to="admin-dashboard"><a v-if="isAdmin" class="button-admin-panel" >Admin Panel</a></router-link>
                    </li>
                </ul>
            </nav>

        </div>
    </header>
</div>

<!--FORMULARIO INICIO SESION -->

<div v-if="showLogin" id="mostrar" class="container1">
    <div class="fondo"></div>
    <div class="contenido">
        <form class="form-container" @submit.prevent="handleLogin">
        <h1>Iniciar sesión</h1>
        <div class="form-group">
            <label for="email">Correo electrónico</label>
            <input v-model="user.u_mail" type="email" id="email" name="email" autocomplete="off" required>
        </div>
        <div class="form-group">
            <label for="password">Contraseña</label>
            <input v-model="user.u_password" type="password" id="password" name="password" autocomplete="off" required>
        </div>
        <button class="submit-btn" type="submit">Iniciar sesión</button>
        <p class="cuenta_p">¿No tienes cuenta?  <a href="#registro" class="registrarse" @click="showRegister = true">Registrarse</a></p>
        <a id="cerrar" class="cerrar" href="#" @click="closeLoginModal"><img src="@/assets/X-green.png" class="X1" id="X1"></a>
        </form>
    </div>
</div>

<!-- pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?_])(?!\s)[a-zA-Z\d#$@!%&*?_]{8,16}$" -->

<div v-if="showRegister" id="registro" class="container1">
    <div class="fondo"></div>
    <div class="contenido">
        <form class="form-container" @submit.prevent="handleRegister">
        <h1>Registrarse</h1>
        <div class="form-group">
            <label for="name">Nombre</label>
            <input v-model="user.u_name" type="text" id="name" name="name" autocomplete="off" required>
        </div>
        <div class="form-group">
            <label for="email">Correo electrónico</label>
            <input v-model="user.u_mail" type="email" id="email" name="email" autocomplete="off" required>
        </div>
        <div class="form-group">
            <label for="password2">Contraseña</label>
            <input v-model="user.u_password" type="password" id="password2" name="password2" autocomplete="off" required @input="validatePassword">
        </div>
        <div id="error_message" v-if="!isValidPassword">
            <p class="message"><img class="X2" :src="isValidLength ? '@/assets/tick.png' : '@/assets/X.png'" alt="X2">La contraseña debe tener entre 8 y 16 caracteres</p>
            <p class="message"><img class="X2" :src="isValidLowercase ? '@/assets/tick.png' : '@/assets/X.png'" alt="X2">La contraseña debe contener al menos una letra minúscula</p>
            <p class="message"><img class="X2" :src="isValidUppercase ? '@/assets/tick.png' : '@/assets/X.png'" alt="X2">La contraseña debe contener al menos una letra mayúscula</p>
            <p class="message"><img class="X2" :src="isValidNumber ? '@/assets/tick.png' : '@/assets/X.png'" alt="X2">La contraseña debe contener al menos un número</p>
            <p class="message"><img class="X2" :src="isValidSpecialChar ? '@/assets/tick.png' : '@/assets/X.png'" alt="X2">La contraseña debe contener al menos un carácter especial (#$@!%&*?_)</p>
        </div>
        <button class="submit-btn" type="submit">Registrarse</button>
        <p class="cuenta_p">¿Tienes cuenta? <a href="#mostrar" class="registrarse" @click="showLogin = true">Iniciar Sesion</a></p>
        <a id="cerrar" class="cerrar" href="#" @click="closeRegisterModal"><img src="@/assets/X-green.png" class="X1" id="X1"></a>
        </form>
    </div>
</div>

</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig.js';
import { jwtDecode } from 'jwt-decode';

const ADMIN_EMAIL = 'antonio.carnero@star-group.net';

export default {
    name: "HeaderPage",
    emits: ['loginSuccess'],
    data() {
        return {
            user: {
                u_name: '',
                u_mail: '',
                u_password: ''
            },
            showLogin: false,
            loggedIn: false,
            currentUserName: '',
            showRegister: false,

            isValidPassword: false,
            isValidLength: false,
            isValidLowercase: false,
            isValidUppercase: false,
            isValidNumber: false,
            isValidSpecialChar: false
        };
    },
    created() {
        this.checkAuthStatus();
    },
    watch: {
        showLogin(newValue) {
            if (newValue) {
                document.body.classList.add('no-scroll');
            } else {
                document.body.classList.remove('no-scroll');
            }
        },
        showRegister(newValue) {
            if (newValue) {
                document.body.classList.add('no-scroll');
            } else {
                document.body.classList.remove('no-scroll');
            }
        },
        isAdmin() {
            if (!this.loggedIn) return false;
            const token = localStorage.getItem('authToken');
            if (!token) return false;
            try {
                const decodedToken = jwtDecode(token);
                // El claim de email estándar es 'email' o ClaimTypes.Email
                return decodedToken.email && decodedToken.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
            } catch (e) {
                return false;
            }
        }
    },

    computed: {
        isLoginValid() {
            return this.user.u_mail && this.user.u_password;
        },
        isRegisterValid() {
            return this.user.u_name && this.user.u_mail && this.user.u_password;
        },
        isAdmin() {
            if (!this.loggedIn) return false; // Si no está logueado, no es admin
            const token = localStorage.getItem('authToken');
            if (!token) return false; // Si no hay token, no es admin

            try {
                const decodedToken = jwtDecode(token);
                console.log("Token decodificado en isAdmin (computed):", decodedToken);

                // 1. Primero, chequear el claim 'isAdmin' que el backend añade
                if (decodedToken.isAdmin !== undefined) { // Asegurarse que el claim existe
                    // El claim 'isAdmin' del backend es un string "true"
                    return decodedToken.isAdmin.toString().toLowerCase() === 'true';
                }
                
                // 2. Si no hay claim 'isAdmin', fallback a la verificación por email
                // (Esto es por si decides quitar el claim 'isAdmin' del backend)
                // return decodedToken.email && decodedToken.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
                
                // Si solo confías en el claim 'isAdmin' del backend:
                return false; // Si no hay claim 'isAdmin', no es admin

            } catch (e) {
                console.error("Error decodificando token en isAdmin (computed):", e);
                return false; // Si el token es inválido, no es admin
            }
        }
    },
    beforeUnmount() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
    },

    methods: {
        checkAuthStatus() {
            const token = localStorage.getItem('authToken');
            if (token) { // Si hay un token en localStorage
                try {
                    // Intenta decodificar el token
                    const decodedToken = jwtDecode(token);
                    console.log("Token decodificado en checkAuthStatus:", decodedToken); // <-- CLAVE PARA DEBUG

                    // 1. Chequeo de expiración
                    if (decodedToken.exp * 1000 < Date.now()) {
                        console.log("Token expirado, llamando a logout.");
                        this.logout(); // Esto te sacará del if (token) en la siguiente ejecución si window.reload está presente
                        return; // Importante salir aquí para no procesar un token expirado
                    }

                    // 2. Si el token es válido y no ha expirado:
                    this.loggedIn = true;
                    this.currentUserName = decodedToken.unique_name; // Usar la propiedad correcta del token // Asigna el nombre del claim 'name'
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    
                    // 3. Emitir evento
                    // 'this.isAdmin' aquí usará la propiedad computada 'isAdmin'
                    console.log("Emitiendo loginSuccess desde checkAuthStatus. isAdmin:", this.isAdmin, "userName:", this.currentUserName);
                    this.$emit('loginSuccess', { isAdmin: this.isAdmin, userName: this.currentUserName });

                } catch (error) {
                    // Si jwtDecode falla (token malformado, etc.)
                    console.error("Error decodificando token en checkAuthStatus (catch):", error);
                    this.logout(); // Llama a logout, lo que eventualmente ejecutará este 'else' si hay reload
                }
            } else { // Si NO hay token en localStorage
                console.log("No hay token en localStorage, reseteando estado de login.");
                this.loggedIn = false;
                this.currentUserName = '';
                delete axios.defaults.headers.common['Authorization'];
                this.$emit('loginSuccess', { isAdmin: false, userName: '' });
            }
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

        toggleUserDetails() {
            this.showUserDetails = !this.showUserDetails;
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
            if (!this.user.u_mail || !this.user.u_password) { /* ... */ }
            axios.post(`${API_BASE_URL}Login/login`, this.user)
                .then(response => {
                    const token = response.data.token;
                    // const userName = response.data.userName; // Ya lo obtenemos del token decodificado

                    localStorage.setItem('authToken', token);
                    // localStorage.setItem('userName', userName); // No es estrictamente necesario si está en el token

                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    
                    // Actualizar estado local y luego emitir. checkAuthStatus puede hacer esto.
                    this.checkAuthStatus(); // Esto actualizará loggedIn, currentUserName y activará la computada isAdmin

                    this.user = { u_name: '', u_mail: '', u_password: '' };
                    this.showLogin = false;

                    window.location.reload();
                })
                .catch(error => {
                    console.error("Error en login:", error.response ? error.response.data : error.message);
                    alert("Credenciales incorrectas o error en el servidor.");
                });
        },

        fetchUsers() {
            console.log("Fetching users...");
        },

        handleRegister() {
            // if (!this.validatePassword()) return;
            axios.post(API_BASE_URL+'Users', this.user)
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
            localStorage.removeItem('authToken');
            localStorage.removeItem('userName');
        
            this.checkAuthStatus();

            // if (this.$route.meta.requiresAuth) { // Si usas route guards
            //     this.$router.push('/');
            // }
            window.location.reload();
        }

    },
};
</script>
