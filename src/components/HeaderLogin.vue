<template>
    <div class="container-header">
      <section class="img-titulo">
        <img src="@/assets/app-black.png" class="img-top" alt="Imagen de fondo arriba" />
        <h1 class="titulo-top">Bienvenidos al Proyecto</h1>
      </section>
  
      <header>
        <div class="topheader">
          <div class="logo">
            <router-link to="/">
              <img src="@/assets/app.png" class="img-logo" alt="Logo" />
            </router-link>
            <nav class="nav-enlaces">
              <ul>
                <li><router-link to="/catalogo">Articulos</router-link></li>
                <li><a class="enlaces" href="#contacto">Contacto</a></li>
              </ul>
            </nav>
          </div>
          <nav>
            <ul>
              <li v-if="!loggedIn">
                <button type="button" class="button-iniciar-sesion" @click="$emit('open-login')">
                  Iniciar Sesión
                </button>
              </li>
              <li class="user-sesion" v-else>
                <span class="user" @click="$emit('toggle-user')" style="color: white; cursor: pointer;">
                  {{ currentUserName }}
                </span>
                <button @click="$emit('logout')" type="button" class="button-cerrar-sesion">
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>



  </template>
  
  <script>
  export default {
    name: "HeaderLogin",
    props: {
      loggedIn: Boolean,
      currentUserName: String,
    },
  };
  </script>
  
<style>
/* HEADER GENERAL */

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

.container-header {
    display: flex;
    max-width: 100%;
    width: 100%;
    justify-content: center;
    padding-top: var(--header-height);
}

.logo {
    display: flex;
    align-items: center;
    margin-left: 40px;
}

.img-logo {
    width: min-content;
    height: min-content;
    max-width: 70px;
    max-height: 70px;
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

.nav-enlaces {
    margin-left: 30px;
}

ul {
    list-style: none;
    display: flex;
    gap: 20px;
}

ul li a,
header nav ul li a {
    color: white;
    text-decoration: none;
    font-size: large;
}

header nav ul li a:hover {
    color: #cccccc;
}

/* BOTONES DE SESIÓN */

.button-iniciar-sesion,
.button-cerrar-sesion {
    padding: 8px 12px;
    background: none;
    font-size: 14px;
    font-weight: 700;
    width: fit-content;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.button-iniciar-sesion {
    color: white;
    border: 2px solid white;
    margin-right: 40px;
}

.button-cerrar-sesion {
    color: red;
    border: 2px solid red;
    margin-right: 30px;
}

.button-iniciar-sesion:hover,
.button-cerrar-sesion:hover {
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

/* MODAL INICIAR SESIÓN Y REGISTRO */

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

.submit-btn:hover {
    background-color: #38996d;
}

.cerrar {
    top: 0;
    right: 12px;
    position: absolute;
    margin-top: 12px;
    border: none;
    color: #fff;
    cursor: pointer;
    font-size: 15px;
    transition: transform 0.25s ease-out;
}

.cerrar:hover {
    transform: scale(1.2);
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

#error_message {
    display: none;
    color: #ffffff;
    margin-top: 18px;
    margin-bottom: 20px;
}

.registrarse,
.cuenta_p {
    margin-top: 15px;
    text-align: center;
    color: #fff;
    font-size: 18px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: background-color 0.25s ease-in-out;
    transition-delay: 0.1s;
}

.registrarse:hover {
    text-decoration-color: #ffffff;
}

/* Mostrar y ocultar modal con fragmentos */

#mostrar:target,
#registro:target {
    display: flex;
}

#cerrar:target {
    display: none;
}
</style>
  