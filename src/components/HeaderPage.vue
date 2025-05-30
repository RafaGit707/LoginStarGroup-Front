<template>

<div class="container-header">

    <header id="#">
        <div class="topheader">
            <div class="logo-container">
                <router-link to="/index">
                    <img src="@/assets/app.png" class="img-logo">
                </router-link>
                <nav class="nav-enlaces nav-enlaces-desktop">
                    <ul>
                        <li v-if="loggedIn && isAdmin" class="dropdown-li" ref="gestionDropdownContainer">
                            <a class="enlaces" @click.prevent="toggleGestionDropdown" href="#">
                            Gestor <span class="dropdown-arrow" :class="{'open': showGestionDropdown}">▼</span>
                            </a>
                            <transition name="dropdown-fade">
                                <ul class="dropdown-menu" v-if="showGestionDropdown">
                                <!-- CAMBIO: Usar handleAdminSectionNavigation directamente -->
                                <li @click="handleAdminSectionNavigation('articulos')"><a>Artículos</a></li>
                                <li @click="handleAdminSectionNavigation('unidades')"><a>Unidades</a></li>
                                <li @click="handleAdminSectionNavigation('iva')"><a>IVA</a></li>
                                <li @click="handleAdminSectionNavigation('familias')"><a>Familias</a></li>
                                <li @click="handleAdminSectionNavigation('marcas')"><a>Marcas</a></li>
                                <li @click="handleAdminSectionNavigation('proveedores')"><a>Proveedores</a></li>
                                <li @click="handleAdminSectionNavigation('historialCompras')"><a>Hist. Compras</a></li>
                                <!-- Para Usuarios, si es una ruta diferente, el router-link es correcto -->
                                <router-link to="/users-dashboard" custom v-slot="{ navigate }">
                                    <li @click="closeDropdownAndNavigate(navigate)"><a>Usuarios</a></li>
                                </router-link>
                                </ul>
                            </transition>
                        </li>
                        <!-- Enlace "Catálogo" para usuarios no-admin o si no está logueado -->
                        <router-link v-else to="/admin-dashboard" custom v-slot="{ navigate, isActive }">
                            <li :class="{ 'active-link': isActive }" @click="navigate">
                            <a class="enlaces">Gestor</a>
                            </li>
                        </router-link>
                        <li><a class="enlaces" @click="scrollToContact('#contacto')">Contacto</a></li>
                    </ul>
                </nav>
            </div>
        
            <div class="session-burger-container">
            <!-- Botones de Sesión / Usuario para Escritorio -->
                <nav class="nav-session nav-session-desktop">
                    <ul>
                        <li v-if="!loggedIn">
                            <button type="button" class="button-iniciar-sesion" @click="showLoginModal">
                            Iniciar Sesión
                            </button>
                        </li>
                        <li class="user-sesion" v-else>
                            <span class="user" @click="toggleUserDetails">{{ currentUserName }}</span>
                            <button @click="logout" type="button" class="button-cerrar-sesion">Cerrar sesión</button>
                        </li>
                    </ul>
                </nav>
            <!-- Icono de Hamburguesa para Móvil -->
                <div class="burger-menu-icon" @click="toggleMobileMenu" :class="{ 'active': isMobileMenuOpen }">
                    <div class="bar1"></div>
                    <div class="bar2"></div>
                    <div class="bar3"></div>
                </div>
            </div>
        </div>
    </header>
</div>

 <!-- Menú Desplegable para Móvil (Overlay) -->
<div class="mobile-menu-overlay" :class="{ 'open': isMobileMenuOpen }">
    <div class="mobile-menu-header">
    <router-link to="/index" @click="closeMenuAndNavigate(() => $router.push('/index'))">
        <img src="@/assets/app.png" class="mobile-menu-logo" alt="Logo">
    </router-link>
    <!-- Botón de Iniciar Sesión o Info de Usuario en Móvil -->
    <div class="mobile-session-controls">
        <button v-if="!loggedIn" type="button" class="button-iniciar-sesion mobile" @click="showLoginModalAndCloseMenu">
            Iniciar Sesión
        </button>
        <div v-else class="mobile-user-info">
            <span class="user">{{ currentUserName }}</span>
            <!-- <button @click="logoutAndCloseMenu" type="button" class="button-cerrar-sesion mobile">Cerrar</button> -->
        </div>
    </div>
    <img src="@/assets/X-green.png" class="mobile-menu-close" @click="toggleMobileMenu" alt="Cerrar menú">
    </div>
    <nav class="mobile-menu-nav">
        <ul>
            <router-link to="/admin-dashboard" custom v-slot="{ navigate }">
                <li @click="closeMenuAndNavigate(navigate)"><a>Gestor</a></li>
            </router-link>
            <li><a @click="closeMenuAndNavigate('#contacto')">Contacto</a></li>

            <hr v-if="loggedIn && isAdmin">
            <template v-if="loggedIn && isAdmin">
              <hr>
              <li class="mobile-menu-section-title"><a>Gestión</a></li>
              <!-- CAMBIO: Usar handleAdminSectionNavigation directamente -->
              <li @click="handleAdminSectionNavigation('articulos', true)"><a>Artículos</a></li>
              <li @click="handleAdminSectionNavigation('unidades', true)"><a>Unidades</a></li>
              <li @click="handleAdminSectionNavigation('iva', true)"><a>IVA</a></li>
              <li @click="handleAdminSectionNavigation('familias', true)"><a>Familias</a></li>
              <li @click="handleAdminSectionNavigation('marcas', true)"><a>Marcas</a></li>
              <li @click="handleAdminSectionNavigation('proveedores', true)"><a>Proveedores</a></li>
              <li @click="handleAdminSectionNavigation('historialCompras', true)"><a>Hist. Compras</a></li>
              <!-- Para Usuarios, si es una ruta diferente, el router-link es correcto -->
              <router-link to="/users-dashboard" custom v-slot="{ navigate }">
                <li @click="closeMenuAndNavigate(navigate)"><a>Usuarios</a></li>
              </router-link>
            </template>
            
            <hr v-if="loggedIn">
            <li v-if="loggedIn" @click="logoutAndCloseMenu"><a>Cerrar Sesión</a></li>
        </ul>
    </nav>
</div>

<!--FORMULARIO INICIO SESION -->

<div v-if="showLogin" id="mostrar" class="container1">
    <div class="fondo"></div>
    <div class="contenido">
        <form class="form-container" @submit.prevent="handleLogin">
        <h1>Iniciar sesión</h1>
        <div class="form-group-session">
            <label for="email">Correo electrónico</label>
            <input v-model="user.u_mail" type="email" id="email" name="email" autocomplete="off" required>
        </div>
        <div class="form-group-session">
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
        <div class="form-group-session">
            <label for="name">Nombre</label>
            <input v-model="user.u_name" type="text" id="name" name="name" autocomplete="off" required>
        </div>
        <div class="form-group-session">
            <label for="email">Correo electrónico</label>
            <input v-model="user.u_mail" type="email" id="email" name="email" autocomplete="off" required>
        </div>
        <div class="form-group-session">
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

// const ADMIN_EMAIL = 'antonio.carnero@star-group.net';

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
            isMobileMenuOpen: false,
            showGestionDropdown: false,

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
        window.addEventListener('resize', this.handleResize);
        document.addEventListener('click', this.handleClickOutsideDropdown);
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
        isMobileMenuOpen(newValue) {
            this.updateNoScroll(newValue || this.showLogin || this.showRegister);
        },
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
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('click', this.handleClickOutsideDropdown);
    },

    methods: {
       updateNoScroll(shouldBeNoScroll) {
            document.body.classList.toggle('no-scroll', shouldBeNoScroll);
        },
        handleResize() {
            if (window.innerWidth > 768 && this.isMobileMenuOpen) {
                this.isMobileMenuOpen = false;
            }
            // Cerrar el dropdown de gestión si la pantalla se hace demasiado pequeña
            if (window.innerWidth <= 768 && this.showGestionDropdown) {
                this.showGestionDropdown = false;
            }
        },
        toggleGestionDropdown(event) {
            event.stopPropagation(); // Evitar que el click se propague al document
            this.showGestionDropdown = !this.showGestionDropdown;
        },
        handleClickOutsideDropdown(event) {
            // Usar this.$refs para acceder al elemento
            const dropdownContainer = this.$refs.gestionDropdownContainer;

            // Verificar si el dropdown existe y si el clic fue fuera de él
            if (dropdownContainer && !dropdownContainer.contains(event.target)) {
                if (this.showGestionDropdown) { // Solo cerrar si está abierto
                    this.showGestionDropdown = false;
                }
            }
        },

        handleAdminSectionNavigation(sectionOrPath, isMobileAction = false) {
            if (isMobileAction) {
                this.isMobileMenuOpen = false;
            }
            this.showGestionDropdown = false;

            this.$nextTick(() => {
                const targetPath = (typeof sectionOrPath === 'string' && sectionOrPath.startsWith('/'))
                    ? sectionOrPath  // Es una ruta completa como '/users-dashboard'
                    : '/admin-dashboard'; // Es una sección dentro de admin-dashboard

                const query = (typeof sectionOrPath === 'string' && !sectionOrPath.startsWith('/'))
                    ? { section: sectionOrPath } // sectionOrPath es 'articulos', 'marcas', etc.
                    : {}; // Sin query si es una ruta directa

                // console.log("HeaderPage: Intentando navegar a:", { path: targetPath, query: query });
                // console.log("HeaderPage: Ruta actual:", { path: this.$route.path, query: this.$route.query });

                if (this.$route.path !== targetPath || JSON.stringify(this.$route.query) !== JSON.stringify(query)) {
                    this.$router.push({ path: targetPath, query: query }).catch(err => {
                        if (err.name !== 'NavigationDuplicated' && err.name !== 'NavigationCancelled') {
                            console.error("Error de navegación desde HeaderPage:", err);
                        }
                    });
                } else {
                    // console.log("HeaderPage: Misma ruta y query, no se navega. El watcher debería actuar si es un nuevo clic en la misma sección.");
                    // Si ya estamos en la misma ruta Y la query es idéntica, el watcher no se disparará.
                    // Si queremos que CatalogoProductos.vue recargue la sección actual incluso si la query es la misma:
                    // Esto es útil si el usuario hace clic en "Artículos" cuando ya está en "Artículos"
                    // y queremos que la lógica de `selectSection` se ejecute (ej. para un refresh forzado).
                    if (this.$route.path === '/admin-dashboard' && query.section && typeof this.$root.$emit === 'function') {
                       // Alternativa: emitir un evento global que CatalogoProductos escuche
                       // this.$root.$emit('forceAdminSection', query.section);
                       // O, si App.vue tiene una referencia al componente y puede llamarlo:
                       // (esto es más complejo de mantener)
                    }
                }
            });
        },
        closeDropdownAndNavigate(navigateFunc) { // Para los items que son router-link custom
            this.showGestionDropdown = false;
            this.isMobileMenuOpen = false; // También cerrar menú móvil si estuviera abierto (poco probable aquí)
            this.$nextTick(() => {
                if (typeof navigateFunc === 'function') navigateFunc();
            });
        },
        toggleMobileMenu() { this.isMobileMenuOpen = !this.isMobileMenuOpen; },
        closeMenuAndNavigate(action) {
            this.isMobileMenuOpen = false;
            this.$nextTick(() => {
                if (typeof action === 'function') { action(); }
                else if (typeof action === 'string' && action.startsWith('#')) { this.scrollToContact(action); }
            });
        },
        scrollToContact(hash = '#contacto') {
            const targetId = hash.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            } else {
                console.warn(`Elemento con id '${targetId}' no encontrado.`);
                 if (this.$route.path !== '/index') this.$router.push('/index');
            }
        },
        showLoginModalAndCloseMenu() { this.isMobileMenuOpen = false; this.showLoginModal(); },
        logoutAndCloseMenu() { this.isMobileMenuOpen = false; this.logout(); },
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
                        this.performLogoutActions(true, false);
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
                     this.performLogoutActions(true, false);
                }
            } else { // Si NO hay token en localStorage
                // console.log("checkAuthStatus - No hay token, estado de logout.");
                // No es necesario llamar a performLogoutActions aquí si ya está limpio,
                // pero es seguro para asegurar el estado. No recargar.
                this.performLogoutActions(false, false); 
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
        performLogoutActions(clearToken = true, reloadPage = true) {
            if (clearToken) localStorage.removeItem('authToken');
            this.loggedIn = false;
            this.currentUserName = '';
            delete axios.defaults.headers.common['Authorization'];
            this.$emit('loginSuccess', { isAdmin: false, userName: '' });
            if (reloadPage) window.location.reload();
        },
        logout() { this.performLogoutActions(true, true); },

    },
};
</script>
