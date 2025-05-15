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

const ADMIN_EMAIL = 'admin@admin.com';

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
            isAdmin: false,

            isValidPassword: false,
            isValidLength: false,
            isValidLowercase: false,
            isValidUppercase: false,
            isValidNumber: false,
            isValidSpecialChar: false
        };
    },

    mounted() {
        this.checkRole();
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
        }
    },

    computed: {
        isLoginValid() {
            return this.user.u_mail && this.user.u_password;
        },
        isRegisterValid() {
            return this.user.u_name && this.user.u_mail && this.user.u_password;
        }
    },

    beforeUnmount() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
    },

    methods: {
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
            console.log("Iniciar sesión con:", this.user);// user es tu objeto reactivo
            if (!this.user.u_password || !this.user.u_mail) {
                alert("Por favor, completa todos los campos.");
                return;
            }

            console.log("Datos a enviar:", JSON.stringify(this.user));

            axios.post(API_BASE_URL+'Login/login', this.user )
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
            axios.post('http://localhost:5289/api/Users', this.user)
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
    margin-left: 30px;
}

.nav-enlaces {
    margin-left: 30px;
}

.button-iniciar-sesion {
    padding: 8px 12px 8px 12px;
    background: none;
    font-size: 14px;
    margin-right: 30px;
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

.button-admin-panel {
    padding: 8px 12px 8px 12px;
    background: none;
    font-size: 14px;
    margin-right: 30px;
    color: yellow;
    font-weight: 700;
    border: 2px solid white;
    width: fit-content;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.button-admin-panel:hover {
    transform: translateY(-5px);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.9);
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
    padding: 10px;
    background-color: #2e2f36;
    color: black;
    transition: all 0.3s ease-in-out;
}

header nav ul li a {
    color: white;
    font-size: large;
}

header nav ul li a:hover {
    color: #CCCCCC;
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
    text-decoration-color:grey;
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
    color: #FFFFFF;
    margin-top: 18px;
    margin-bottom: 20px;
}

.registrarse:hover {
    text-decoration-color: #FFFFFF;
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

/* Media Queries */

/* Para pantallas menores a 1024px (tablets y móviles grandes) */
@media (max-width: 1024px) {

    .user {
        margin-right: 20px;
        font-size: 14px;
    }

    .button-cerrar-sesion {
        padding: 8px 12px 8px 12px;
        font-size: 13px;
        margin-right: 24px;
    }

    header nav ul li a {
        font-size: medium;
    }

    .form-container {
        padding: 40px;
        width: 550px;
    }

    .form-container h1 {
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 22px;
        margin-top: 22px;
    }

    .form-group {
        margin-bottom: 22px;
    }

    .form-group label {
        font-size: 15px;
        font-weight: 700;
        margin-bottom: 7px;
    }

    .form-group input {
        font-size: 14px;
        padding: 8px 0;
        width: 100%;
    }

    #error_message {
        margin-top: 18px;
        margin-bottom: 18px;
        font-size: 13px;
    }

    .cuenta_p {
        margin-top: 20px;
        font-size: 15px;
    }

    .registrarse {
        margin-top: 16px;
        font-size: 16px;
    }

    .submit-btn {
        font-size: 16px;
    }

    .X1 {
        width: 22px;
        height: 22px;
    }
    
    .X2 {
        width: 12px;
        height: 12px;
    }

    .img-titulo {
        margin: 34px;
    }
    
    .img-top {
        width: 120px;
        height: auto;
    }
    
    .titulo-top {
        font-size: 2.1em;
    }

    .logo {
        margin-left: 24px;
    }
    
    .nav-enlaces {
        margin-left: 24px;
    }

    .button-iniciar-sesion {
        margin-right: 24px;
    }
    
}

/* Para pantallas menores a 768px (móviles) */
@media (max-width: 768px) {

    .user {
        margin-right: 18px;
        font-size: 12px;
    }

    .button-cerrar-sesion {
        padding: 6px 10px 6px 10px;
        font-size: 12px;
        margin-right: 20px;
    }
    
    header nav ul li a {
        font-size: medium;
    }

    .form-container {
        padding: 35px;
        width: 500px;
    }

    .form-container h1 {
        font-size: 22px;
        font-weight: 700;
        margin-bottom: 20px;
        margin-top: 20px;
    }

    .form-group {
        margin-bottom: 18px;
    }

    .form-group label {
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 5px;
    }

    .form-group input {
        font-size: 13px;
        padding: 8px 0;
        width: 100%;
    }

    #error_message {
        margin-top: 16px;
        margin-bottom: 16px;
        font-size: 12px;
    }

    .cuenta_p {
        margin-top: 18px;
        font-size: 14px;
    }

    .registrarse {
        margin-top: 12px;
        font-size: 15px;
    }

    .submit-btn {
        font-size: 15px;
    }
    
    .X2 {
        width: 10px;
        height: 10px;
    }

    header nav ul li a {
        font-size: medium;
    }

    .img-titulo {
        margin: 30px;
    }
    
    .img-top {
        width: 100px;
        height: auto;
    }
    
    .titulo-top {
        font-size: 1.9em;
    }

    .logo {
        margin-left: 20px;
    }
    
    .nav-enlaces {
        margin-left: 20px;
    }

    ul {
        gap: 18px;
    }

    .img-logo {
        max-width: 65px;
        max-height: 65px;
    }

    .button-iniciar-sesion {
        padding: 6px 10px 6px 10px;
        font-size: 12px;
        margin-right: 20px;
    }

}

/* Para pantallas muy pequeñas (menores a 480px) */
@media (max-width: 480px) {

    .form-container {
        padding: 25px;
        width: 360px;
    }

    .form-container h1 {
        margin-top: 18px;
    }

    .form-group {
        margin-bottom: 10px;
    }

    #error_message {
        margin-top: 14px;
        margin-bottom: 14px;
        font-size: 11px;
    }

    .cuenta_p {
        margin-top: 18px;
    }

    .registrarse {
        margin-top: 14px;
    }

    .submit-btn {
        padding: 9px;
        margin-top: 10px;
    }

    header nav ul li a {
        font-size: small;
    }

    .img-titulo {
        margin: 16px;
    }
    
    .img-top {
        width: 55px;
        height: auto;
    }
    
    .titulo-top {
        font-size: 1.4em;
    }

    .logo {
        margin-left: 12px;
    }
    
    .nav-enlaces {
        margin-left: 12px;
    }

    ul {
        gap: 14px;
    }

    .img-logo {
        max-width: 40px;
        max-height: 40px;
    }

    .button-iniciar-sesion {
        padding: 6px 8px 6px 8px;
        font-size: 11px;
        margin-right: 14px;
    }

    .user {
        margin-right: 15px;
        font-size: 12px;
    }

    .button-cerrar-sesion {
        padding: 6px 8px 6px 8px;
        font-size: 10px;
        margin-right: 15px;
    }

}

</style>