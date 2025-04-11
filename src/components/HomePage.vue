<template>

<div class="container-header">
    <div class="div-fondo"></div>

    <section class="img-titulo">
        <img src="../assets/logo.png" class="img-top" alt="Imagen de fondo arriba">
        <h1 class="titulo-top">Bienvenidos a Vue</h1>
    </section>

    <header id="#">
        <div class="topheader">
            <div class="logo">
                <a href="index.html">
                    <img src="@/assets/logo.png" class="img-logo">
                </a>
                <nav class="nav-enlaces">
                    <ul>
                        <li><a href="otra.html">Otra pagina</a></li>
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
                        <span class="user" style="color: white;"> {{ currentUserName }}</span>
                        <button @click="logout" type="button" class="button-cerrar-sesion">Cerrar sesión</button>
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
            <label for="name">Nombre</label>
            <input v-model="user.u_name" type="text" id="name" name="name" autocomplete="off" required>
        </div>
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

<!-- <div v-if="showRegister" id="registro" class="container1">
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
            <input v-model="user.u_password" type="password" id="password2" name="password2" autocomplete="off" required>
        </div>
        <div id="error_message">
            <p class="message"><img class="X2" src="@/assets/X.png" alt="X2" id="length-icon">La contraseña debe tener entre 8 y 16 caracteres</p>
            <p class="message"><img class="X2" src="@/assets/X.png" alt="X2" id="lowercase-icon">La contraseña debe contener al menos una letra minúscula</p>
            <p class="message"><img class="X2" src="@/assets/X.png" alt="X2" id="uppercase-icon">La contraseña debe contener al menos una letra mayúscula</p>
            <p class="message"><img class="X2" src="@/assets/X.png" alt="X2" id="number-icon">La contraseña debe contener al menos un número</p>
            <p class="message"><img class="X2" src="@/assets/X.png" alt="X2" id="special-char-icon">La contraseña debe contener al menos un carácter especial (#$@!%&amp;*?_)</p>
        </div>
        <button class="submit-btn" type="submit">Registrarse</button>
        <p class="cuenta_p">¿Tienes cuenta? <a href="#mostrar" class="registrarse" @click="showLogin = true">Iniciar Sesion</a></p>
        <a id="cerrar" class="cerrar" href="#" @click="closeRegisterModal"><img src="@/assets/X-green.png" class="X1" id="X1"></a>
        </form>
    </div>
</div> -->

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
            <input v-model="user.u_password" type="password" id="password2" name="password2" autocomplete="off" required @input="validatePassword" pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?_])(?!\s)[a-zA-Z\d#$@!%&*?_]{8,16}$">
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

export default {
    name: "HomePage",
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

    // mounted() {
    //     const token = localStorage.getItem('authToken');
    //     const userName = localStorage.getItem('userName');
    //     if (token && userName) {
    //         this.loggedIn = true;
    //         this.currentUserName = userName;
    //     }
    // },

    mounted() {
        const header = document.querySelector("header");

        const checkScroll = () => {
            const headerTop = header.getBoundingClientRect().top;
            const triggerHeight = window.innerHeight - header.offsetHeight;
            const scrollPosition = window.scrollY;

            if (headerTop <= 0) {
                header.classList.add("header-fixed");
            }
            if (scrollPosition <= triggerHeight) {
                header.classList.remove("header-fixed");
            }
        };

        window.addEventListener("scroll", checkScroll);
    },

    created() {
        // Verifica si ya hay sesión iniciada
        const token = localStorage.getItem('authToken');
        const userName = localStorage.getItem('userName');
        if (token && userName) {
            this.loggedIn = true;
            this.currentUserName = userName;
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
            return this.user.u_name && this.user.u_mail && this.user.u_password;
        },
        isRegisterValid() {
            return this.user.u_name && this.user.u_mail && this.user.u_password;
        }
    },

    beforeUnmount() {
        // Limpia el token y el nombre de usuario al cerrar sesión
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
    },

    methods: {
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
        if (!this.user.u_name || !this.user.u_password || !this.user.u_mail) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        console.log("Datos a enviar:", JSON.stringify(this.user));

        axios.post('https://localhost:7198/api/Login/login', this.user )
        .then(response => {
            if (response.data.message === 'Login exitoso') {
                alert("Inicio de sesión exitoso");
                localStorage.setItem('authToken', response.data.token);
                this.loggedIn = true;
                this.currentUserName = this.user.u_name; 
                // window.location.href = "/usuarios";
            } else {
                alert("Credenciales incorrectas");
            }
        })
        .catch(error => {
        console.error("Error en la petición:", error);

        if (error.response) {
            console.error("Respuesta del servidor:", error.response.data);
            alert(`Error del servidor: ${error.response.data}`);
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

    registerUser() {
      this.fetchUsers();
    },

    handleRegister() {
        if (!this.validatePassword()) return;
        axios.post('https://localhost:7198/api/Users', this.user)
        .then(response => {
            alert("Usuario registrado exitosamente");
            this.showRegister = false;
            this.fetchUsers();
            this.registerUser();
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
        this.loggedIn = false;
        this.currentUserName = '';
    },

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
    height: 100vh;
    justify-content: flex-start;
    align-items: flex-end;
    background: transparent;
    padding-bottom: var(--header-height);
}

.div-fondo {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    max-width: 100%;
    height: 100vh;
    background-image: url("../assets/vue.jpg");
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    z-index: -1;
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
    color: white;
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
    font-size: 18px;
    font-weight: 700;
}

.button-cerrar-sesion {
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
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 998;
    transition: all 0.3s ease-in-out;
}

.topheader {
    display: flex;
    max-width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background-color: #2e2f36;
    color: black;
    transition: all 0.3s ease-in-out;
}

.header-fixed {
    position: fixed;
    top: 0;
    bottom: auto;
    width: 100%;
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

    .form-container {
        padding: 35px;
        width: 490px;
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
        padding: 24px;
        width: 330px;
    }

    .form-container h1 {
        font-size: 20px;
        margin-bottom: 18px;
        margin-top: 18px;
    }

    .form-group {
        margin-bottom: 10px;
    }

    .form-group label {
        font-size: 11px;
        font-weight: 700;
        margin-bottom: 5px;
    }

    .form-group input {
        font-size: 10px;
        padding: 7px 0;
        width: 100%;
    }

    #error_message {
        margin-top: 14px;
        margin-bottom: 14px;
        font-size: 10px;
    }

    .cuenta_p {
        margin-top: 15px;
        font-size: 12px;
    }

    .registrarse {
        margin-top: 12px;
        font-size: 13px;
    }

    .submit-btn {
        font-size: 13px;
        padding: 9px;
    }

    .X1 {
        width: 18px;
        height: 18px;
    }
    
    .X2 {
        width: 9px;
        height: 9px;
    }

    header nav ul li a {
        font-size: small;
    }

    .img-titulo {
        margin: 25px;
    }
    
    .img-top {
        width: 80px;
        height: auto;
    }
    
    .titulo-top {
        font-size: 1.5em;
    }

    .logo {
        margin-left: 16px;
    }
    
    .nav-enlaces {
        margin-left: 16px;
    }

    ul {
        gap: 16px;
    }

    .img-logo {
        max-width: 50px;
        max-height: 50px;
    }

    .button-iniciar-sesion {
        padding: 6px 8px 6px 8px;
        font-size: 10px;
        margin-right: 16px;
    }

}

</style>