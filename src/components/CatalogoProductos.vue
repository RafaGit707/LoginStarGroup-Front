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
              <span class="user" style="color: white; cursor: pointer;" @click="toggleUserDetails"> {{ currentUserName
              }}</span>
              <button @click="logout" type="button" class="button-cerrar-sesion">Cerrar sesión</button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  </div>

  <!-- Menú de selección para el admin -->
  <div v-if="isAdmin" class="admin-menu">
    <button @click="selectSection('articulos')">Artículos</button>
    <button @click="selectSection('unidades')">Unidades</button>
    <button @click="selectSection('iva')">IVA</button>
    <button @click="selectSection('familias')">Familias</button>
    <button @click="selectSection('marcas')">Marcas</button>
    <!--<button @click="selectSection('articulo_marca')">Articulo_Marca</button>-->
    <button @click="selectSection('proveedores')">Proveedores</button>
    <button @click="selectSection('historialCompras')">Historial Compras</button>

  </div>

  <div v-else class="denegado">
    <h1>Acceso denegado</h1>
    <p>Solo los administradores pueden ver la lista de articulos y sus relaciones.</p>
    <p>Si eres un administrador, por favor inicia sesión.</p>
  </div>

  <div class="catalogo-productos" v-if="activeSection === 'articulos'">
    <h1 class="catalogo-titulo">Artículos</h1>

    <div class="top-bar">
      <input v-model="searchQuery" type="text" placeholder="Buscar por nombre, código o familia" class="search-input" />
      <button class="agregar-btn" @click="abrirFormularioArticulo">+ Agregar Artículo</button>
    </div>

    <table class="tabla">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Código</th>
          <th>Familia</th>
          <th>Unidad</th>
          <th>Precio</th>
          <th>IVA</th>
          <th>Último precio compra</th>
          <th>Código de barras</th>
          <th>Editar</th>
          <th>Eliminar</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="producto in filteredProductos" :key="producto.a_id">
          <td>{{ producto.a_nombre }}</td>
          <td>{{ producto.a_cod }}</td>
          <td>{{ getFamiliaNombre(producto.fa_id) }}</td>
          <td>{{ getUnidadNombre(producto.un_id) }}</td>
          <td>{{ producto.a_pvp.toFixed(2) }}€</td>
          <td>{{ getIvaValor(producto.iva_id) }}%</td>
          <td>{{ producto.a_ultimo_pc.toFixed(2) }}€</td>
          <td>{{ producto.a_cod_barras }}</td>
          <td><img class="edit" src="../assets/edit_ic.svg" alt="" @click="selectArticuloForEdit(producto)" /></td>
          <td><img class="delete" src="../assets/delete_ic.svg" alt="" @click="confirmDelete(producto.a_id)" /></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="catalogo-unidades" v-if="activeSection === 'unidades'">
    <h1 class="catalogo-titulo">Unidades</h1>

    <div class="top-bar">
      <input v-model="searchQuery" type="text" placeholder="Buscar por nombre" class="search-input" />
      <button class="agregar-btn" @click="abrirFormularioUnidades">+ Agregar Unidad</button>
    </div>

    <table class="tabla">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Editar</th>
          <th>Eliminar</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="unidad in filteredUnidades" :key="unidad.un_id">
          <td>{{ unidad.un_id }}</td>
          <td>{{ unidad.un_nombre }}</td>
          <td><img class="edit" src="../assets/edit_ic.svg" alt="" @click="selectUnidadForEdit(unidad)" /></td>
          <td><img class="delete" src="../assets/delete_ic.svg" alt="" @click="confirmDeleteUnidad(unidad.un_id)" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="catalogo-iva" v-if="activeSection === 'iva'">
    <h1 class="catalogo-titulo">IVA</h1>

    <div class="top-bar">
      <input v-model="searchQuery" type="text" placeholder="Buscar por nombre, código o familia" class="search-input" />
      <button class="agregar-btn" @click="abrirFormularioIva">+ Agregar IVA</button>
    </div>

    <table class="tabla">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Valor</th>
          <th>Editar</th>
          <th>Eliminar</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="iva in filteredIvas" :key="iva.iva_id">
          <td>{{ iva.iva_id }}</td>
          <td>{{ iva.iva_nombre }}</td>
          <td>{{ iva.iva_value }}%</td>
          <td><img class="edit" src="../assets/edit_ic.svg" alt="" @click="selectIvaForEdit(iva)" /></td>
          <td><img class="delete" src="../assets/delete_ic.svg" alt="" @click="confirmDeleteIva(iva.iva_id)" /></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="catalogo-marcas" v-if="activeSection === 'marcas'">
    <h1 class="catalogo-titulo">Marcas</h1>

    <div class="top-bar">
      <input v-model="searchQuery" type="text" placeholder="Buscar por nombre" class="search-input" />
      <button class="agregar-btn" @click="abrirFormularioMarca">+ Agregar Marca</button>
    </div>

    <table class="tabla">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Editar</th>
          <th>Eliminar</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="marca in filteredMarcas" :key="marca.ma_id">
          <td>{{ marca.ma_id }}</td>
          <td>{{ marca.ma_nombre }}</td>
          <td><img class="edit" src="../assets/edit_ic.svg" alt="" @click="selectMarcaForEdit(marca)" /></td>
          <td><img class="delete" src="../assets/delete_ic.svg" alt="" @click="confirmDeleteMarca(marca.ma_id)" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!---<div class="catalogo-articulo-marca" v-if="activeSection === 'articulo-marca'">
    <h1 class="catalogo-titulo">Articulo & Marcas</h1>

    <div class="top-bar">
      <input v-model="searchQuery" type="text" placeholder="Buscar por nombre" class="search-input" />
      <button class="agregar-btn" @click="mostrarFormulario">+ Agregar Articulo&Marca</button>
    </div>

    <table class="tabla">
      <thead>
        <tr>
          <th>Articulo</th>
          <th>Marca</th>
          <th>Editar</th>
          <th>Eliminar</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="marca in filteredMarcas" :key="marca.ma_id">
          <td>{{ marca.ma_id }}</td>
          <td>{{ marca.ma_nombre }}</td>
          <td><img class="edit" src="../assets/edit_ic.svg" alt="" @click="selectMarcaForEdit(marca)" /></td>
          <td><img class="delete" src="../assets/delete_ic.svg" alt="" @click="confirmDeleteMarca(marca.ma_id)" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>-->

  <div class="catalogo-familias" v-if="activeSection === 'familias'">
    <h1 class="catalogo-titulo">Familias</h1>

    <div class="top-bar">
      <input v-model="searchQuery" type="text" placeholder="Buscar por nombre de Familia" class="search-input" />
      <button class="agregar-btn" @click="abrirFormularioFamilia">+ Agregar Familia</button>
    </div>

    <table class="tabla">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Editar</th>
          <th>Eliminar</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="familia in filteredFamilias" :key="familia.fa_id">
          <td>{{ familia.fa_id }}</td>
          <td>{{ familia.fa_nombre }}</td>
          <td><img class="edit" src="../assets/edit_ic.svg" alt="" @click="selectFamiliaForEdit(familia)" /></td>
          <td><img class="delete" src="../assets/delete_ic.svg" alt="" @click="confirmDeleteFamilia(familia.fa_id)" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="catalogo-proveedores" v-if="activeSection === 'proveedores'">
    <h1 class="catalogo-titulo">Proveedores</h1>

    <div class="top-bar">
      <input v-model="searchQuery" type="text" placeholder="Buscar por nombre, email" class="search-input" />
      <button class="agregar-btn" @click="abrirFormularioProveedor">+ Agregar Proveedor</button>
    </div>

    <table class="tabla">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>CIF</th>
          <th>Email</th>
          <th>Telefono</th>
          <th>Editar</th>
          <th>Eliminar</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="proveedor in filteredProveedores" :key="proveedor.p_id">
          <td>{{ proveedor.p_id }}</td>
          <td>{{ proveedor.p_nombre }}</td>
          <td>{{ proveedor.p_cif }}</td>
          <td>{{ proveedor.p_email }}</td>
          <td>{{ proveedor.p_telefono }}</td>
          <td><img class="edit" src="../assets/edit_ic.svg" alt="" @click="selectProveedorForEdit(proveedor)" /></td>
          <td><img class="delete" src="../assets/delete_ic.svg" alt=""
              @click="confirmDeleteProveedor(proveedor.p_id)" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="catalogo-historial" v-if="activeSection === 'historialCompras'">
    <h1 class="catalogo-titulo">Historial de Compras</h1>

    <div class="top-bar">
      <input v-model="searchQuery" type="text" placeholder="Buscar por fechas" class="search-input" />
      <button class="agregar-btn" @click="abrirFormularioHistorial">+ Agregar Historial</button>
    </div>

    <table class="tabla">
      <thead>
        <tr>
          <th>Articulo</th>
          <th>Proveedor</th>
          <th>Precio</th>
          <th>Fecha</th>
          <th>Editar</th>
          <th>Eliminar</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="historial in filteredHistorialCompras" :key="historial.hc_fecha">
          <td>{{ getNombreArticulo(historial.a_id) }}</td>
          <td>{{ getNombreProveedor(historial.p_id) }}</td>
          <td>{{ historial.hc_precio.toFixed(2) }}€</td>
          <td>{{ historial.hc_fecha }}</td>
          <td><img class="edit" src="../assets/edit_ic.svg" alt="" @click="selectHistorialForEdit(historial)" /></td>
          <td><img class="delete" src="../assets/delete_ic.svg" alt=""
              @click="confirmDeleteHistorial(historial.hc_fecha)" /></td>
        </tr>
      </tbody>
    </table>
  </div>


  <!-- FORMULARIO CREAR ARTICULO (Modal) -->
  <div v-if="mostrarFormularioArticulo" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Nuevo Artículo</h2>
        <button class="close-btn" @click="cancelarFormulario">&times;</button>
      </div>

      <form @submit.prevent="guardarArticulo" class="formulario-articulo">
        <div class="form-columns">
          <div class="form-column">
            <div class="form-group">
              <label>Nombre:</label>
              <input v-model="nuevoArticulo.a_nombre" required />
            </div>

            <div class="form-group">
              <label>Código:</label>
              <input v-model="nuevoArticulo.a_cod" required />
            </div>

            <div class="form-group">
              <label>Familia:</label>
              <select v-model="nuevoArticulo.fa_id" required>
                <option v-for="familia in familias" :key="familia.fa_id" :value="familia.fa_id">
                  {{ familia.fa_nombre }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Unidad:</label>
              <select v-model="nuevoArticulo.un_id" required>
                <option v-for="unidad in unidades" :key="unidad.un_id" :value="unidad.un_id">
                  {{ unidad.un_nombre }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-column">
            <div class="form-group">
              <label>Precio:</label>
              <input type="number" v-model.number="nuevoArticulo.a_pvp" step="0.01" required />
            </div>

            <div class="form-group">
              <label>IVA:</label>
              <select v-model="nuevoArticulo.iva_id" required>
                <option v-for="iva in ivas" :key="iva.iva_id" :value="iva.iva_id">
                  {{ iva.iva_nombre }} ({{ iva.iva_value }}%)
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Último precio de compra:</label>
              <input type="number" v-model.number="nuevoArticulo.a_ultimo_pc" step="0.01" />
            </div>

            <div class="form-group">
              <label>Código de barras:</label>
              <input v-model="nuevoArticulo.a_cod_barras" />
            </div>
          </div>
        </div>

        <div class="button-group">
          <button type="button" @click="cancelarFormulario" class="btn-cancel">Cancelar</button>
          <button type="submit" class="btn-save">Guardar</button>
        </div>
      </form>
    </div>
  </div>

  <!-- FORMULARIO CREAR UNIDAD (Modal) -->
  <div v-if="mostrarFormularioUnidades" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Nueva Unidad</h2>
        <button class="close-btn" @click="cancelarFormulario">&times;</button>
      </div>

      <form @submit.prevent="guardarUnidad" class="formulario-unidad">
        <div class="form-columns">
          <div class="form-column">
            <div class="form-group">
              <label>Nombre:</label>
              <input v-model="nuevaUnidad.un_nombre" required />
            </div>
          </div>
        </div>

        <div class="button-group">
          <button type="button" @click="cancelarFormulario" class="btn-cancel">Cancelar</button>
          <button type="submit" class="btn-save">Guardar</button>
        </div>
      </form>
    </div>
  </div>

  <!-- FORMULARIO CREAR IVA (Modal) -->
  <div v-if="mostrarFormularioIva" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Nuevo IVA</h2>
        <button class="close-btn" @click="cancelarFormulario">&times;</button>
      </div>

      <form @submit.prevent="guardarIva" class="formulario-iva">
        <div class="form-columns">
          <div class="form-column">
            <div class="form-group">
              <label>Nombre:</label>
              <input v-model="nuevoIva.iva_nombre" required />
            </div>

            <div class="form-group">
              <label>Valor:</label>
              <input type="number" v-model.number="nuevoIva.iva_value" step="0.01" required />
            </div>
          </div>
        </div>

        <div class="button-group">
          <button type="button" @click="cancelarFormulario" class="btn-cancel">Cancelar</button>
          <button type="submit" class="btn-save">Guardar</button>
        </div>
      </form>
    </div>
  </div>

  <!-- FORMULARIO CREAR FAMILIA (Modal) -->

  <div v-if="mostrarFormularioFamilia" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Nueva Familia</h2>
        <button class="close-btn" @click="cancelarFormulario">&times;</button>
      </div>

      <form @submit.prevent="guardarFamilia" class="formulario-familia">
        <div class="form-columns">
          <div class="form-column">
            <div class="form-group">
              <label>Nombre:</label>
              <input v-model="nuevaFamilia.fa_nombre" required />
            </div>
          </div>
        </div>

        <div class="button-group">
          <button type="button" @click="cancelarFormulario" class="btn-cancel">Cancelar</button>
          <button type="submit" class="btn-save">Guardar</button>
        </div>
      </form>
    </div>
  </div>

  <!-- FORMULARIO CREAR MARCA (Modal) -->

  <div v-if="mostrarFormularioMarca" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Nueva Marca</h2>
        <button class="close-btn" @click="cancelarFormulario">&times;</button>
      </div>

      <form @submit.prevent="guardarMarca" class="formulario-marca">
        <div class="form-columns">
          <div class="form-column">
            <div class="form-group">
              <label>Nombre:</label>
              <input v-model="nuevaMarca.ma_nombre" required />
            </div>
          </div>
        </div>

        <div class="button-group">
          <button type="button" @click="cancelarFormulario" class="btn-cancel">Cancelar</button>
          <button type="submit" class="btn-save">Guardar</button>
        </div>
      </form>
    </div>
  </div>

  <!-- FORMULARIO CREAR PROVEEDOR (Modal) -->

  <div v-if="mostrarFormularioProveedor" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Nuevo Proveedor</h2>
        <button class="close-btn" @click="cancelarFormulario">&times;</button>
      </div>

      <form @submit.prevent="guardarProveedor" class="formulario-proveedor">
        <div class="form-columns">
          <div class="form-column">
            <div class="form-group">
              <label>Nombre:</label>
              <input v-model="nuevoProveedor.p_nombre" required />
            </div>
            <div class="form-group">
              <label>CIF:</label>
              <input v-model="nuevoProveedor.p_cif" required />
            </div>
            <div class="form-group">
              <label>Email:</label>
              <input v-model="nuevoProveedor.p_email" required />
            </div>
            <div class="form-group">
              <label>Teléfono:</label>
              <input v-model="nuevoProveedor.p_telefono" required />
            </div>
          </div>
        </div>

        <div class="button-group">
          <button type="button" @click="cancelarFormulario" class="btn-cancel">Cancelar</button>
          <button type="submit" class="btn-save">Guardar</button>
        </div>
      </form>
    </div>
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

  <!-- FORMULARIO DE EDICION ARTICULOS -->
  <div v-if="showEditForm" class="modal-overlay">
    <div class="modal-content">
      <form @submit.prevent="updateProducto">
        <h2>Editar Articulo</h2>
        <div class="form-group">
          <label for="edit-name">Nombre</label>
          <input v-model="selectedProducto.a_nombre" type="text" id="edit-name" required />
        </div>
        <div class="form-group">
          <label for="edit-cod">Código</label>
          <input v-model="selectedProducto.a_cod" type="text" id="edit-cod" required />
        </div>
        <div class="form-group">
          <label for="edit-unidad_id">Unidad</label>
          <input v-model="selectedProducto.un_id" type="number" id="edit-unidad_id" required />
        </div>
        <div class="form-group">
          <label for="edit-iva_id">Iva</label>
          <input v-model="selectedProducto.iva_id" type="number" id="edit-iva_id" required />
        </div>
        <div class="form-group">
          <label for="edit-ultimo_costo">Costo</label>
          <input v-model="selectedProducto.a_ultimo_pc" type="number" id="edit-ultimo_costo" required />
        </div>
        <div class="form-group">
          <label for="edit-precio_venta">Precio</label>
          <input v-model="selectedProducto.a_pvp" type="number" id="edit-precio_venta" required />
        </div>
        <div class="form-group">
          <label for="edit-codigo-barras">Codigo de Barras</label>
          <input v-model="selectedProducto.a_cod_barras" type="text" id="edit-codigo-barras" required />
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

  <!-- FORMULARIO DE EDICION UNIDADES -->
  <div v-if="showEditFormUnidad" class="modal-overlay">
    <div class="modal-content">
      <form @submit.prevent="updateUnidad">
        <h2>Editar Unidad</h2>
        <div class="form-group">
          <label for="edit-name">Nombre</label>
          <input v-model="selectedUnidad.un_nombre" type="text" id="edit-name" required />
        </div>
        <div class="modal-buttons">
          <button type="submit" class="submit-btn">Guardar</button>
          <button type="button" @click="closeEditFormUnidad" class="cancel-btn">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- FORMULARIO DE EDICION IVA -->
  <div v-if="showEditFormIva" class="modal-overlay">
    <div class="modal-content">
      <form @submit.prevent="updateIva">
        <h2>Editar Iva</h2>
        <div class="form-group">
          <label for="edit-name">Nombre</label>
          <input v-model="selectedIva.iva_nombre" type="text" id="edit-name" required />
        </div>
        <div class="form-group">
          <label for="edit-value">Valor</label>
          <input v-model="selectedIva.iva_value" type="number" id="edit-value" required />
        </div>
        <div class="modal-buttons">
          <button type="submit" class="submit-btn">Guardar</button>
          <button type="button" @click="closeEditFormIva" class="cancel-btn">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- FORMULARIO DE EDICION FAMILIA -->
  <div v-if="showEditFormFamilia" class="modal-overlay">
    <div class="modal-content">
      <form @submit.prevent="updateFamilia">
        <h2>Editar Familia</h2>
        <div class="form-group">
          <label for="edit-name">Nombre</label>
          <input v-model="selectedFamilia.fa_nombre" type="text" id="edit-name" required />
        </div>
        <div class="modal-buttons">
          <button type="submit" class="submit-btn">Guardar</button>
          <button type="button" @click="closeEditFormFamilia" class="cancel-btn">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- FORMULARIO DE EDICION MARCA -->
  <div v-if="showEditFormMarca" class="modal-overlay">
    <div class="modal-content">
      <form @submit.prevent="updateMarca">
        <h2>Editar Marca</h2>
        <div class="form-group">
          <label for="edit-name">Nombre</label>
          <input v-model="selectedMarca.ma_nombre" type="text" id="edit-name" required />
        </div>
        <div class="modal-buttons">
          <button type="submit" class="submit-btn">Guardar</button>
          <button type="button" @click="closeEditFormMarca" class="cancel-btn">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- FORMULARIO DE EDICION PROVEEDOR -->
  <div v-if="showEditFormProveedor" class="modal-overlay">
    <div class="modal-content">
      <form @submit.prevent="updateProveedor">
        <h2>Editar Proveedor</h2>
        <div class="form-group">
          <label for="edit-name">Nombre</label>
          <input v-model="selectedProveedor.p_nombre" type="text" id="edit-name" required />
        </div>
        <div class="form-group">
          <label for="edit-cif">CIF</label>
          <input v-model="selectedProveedor.p_cif" type="text" id="edit-cif" required />
        </div>
        <div class="form-group">
          <label for="edit-email">Email</label>
          <input v-model="selectedProveedor.p_email" type="email" id="edit-email" required />
        </div>
        <div class="form-group">
          <label for="edit-telefono">Teléfono</label>
          <input v-model="selectedProveedor.p_telefono" type="text" id="edit-telefono" required />
        </div>
        <div class="modal-buttons">
          <button type="submit" class="submit-btn">Guardar</button>
          <button type="button" @click="closeEditFormProveedor" class="cancel-btn">
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
      activeSection: null,
      productos: [],
      unidades: [],
      ivas: [],
      familias: [],
      marcas: [],
      proveedores: [],
      historialCompras: [],
      nuevoArticulo: {
        a_nombre: "",
        a_cod: "",
        fa_id: null,
        un_id: null,
        a_pvp: "",
        a_ultimo_pc: "",
        iva_id: null,
        a_cod_barras: ""
      },
      nuevaUnidad: {
        un_nombre: "",
      },
      nuevoIva: {
        iva_nombre: "",
        iva_value: "",
      },
      nuevaFamilia: {
        fa_nombre: "",
      },
      nuevaMarca: {
        ma_nombre: "",
      },
      nuevoProveedor: {
        p_nombre: "",
        p_cif: "",
        p_email: "",
        p_telefono: "",
      },
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
      showEditFormUnidad: false,
      showEditFormIva: false,
      showEditFormFamilia: false,
      showEditFormMarca: false,
      showEditFormProveedor: false,
      selectedProducto: null,
      selectedUnidad: null,
      selectedIva: null,
      selectedFamilia: null,
      selectedMarca: null,
      selectedProveedor: null,
      mostrarFormularioArticulo: false,
      mostrarFormularioUnidades: false,
      mostrarFormularioIva: false,
      mostrarFormularioFamilia: false,
      mostrarFormularioMarca: false,
      mostrarFormularioProveedor: false,

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
        [iva.iva_nombre]
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

    filteredMarcas() {
      const query = this.searchQuery.toLowerCase();
      return this.marcas.filter((marca) =>
        [marca.ma_nombre]
          .some((field) => field && field.toLowerCase().includes(query))
      );
    },

    filteredProveedores() {
      const query = this.searchQuery.toLowerCase();
      return this.proveedores.filter((proveedor) =>
        [proveedor.p_nombre, proveedor.p_email]
          .some((field) => field && field.toLowerCase().includes(query))
      );
    },

    filteredHistorialCompras() {
      const query = this.searchQuery.toLowerCase();
      return this.historialCompras.filter((historial) =>
        [historial.hc_fecha]
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
      this.selectSection('articulos');
      this.fetchProductos();
      this.fetchUnidades();
      this.fetchIvas();
      this.fetchFamilias();
      this.fetchMarcas();
      this.fetchProveedores();
      this.fetchHistorialCompras();
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
    selectSection(section) {
      this.activeSection = section;
      if (section === 'articulos') {
        this.fetchProductos();
      }
      if (section === 'unidades') {
        this.fetchUnidades();
      }
      if (section === 'iva') {
        this.fetchIvas();
      }
      if (section === 'familias') {
        this.fetchFamilias();
      }
      if (section === 'marcas') {
        this.fetchMarcas();
      }
      if (section === 'proveedores') {
        this.fetchProveedores();
      }
      if (section === 'historialCompras') {
        this.fetchHistorialCompras();
      }
    },

    /*Obtener Nombres*/
    getUnidadNombre(un_id) {
      const unidad = this.unidades.find(u => u.un_id === un_id);
      return unidad ? unidad.un_nombre : 'Desconocida';
    },
    getFamiliaNombre(fa_id) {
      const familia = this.familias.find(f => f.fa_id === fa_id);
      return familia ? familia.fa_nombre : 'Desconocida';
    },
    getIvaValor(iva_id) {
      const iva = this.ivas.find(i => i.iva_id === iva_id);
      return iva ? iva.iva_value.toFixed(2) : '0.00';
    },
    getNombreArticulo(a_id) {
      const articulo = this.productos.find(a => a.a_id === a_id);
      return articulo ? articulo.a_nombre : 'Desconocido';
    },
    getNombreProveedor(p_id) {
      const proveedor = this.proveedores.find(p => p.p_id === p_id);
      return proveedor ? proveedor.p_nombre : 'Desconocido';
    },


    /*Obtener datos desde la API*/
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

    async fetchMarcas() {
      try {
        const response = await axios.get("https://localhost:7198/api/Marcas");
        this.marcas = response.data;
      } catch (error) {
        console.error("Error al cargar las marcas:", error);
      }
    },

    async fetchProveedores() {
      try {
        const response = await axios.get("https://localhost:7198/api/Proveedores");
        this.proveedores = response.data;
      } catch (error) {
        console.error("Error al cargar los proveedores:", error);
      }
    },

    async fetchHistorialCompras() {
      try {
        const response = await axios.get("https://localhost:7198/api/HistorialCompra");
        this.historialCompras = response.data;
      } catch (error) {
        console.error("Error al cargar el historial de compras:", error);
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

    deleteUnidad(id) {
      localStorage.setItem('unidadId', id);
      axios.delete("https://localhost:7198/api/Unidades/" + id)
        .then(() => {
          this.fetchUnidades();
          alert("Unidad eliminada correctamente");
        })
        .catch((error) => {
          console.error("Error al eliminar unidad", error);
        })
    },

    deleteIva(id) {
      localStorage.setItem('ivaId', id);
      axios.delete("https://localhost:7198/api/Iva/" + id)
        .then(() => {
          this.fetchIvas();
          alert("IVA eliminado correctamente");
        })
        .catch((error) => {
          console.error("Error al eliminar IVA", error);
        })
    },

    deleteFamilia(id) {
      localStorage.setItem('familiaId', id);
      axios.delete("https://localhost:7198/api/Familias/" + id)
        .then(() => {
          this.fetchFamilias();
          alert("Familia eliminada correctamente");
        })
        .catch((error) => {
          console.error("Error al eliminar familia", error);
        })
    },

    deleteMarca(id) {
      localStorage.setItem('marcaId', id);
      axios.delete("https://localhost:7198/api/Marcas/" + id)
        .then(() => {
          this.fetchMarcas();
          alert("Marca eliminada correctamente");
        })
        .catch((error) => {
          console.error("Error al eliminar marca", error);
        })
    },

    deleteProveedor(id) {
      localStorage.setItem('proveedorId', id);
      axios.delete("https://localhost:7198/api/Proveedores/" + id)
        .then(() => {
          this.fetchProveedores();
          alert("Proveedor eliminado correctamente");
        })
        .catch((error) => {
          console.error("Error al eliminar proveedor", error);
        })
    },

    confirmDelete(id) {
      if (confirm("¿Deseas eliminar este producto?")) {
        this.deleteProduct(id);
      }
    },

    confirmDeleteUnidad(id) {
      if (confirm("¿Deseas eliminar esta unidad?")) {
        this.deleteUnidad(id);
      }
    },
    confirmDeleteIva(id) {
      if (confirm("¿Deseas eliminar este IVA?")) {
        this.deleteIva(id);
      }
    },

    confirmDeleteFamilia(id) {
      if (confirm("¿Deseas eliminar esta familia?")) {
        this.deleteFamilia(id);
      }
    },

    confirmDeleteMarca(id) {
      if (confirm("¿Deseas eliminar esta marca?")) {
        this.deleteMarca(id);
      }
    },

    confirmDeleteProveedor(id) {
      if (confirm("¿Deseas eliminar este proveedor?")) {
        this.deleteProveedor(id);
      }
    },

    selectArticuloForEdit(producto) {
      console.log("Producto seleccionado para edición:", producto);
      this.selectedProducto = { ...producto };
      this.showEditForm = true;
    },
    selectUnidadForEdit(unidad) {
      console.log("Unidad seleccionada para edición:", unidad);
      this.selectedUnidad = { ...unidad };
      this.showEditFormUnidad = true;
    },

    selectIvaForEdit(iva) {
      console.log("IVA seleccionado para edición:", iva);
      this.selectedIva = { ...iva };
      this.showEditFormIva = true;
    },

    selectMarcaForEdit(marca) {
      console.log("Marca seleccionada para edición:", marca);
      this.selectedMarca = { ...marca };
      this.showEditFormMarca = true;
    },

    selectProveedorForEdit(proveedor) {
      console.log("Proveedor seleccionado para edición:", proveedor);
      this.selectedProveedor = { ...proveedor };
      this.showEditFormProveedor = true;
    },

    selectFamiliaForEdit(familia) {
      console.log("Familia seleccionada para edición:", familia);
      this.selectedFamilia = { ...familia };
      this.showEditFormFamilia = true;
    },

    updateUnidad() {
      const unidadToUpdate = {
        un_id: this.selectedUnidad.un_id,
        un_nombre: this.selectedUnidad.un_nombre
      };
      axios.put(`https://localhost:7198/api/Unidades/${unidadToUpdate.un_id}`, unidadToUpdate)
        .then(() => {
          alert("Unidad actualizada correctamente");
          this.fetchUnidades();
          this.closeEditFormUnidad();
        })
        .catch((error) => {
          console.error("Error al actualizar unidad", error);
        })
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

    updateIva() {
      axios.put(`https://localhost:7198/api/Iva/${this.selectedIva.iva_id}`, this.selectedIva)
        .then(() => {
          alert("Iva actualizado correctamente");
          this.fetchIvas();
          this.closeEditFormIva();
        })
        .catch((error) => {
          console.error("Error al actualizar iva", error);
        });
    },

    updateFamilia() {
      axios.put(`https://localhost:7198/api/Familias/${this.selectedFamilia.fa_id}`, this.selectedFamilia)
        .then(() => {
          alert("Familia actualizada correctamente");
          this.fetchFamilias();
          this.closeEditFormFamilia();
        })
        .catch((error) => {
          console.error("Error al actualizar familia", error);
        })
    },

    updateMarca() {
      axios.put(`https://localhost:7198/api/Marcas/${this.selectedMarca.ma_id}`, this.selectedMarca)
        .then(() => {
          alert("Marca actualizada correctamente");
          this.fetchMarcas();
          this.closeEditFormMarca();
        })
        .catch((error) => {
          console.error("Error al actualizar marca", error);
        })
    },

    updateProveedor() {
      axios.put(`https://localhost:7198/api/Proveedores/${this.selectedProveedor.p_id}`, this.selectedProveedor)
        .then(() => {
          alert("Proveedor actualizado correctamente");
          this.fetchProveedores();
          this.closeEditFormProveedor();
        })
        .catch((error) => {
          console.error("Error al actualizar proveedor", error);
        })
    },


    guardarArticulo() {
      this.mostrarFormularioArticulo = true;
      axios.post("https://localhost:7198/api/Articulos", this.nuevoArticulo)
        .then(() => {
          this.fetchProductos();
          this.cancelarFormulario();
        })
        .catch((error) => {
          console.error("Error al crear Articulo", error);
          alert("Error al crear Articulo");
        })
    },
    guardarUnidad() {
      this.mostrarFormularioUnidades = true;
      axios.post("https://localhost:7198/api/Unidades", this.nuevaUnidad)
        .then(() => {
          this.fetchUnidades();
          this.cancelarFormularioUnidad();
        })
        .catch((error) => {
          console.error("Error al crear unidad", error);
        })
    },

    guardarIva() {
      this.mostrarFormularioIva = true;
      axios.post("https://localhost:7198/api/Iva", this.nuevoIva)
        .then(() => {
          this.fetchIvas();
          this.cancelarFormularioIva();
        })
        .catch((error) => {
          console.error("Error al crear iva", error);
        })
    },

    guardarFamilia() {
      this.mostrarFormularioFamilia = true;
      axios.post("https://localhost:7198/api/Familias", this.nuevaFamilia)
        .then(() => {
          this.fetchFamilias();
          this.cancelarFormularioFamilia();
        })
        .catch((error) => {
          console.error("Error al crear familia", error);
        })
    },

    guardarMarca() {
      this.mostrarFormularioMarca = true;
      axios.post("https://localhost:7198/api/Marcas", this.nuevaMarca)
        .then(() => {
          this.fetchMarcas();
          this.cancelarFormularioMarca();
        })
        .catch((error) => {
          console.error("Error al crear marca", error);
        })
    },

    guardarProveedor() {
      this.mostrarFormularioProveedor = true;
      axios.post("https://localhost:7198/api/Proveedores", this.nuevoProveedor)
        .then(() => {
          this.fetchProveedores();
          this.cancelarFormularioProveedor();
        })
        .catch((error) => {
          console.error("Error al crear proveedor", error);
        })
    },

    abrirFormularioArticulo() {
      this.mostrarFormularioArticulo = true;
    },
    abrirFormularioUnidades() {
      this.mostrarFormularioUnidades = true;
    },
    abrirFormularioIva() {
      this.mostrarFormularioIva = true;
    },
    abrirFormularioMarca(){
      this.mostrarFormularioMarca = true;
    },
    abrirFormularioFamilia() {
      this.mostrarFormularioFamilia = true;
    },
    abrirFormularioProveedor() {
      this.mostrarFormularioProveedor = true;
    },

    cancelarFormulario() {
      this.mostrarFormularioArticulo = false;
      this.resetFormulario();
    },

    cancelarFormularioUnidad() {
      this.mostrarFormularioUnidades = false;
      this.resetFormularioUnidad();
    },

    cancelarFormularioIva() {
      this.mostrarFormularioIva = false;
      this.resetFormularioIva();
    },

    cancelarFormularioFamilia() {
      this.mostrarFormularioFamilia = false;
      this.resetFormularioFamilia();
    },

    cancelarFormularioMarca() {
      this.mostrarFormularioMarca = false;
      this.resetFormularioMarca();
    },

    cancelarFormularioProveedor() {
      this.mostrarFormularioProveedor = false;
      this.resetFormularioProveedor();
    },

    resetFormulario() {
      this.nuevoArticulo = {
        a_nombre: '',
        a_cod: '',
        fa_id: null,
        un_id: null,
        a_pvp: 0,
        iva_id: null,
        a_ultimo_pc: 0,
        a_cod_barras: ''
      };
    },

    resetFormularioUnidad() {
      this.nuevaUnidad = {
        un_nombre: '',
      };
    },

    resetFormularioIva() {
      this.nuevoIva = {
        iva_nombre: '',
        iva_value: 0
      }
    },

    resetFormularioFamilia() {
      this.nuevaFamilia = {
        fa_nombre: ''
      }
    },

    resetFormularioMarca() {
      this.nuevaMarca = {
        ma_nombre: ''
      }
    },

    resetFormularioProveedor() {
      this.nuevoProveedor = {
        p_nombre: '',
        p_telefono: '',
        p_mail: '',
        p_cif: ''
      }
    },

    closeEditForm() {
      this.showEditForm = false;
      this.selectedProducto = null;
    },

    closeEditFormUnidad() {
      this.showEditFormUnidad = false;
      this.selectedUnidad = null;
    },

    closeEditFormIva() {
      this.showEditFormIva = false;
      this.selectedIva = null;
    },

    closeEditFormFamilia() {
      this.showEditFormFamilia = false;
      this.selectedFamilia = null;
    },

    closeEditFormMarca() {
      this.showEditFormMarca = false;
      this.selectedMarca = null;
    },
    closeEditFormProveedor() {
      this.showEditFormProveedor = false;
      this.selectedProveedor = null;
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
      console.log("Iniciar sesión con:", this.user);
      if (!this.user.u_password || !this.user.u_mail) {
        alert("Por favor, completa todos los campos.");
        return;
      }

      console.log("Datos a enviar:", JSON.stringify(this.user));

      axios.post('https://localhost:7198/api/Login/login', this.user)
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
/* Estilos mejorados para el modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  /* Espacio alrededor del modal */
  overflow-y: auto;
  /* Permite scroll si el contenido es muy largo */
}

.modal-content {
  background-color: #ffffff;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  /* Un poco más ancho para dos columnas */
  max-height: 90vh;
  /* Limita la altura máxima */
  overflow-y: auto;
  /* Scroll interno si es necesario */
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
  animation: fadeIn 0.3s ease-in-out;
  padding: 2rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #ffffff;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #ff0000;
}

.close-btn:hover {
  color: #ece4e4;
}

/* Formulario en dos columnas */
.form-columns {
  display: flex;
  gap: 2rem;
}

.form-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Mejoras en los inputs */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #444;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #2e2f36;
  outline: none;
}

/* Botones mejorados */
.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-cancel {
  background-color: #e67e22;
  color: black;
  padding: 8px;
}

.btn-cancel:hover {
  background-color: #eb9c57;
}

.btn-save {
  background-color: #2ecc71;
  color: black;
  padding: 8px;
}

.btn-save:hover {
  background-color: #85eeb1;
}

/* Responsive */
@media (max-width: 768px) {
  .form-columns {
    flex-direction: column;
    gap: 1rem;
  }

  .modal-content {
    width: 95%;
    padding: 1.5rem;
  }
}


/* Estilos para las tablas */
.table,
.tabla {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.table th,
.table td,
.tabla th,
.tabla td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}


.table td,
.tabla td {
  color: #050715;
  background-color: #fff;
}


.table th,
.tabla th {
  background-color: #2e2f36;
  color: #fff;
}

.table img,
.tabla img {
  cursor: pointer;
  width: 20px;
  align-items: center;
}

/* Estilos para el menu */

.admin-menu {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 1rem 0;
}

.admin-menu button {
  padding: 10px 20px;
  background-color: #2e2f36;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}

.admin-menu button:hover {
  background-color: #006666;
}

/* Estilos para agregar articulo */

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
  max-width: 60%;
  padding: 8px;
  font-size: 1rem;
}

.agregar-btn {
  background-color: #2e2f36;
  color: #fff;
  border: none;
  padding: 10px 16px;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: 1rem;
}

.agregar-btn:hover {
  background-color: #44454d;
}




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

.catalogo-familias {
  padding: 40px;
  text-align: center;
}

.catalogo-marcas {
  padding: 40px;
  text-align: center;
}

.catalogo-proveedores {
  padding: 40px;
  text-align: center;
}

.catalogo-historial {
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
}

.delete {
  cursor: pointer;
  width: 30px;
  height: 30px;
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