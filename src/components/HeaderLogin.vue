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
  
