<template>

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

  <div class="catalogo-productos" v-if="activeSection === 'articulos' && isAdmin">
    <!-- Contenedor principal de la sección -->
    <h1 class="catalogo-titulo">Artículos</h1> <!-- Título de la sección -->

    <div class="busqueda-catalogo"> <!-- Barra de búsqueda -->
      <input v-model="searchQuery" type="text" placeholder="Buscar por nombre, código o familia" class="search-input"
        @keyup.enter="performSearchArticulos" /> <!-- Necesitarás un método performSearchArticulos o generalizarlo -->
      <img class="search-button-catalogo" src="../assets/search_icon.svg" alt="Buscar" @click="performSearchArticulos">
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
          <th class="columna-acciones"> <!-- Última columna para el botón de añadir -->
            <img class="add-button-catalogo" src="../assets/ic-add.png" alt="Agregar Artículo"
              @click="abrirFormularioArticulo">
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="producto in paginatedArticulos" :key="producto.a_id">
          <td>{{ producto.a_nombre }}</td>
          <td>{{ producto.a_cod }}</td>
          <td>{{ getFamiliaNombre(producto.fa_id) }}</td>
          <td>{{ getUnidadNombre(producto.un_id) }}</td>
          <td>{{ producto.a_pvp.toFixed(2) }}€</td>
          <td>{{ getIvaValor(producto.iva_id) }}%</td>
          <td>{{ producto.a_ultimo_pc.toFixed(2) }}€</td>
          <td>{{ producto.a_cod_barras }}</td>
          <td class="columna-acciones"> <!-- Última columna para editar/borrar -->
            <img class="edit" src="../assets/editar.png" alt="Editar" @click="selectArticuloForEdit(producto)">
            <img class="delete" src="../assets/borrar.png" alt="Eliminar" @click="confirmDelete(producto.a_id)">
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination-controls" v-if="totalPagesArticulos > 0">
      <button @click="prevPageArticulos" :disabled="currentPageArticulos === 1">Anterior</button>
      <span>Página {{ currentPageArticulos }} de {{ totalPagesArticulos }}</span>
      <button @click="nextPageArticulos" :disabled="currentPageIvas === totalPagesArticulos">Siguiente</button>
    </div>
  </div>



  <div class="catalogo-unidades" v-if="activeSection === 'unidades' && isAdmin">
    <h1 class="catalogo-titulo">Unidades</h1>

    <div class="busqueda-catalogo">
      <input v-model="searchQuery" type="text" placeholder="Buscar por nombre" class="search-input"
        @keyup.enter="performSearchUnidades" /> <!-- O método de búsqueda general -->
      <img class="search-button-catalogo" src="../assets/search_icon.svg" alt="Buscar" @click="performSearchUnidades">
      <!-- O método de búsqueda general -->
    </div>

    <table class="tabla">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th class="columna-acciones">
            <img class="add-button-catalogo" src="../assets/ic-add.png" alt="Agregar Unidad"
              @click="abrirFormularioUnidades">
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="unidad in paginatedUnidades" :key="unidad.un_id">
          <td>{{ unidad.un_id }}</td>
          <td>{{ unidad.un_nombre }}</td>
          <td class="columna-acciones">
            <img class="edit" src="../assets/editar.png" alt="Editar" @click="selectUnidadForEdit(unidad)">
            <img class="delete" src="../assets/borrar.png" alt="Eliminar" @click="confirmDeleteUnidad(unidad.un_id)">
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination-controls" v-if="totalPagesUnidades > 0">
      <button @click="prevPageUnidades" :disabled="currentPageUnidades === 1">Anterior</button>
      <span>Página {{ currentPageUnidades }} de {{ totalPagesUnidades }}</span>
      <button @click="nextPageUnidades" :disabled="currentPageUnidades === totalPagesUnidades">Siguiente</button>
    </div>
  </div>


  <div class="catalogo-iva" v-if="activeSection === 'iva' && isAdmin">
    <h1 class="catalogo-titulo">IVA</h1>

    <div class="busqueda-catalogo">
      <input v-model="searchQuery" type="text" placeholder="Buscar por nombre o valor" class="search-input"
        @keyup.enter="performSearchIvas" /> <!-- O método de búsqueda general -->
      <img class="search-button-catalogo" src="../assets/search_icon.svg" alt="Buscar" @click="performSearchIvas">
      <!-- O método de búsqueda general -->
    </div>

    <table class="tabla">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Valor</th>
          <th class="columna-acciones">
            <img class="add-button-catalogo" src="../assets/ic-add.png" alt="Agregar IVA" @click="abrirFormularioIva">
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ivaItem in paginatedIvas" :key="ivaItem.iva_id">
          <td>{{ ivaItem.iva_id }}</td>
          <td>{{ ivaItem.iva_nombre }}</td>
          <td>{{ ivaItem.iva_value }}%</td>
          <td class="columna-acciones">
            <img class="edit" src="../assets/editar.png" alt="Editar" @click="selectIvaForEdit(ivaItem)">
            <img class="delete" src="../assets/borrar.png" alt="Eliminar" @click="confirmDeleteIva(ivaItem.iva_id)">
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination-controls" v-if="totalPagesIvas > 0">
      <button @click="prevPageIvas" :disabled="currentPageIvas === 1">Anterior</button>
      <span>Página {{ currentPageIvas }} de {{ totalPagesIvas }}</span>
      <button @click="nextPageIvas" :disabled="currentPageIvas === totalPagesIvas">Siguiente</button>
    </div>
  </div>

  <div class="catalogo-marcas" v-if="activeSection === 'marcas' && isAdmin">
    <h1 class="catalogo-titulo">Marcas</h1>

    <div class="busqueda-catalogo">
      <input v-model="searchQuery" type="text" placeholder="Buscar por nombre" class="search-input"
        @keyup.enter="performSearchMarcas" /> <!-- O método de búsqueda general -->
      <img class="search-button-catalogo" src="../assets/search_icon.svg" alt="Buscar" @click="performSearchMarcas">
      <!-- O método de búsqueda general -->
    </div>

    <table class="tabla">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th class="columna-acciones">
            <img class="add-button-catalogo" src="../assets/ic-add.png" alt="Agregar Marca"
              @click="abrirFormularioMarca">
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="marca in paginatedMarcas" :key="marca.ma_id">
          <td>{{ marca.ma_id }}</td>
          <td>{{ marca.ma_nombre }}</td>
          <td class="columna-acciones">
            <img class="edit" src="../assets/editar.png" alt="Editar" @click="selectMarcaForEdit(marca)">
            <img class="delete" src="../assets/borrar.png" alt="Eliminar" @click="confirmDeleteMarca(marca.ma_id)">
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination-controls" v-if="totalPagesMarcas > 0">
      <button @click="prevPageMarcas" :disabled="currentPageMarcas === 1">Anterior</button>
      <span>Página {{ currentPageMarcas }} de {{ totalPagesMarcas }}</span>
      <button @click="nextPageMarcas" :disabled="currentPageMarcas === totalPagesMarcas">Siguiente</button>
    </div>
  </div>

  <!---<div class="catalogo-articulo-marca" v-if="activeSection === 'articulo-marca'">
    <h1 class="catalogo-titulo">Articulo & Marcas</h1>

    <div class="top-bar">
      <input v-model="searchQuery" type="text" placeholder="Buscar por nombre" class="search-input" />
      <button class="agregar-btn" @click="abrirFormulario">+ Agregar Articulo&Marca</button>
    </div>

    <table class="tabla">
      <thead>
        <tr>
          <th>Articulo</th>
          <th>Marca</th>
          <th class="columna-acciones-header">Acciones</th>
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

  <div class="catalogo-familias" v-if="activeSection === 'familias' && isAdmin">
    <h1 class="catalogo-titulo">Familias</h1>

    <div class="busqueda-catalogo">
      <input v-model="searchQuery" type="text" placeholder="Buscar por nombre" class="search-input"
        @keyup.enter="performSearchFamilias" /> <!-- O método de búsqueda general -->
      <img class="search-button-catalogo" src="../assets/search_icon.svg" alt="Buscar" @click="performSearchFamilias">
      <!-- O método de búsqueda general -->
    </div>

    <table class="tabla">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th class="columna-acciones">
            <img class="add-button-catalogo" src="../assets/ic-add.png" alt="Agregar Familia"
              @click="abrirFormularioFamilia">
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="familia in paginatedFamilias" :key="familia.fa_id">
          <td>{{ familia.fa_id }}</td>
          <td>{{ familia.fa_nombre }}</td>
          <td class="columna-acciones">
            <img class="edit" src="../assets/editar.png" alt="Editar" @click="selectFamiliaForEdit(familia)">
            <img class="delete" src="../assets/borrar.png" alt="Eliminar" @click="confirmDeleteFamilia(familia.fa_id)">
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination-controls" v-if="totalPagesFamilias > 0">
      <button @click="prevPageFamilias" :disabled="currentPageFamilias === 1">Anterior</button>
      <span>Página {{ currentPageFamilias }} de {{ totalPagesFamilias }}</span>
      <button @click="nextPageFamilias" :disabled="currentPageFamilias === totalPagesFamilias">Siguiente</button>
    </div>
  </div>

  <div class="catalogo-proveedores" v-if="activeSection === 'proveedores' && isAdmin">
    <h1 class="catalogo-titulo">Proveedores</h1>

    <div class="busqueda-catalogo">
      <input v-model="searchQuery" type="text" placeholder="Buscar por nombre o email" class="search-input"
        @keyup.enter="performSearchProveedores" /> <!-- O método de búsqueda general -->
      <img class="search-button-catalogo" src="../assets/search_icon.svg" alt="Buscar"
        @click="performSearchProveedores"> <!-- O método de búsqueda general -->
    </div>

    <table class="tabla">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>CIF</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th class="columna-acciones">
            <img class="add-button-catalogo" src="../assets/ic-add.png" alt="Agregar Proveedor"
              @click="abrirFormularioProveedor">
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="proveedor in paginatedProveedores" :key="proveedor.p_id">
          <td>{{ proveedor.p_id }}</td>
          <td>{{ proveedor.p_nombre }}</td>
          <td>{{ proveedor.p_cif }}</td>
          <td>{{ proveedor.p_email }}</td>
          <td>{{ proveedor.p_telefono }}</td>
          <td class="columna-acciones">
            <img class="edit" src="../assets/editar.png" alt="Editar" @click="selectProveedorForEdit(proveedor)">
            <img class="delete" src="../assets/borrar.png" alt="Eliminar"
              @click="confirmDeleteProveedor(proveedor.p_id)">
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination-controls" v-if="totalPagesProveedores > 0">
      <button @click="prevPageProveedores" :disabled="currentPageProveedores === 1">Anterior</button>
      <span>Página {{ currentPageProveedores }} de {{ totalPagesProveedores }}</span>
      <button @click="nextPageProveedores"
        :disabled="currentPageProveedores === totalPagesProveedores">Siguiente</button>
    </div>
  </div>

  <div class="catalogo-historial" v-if="activeSection === 'historialCompras' && isAdmin">
    <h1 class="catalogo-titulo">Historial de Compras</h1>

    <div class="top-bar-catalogo"> <!-- Usaremos una clase específica para evitar conflictos -->
      <div class="search-container-catalogo"> <!-- Contenedor para el input y el icono de búsqueda -->
        <input v-model="searchQuery" type="text" placeholder="Buscar por artículo, proveedor o fecha"
          class="search-input" @keyup.enter="performSearchHistorialCompras" />
        <img class="search-button-catalogo" src="../assets/search_icon.svg" alt="Buscar"
          @click="performSearchHistorialCompras">
      </div>
      <button class="agregar-btn-catalogo" @click="abrirFormularioHistorial">+ Agregar Historial</button>
    </div>

    <table class="tabla">
      <thead>
        <tr>
          <th>Artículo</th>
          <th>Proveedor</th>
          <th>Precio</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="historial in paginatedHistorialCompras"
          :key="historial.hc_id || `${historial.a_id}-${historial.p_id}-${historial.hc_fecha}`">
          <td>{{ getNombreArticulo(historial.a_id) }}</td>
          <td>{{ getNombreProveedor(historial.p_id) }}</td>
          <td>{{ historial.hc_precio.toFixed(2) }}€</td>
          <td>{{ historial.hc_fecha }}</td>
        </tr>
      </tbody>
    </table>

    <div class="pagination-controls" v-if="totalPagesHistorialCompras > 0">
      <button @click="prevPageHistorialCompras" :disabled="currentPageHistorialCompras === 1">Anterior</button>
      <span>Página {{ currentPageHistorialCompras }} de {{ totalPagesHistorialCompras }}</span>
      <button @click="nextPageHistorialCompras"
        :disabled="currentPageHistorialCompras === totalPagesHistorialCompras">Siguiente</button>
    </div>
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
        <button class="close-btn" @click="cancelarFormularioUnidad">&times;</button>
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
          <button type="button" @click="cancelarFormularioUnidad" class="btn-cancel">Cancelar</button>
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
        <button class="close-btn" @click="cancelarFormularioIva">&times;</button>
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
          <button type="button" @click="cancelarFormularioIva" class="btn-cancel">Cancelar</button>
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
        <button class="close-btn" @click="cancelarFormularioFamilia">&times;</button>
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
          <button type="button" @click="cancelarFormularioFamilia" class="btn-cancel">Cancelar</button>
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
        <button class="close-btn" @click="cancelarFormularioMarca">&times;</button>
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
          <button type="button" @click="cancelarFormularioMarca" class="btn-cancel">Cancelar</button>
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
        <button class="close-btn" @click="cancelarFormularioProveedor">&times;</button>
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
          <button type="button" @click="cancelarFormularioProveedor" class="btn-cancel">Cancelar</button>
          <button type="submit" class="btn-save">Guardar</button>
        </div>
      </form>
    </div>
  </div>

  <!-- FORMULARIO CREAR HISTORIALCOMPRAS (Modal) -->

  <div v-if="mostrarFormularioHistorial" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Nuevo Historial de Compras</h2>
        <button class="close-btn" @click="cancelarFormularioHistorial">&times;</button>
      </div>

      <form @submit.prevent="guardarHistorialCompras" class="formulario-historial-compras">
        <div class="form-columns">
          <div class="form-column">
            <div class="form-group">
              <label>Artículo:</label>
              <select v-model="nuevoHistorial.a_id" required>
                <option v-for="producto in productos" :key="producto.a_id" :value="producto.a_id">
                  {{ producto.a_nombre }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Proveedor:</label>
              <select v-model="nuevoHistorial.p_id" required>
                <option v-for="proveedor in proveedores" :key="proveedor.p_id" :value="proveedor.p_id">
                  {{ proveedor.p_nombre }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Precio:</label>
              <input v-model="nuevoHistorial.hc_precio" required />
            </div>
            <div class="form-group">
              <label>Fecha:</label>
              <input type="date" v-model="nuevoHistorial.hc_fecha" required />
            </div>
          </div>
        </div>

        <div class="button-group">
          <button type="button" @click="cancelarFormularioHistorial" class="btn-cancel">Cancelar</button>
          <button type="submit" class="btn-save">Guardar</button>
        </div>
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

  <!-- FORMULARIO DE EDICION HISTORIAL DE COMPRAS 

  <div v-if="showEditFormHistorial" class="modal-overlay">
  <div class="modal-content">
    <form @submit.prevent="updateHistorial">
      <h2>Editar Historial de Compras</h2>
      <div class="form-group">
        <label for="edit-articulo">Artículo</label>
        <select v-model="selectedHistorial.a_id" required>
          <option v-for="producto in productos" :key="producto.a_id" :value="producto.a_id">
            {{ producto.a_nombre }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="edit-proveedor">Proveedor</label>
        <select v-model="selectedHistorial.p_id" required>
          <option v-for="proveedor in proveedores" :key="proveedor.p_id" :value="proveedor.p_id">
            {{ proveedor.p_nombre }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="edit-precio">Precio</label>
        <input v-model="selectedHistorial.hc_precio" type="number" id="edit-precio" required />
      </div>
      <div class="form-group">
        <label for="edit-fecha">Fecha</label>
        <input v-model="selectedHistorial.hc_fecha" type="date" id="edit-fecha" required />
      </div>
      <div class="modal-buttons">
        <button type="submit" class="submit-btn">Guardar</button>
        <button type="button" @click="closeEditFormHistorial" class="cancel-btn">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</div>-->

</template>

<script>
import { API_BASE_URL } from "@/config/apiConfig";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';

const ITEMS_PER_PAGE = 5;

export default {
  name: "CatalogoProductos",
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
      nuevoHistorial: {
        a_id: '',
        p_id: '',
        hc_precio: '',
        hc_fecha: ''
      },
      itemsPerPage: ITEMS_PER_PAGE,
      currentPageArticulos: 1,
      currentPageUnidades: 1,
      currentPageIvas: 1,
      currentPageFamilias: 1,
      currentPageMarcas: 1,
      currentPageProveedores: 1,
      currentPageHistorialCompras: 1,

      selectedProducto: null,
      selectedUnidad: null,
      selectedIva: null,
      selectedFamilia: null,
      selectedMarca: null,
      selectedProveedor: null,
      selectedHistorial: null,

      showEditForm: false,
      showEditFormUnidad: false,
      showEditFormIva: false,
      showEditFormFamilia: false,
      showEditFormMarca: false,
      showEditFormProveedor: false,
      showEditFormHistorial: false,

      mostrarFormularioArticulo: false,
      mostrarFormularioUnidades: false,
      mostrarFormularioIva: false,
      mostrarFormularioFamilia: false,
      mostrarFormularioMarca: false,
      mostrarFormularioProveedor: false,
      mostrarFormularioHistorial: false,

      searchQuery: "",
      currentSearchTerm: "",
      isUserAdmin: false,
      authChecked: false,
    };
  },

  computed: {
    // Propiedad computada para determinar si el usuario es admin
    isAdmin() {
      return this.isUserAdmin;
    },

    /*Funciones para los Filtros*/

    filteredProductos() {
      if (!this.isAdmin) return [];
      const query = this.currentSearchTerm.toLowerCase();
      if (!query) {
        return this.productos;
      }
      return this.productos.filter((producto) =>
        [producto.a_nombre, producto.a_cod, this.getFamiliaNombre(producto.fa_id)]
          .some((field) => field && field.toString().toLowerCase().includes(query))
      );
    },

    totalPagesArticulos() {
      return Math.ceil(this.filteredProductos.length / this.itemsPerPage);
    },

    paginatedArticulos() {
      const startIndex = (this.currentPageArticulos - 1) * this.itemsPerPage;
      return this.filteredProductos.slice(startIndex, startIndex + this.itemsPerPage);
    },


    filteredUnidades() {
      if (!this.isAdmin) return [];
      const query = (this.currentSearchTerm || "").toLowerCase();
      if (!query) { return this.unidades; }
      return this.unidades.filter(u => u.un_nombre && u.un_nombre.toLowerCase().includes(query));
    },

    totalPagesUnidades() {
      return Math.ceil(this.filteredUnidades.length / this.itemsPerPage);
    },
    paginatedUnidades() {
      const startIndex = (this.currentPageUnidades - 1) * this.itemsPerPage;
      return this.filteredUnidades.slice(startIndex, startIndex + this.itemsPerPage);
    },


    filteredIvas() {
      if (!this.isAdmin) return [];
      const query = (this.currentSearchTerm || "").toLowerCase();
      if (!query) { return this.ivas; }
      return this.ivas.filter(i =>
        (i.iva_nombre && i.iva_nombre.toLowerCase().includes(query)) ||
        (i.iva_value != null && i.iva_value.toString().toLowerCase().includes(query))
      );
    },

    totalPagesIvas() {
      return Math.ceil(this.filteredIvas.length / this.itemsPerPage);
    },
    paginatedIvas() {
      const startIndex = (this.currentPageIvas - 1) * this.itemsPerPage;
      return this.filteredIvas.slice(startIndex, startIndex + this.itemsPerPage);
    },


     filteredFamilias() {
      if (!this.isAdmin) return [];
      const query = (this.currentSearchTerm || "").toLowerCase();
      if (!query) { return this.familias; }
      return this.familias.filter(f => f.fa_nombre && f.fa_nombre.toLowerCase().includes(query));
    },

    totalPagesFamilias() {
      return Math.ceil(this.filteredFamilias.length / this.itemsPerPage);
    },
    paginatedFamilias() {
      const startIndex = (this.currentPageFamilias - 1) * this.itemsPerPage;
      return this.filteredFamilias.slice(startIndex, startIndex + this.itemsPerPage);
    },

     filteredMarcas() {
      if (!this.isAdmin) return []; // Asegurar que también verifica isAdmin
      const query = (this.currentSearchTerm || "").toLowerCase();
      if (!query) { return this.marcas; }
      return this.marcas.filter(m => m.ma_nombre && m.ma_nombre.toLowerCase().includes(query));
    },

    totalPagesMarcas() {
      return Math.ceil(this.filteredMarcas.length / this.itemsPerPage);
    },
    paginatedMarcas() {
      const startIndex = (this.currentPageMarcas - 1) * this.itemsPerPage;
      return this.filteredMarcas.slice(startIndex, startIndex + this.itemsPerPage);
    },

    filteredProveedores() {
      if (!this.isAdmin) return []; // Asegurar que también verifica isAdmin
      const query = (this.currentSearchTerm || "").toLowerCase();
      if (!query) { return this.proveedores; }
      return this.proveedores.filter(p =>
        (p.p_nombre && p.p_nombre.toLowerCase().includes(query)) ||
        (p.p_email && p.p_email.toLowerCase().includes(query))
      );
    },

    totalPagesProveedores() {
      return Math.ceil(this.filteredProveedores.length / this.itemsPerPage);
    },
    paginatedProveedores() {
      const startIndex = (this.currentPageProveedores - 1) * this.itemsPerPage;
      return this.filteredProveedores.slice(startIndex, startIndex + this.itemsPerPage);
    },



    filteredHistorialCompras() {
      if (!this.isAdmin) return [];
      const query = (this.currentSearchTerm || "").toLowerCase();
      if (!query) { return this.historialCompras; }
      return this.historialCompras.filter((historial) =>
        [
          this.getNombreArticulo(historial.a_id),
          this.getNombreProveedor(historial.p_id),
          historial.hc_fecha
        ].some((field) => field && field.toString().toLowerCase().includes(query))
      );
    },

    totalPagesHistorialCompras() {
      return Math.ceil(this.filteredHistorialCompras.length / this.itemsPerPage);
    },
    paginatedHistorialCompras() {
      const startIndex = (this.currentPageHistorialCompras - 1) * this.itemsPerPage;
      return this.filteredHistorialCompras.slice(startIndex, startIndex + this.itemsPerPage);
    }
  },




  totalPagesHistorialCompras() {
    return Math.ceil(this.filteredHistorialCompras.length / this.itemsPerPage);
  },
  paginatedHistorialCompras() {
    const startIndex = (this.currentPageHistorialCompras - 1) * this.itemsPerPage;
    return this.filteredHistorialCompras.slice(startIndex, startIndex + this.itemsPerPage);
  },


  created() {
    this.verifyAuthAndSetAdminStatus();
  },

  methods: {

    /* Metodos para busqueda con filtro */

    performSearchArticulos() {
      this.currentSearchTerm = this.searchQuery;
      this.currentPageArticulos = 1;
    },

    performSearchUnidades() {
      this.currentSearchTerm = this.searchQuery;
      this.currentPageUnidades = 1;
    },
    performSearchIvas() {
      this.currentSearchTerm = this.searchQuery;
      this.currentPageIvas = 1;
    },
    performSearchFamilias() {
      this.currentSearchTerm = this.searchQuery;
      this.currentPageFamilias = 1;
    },
    performSearchMarcas() {
      this.currentSearchTerm = this.searchQuery;
      this.currentPageMarcas = 1;
    },
    performSearchProveedores() {
      this.currentSearchTerm = this.searchQuery;
      this.currentPageProveedores = 1;
    },
    performSearchHistorialCompras() {
      this.currentSearchTerm = this.searchQuery;
      this.currentPageHistorialCompras = 1;
    },



    verifyAuthAndSetAdminStatus() {
      const token = localStorage.getItem('authToken');
      let isAdminUser = false; // Valor por defecto

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.exp * 1000 < Date.now()) {
            console.warn("CatalogoProductos: Token expirado.");
            localStorage.removeItem('authToken');
            // No redirigir desde aquí directamente para evitar bucles si esta página es '/'
            // La redirección debería manejarla el router guard o App.vue
          } else {
            // console.log("CatalogoProductos - Decoded token:", decodedToken);
            if (decodedToken.isAdmin !== undefined && decodedToken.isAdmin.toString().toLowerCase() === 'true') {
              isAdminUser = true;
            }
          }
        } catch (e) {
          console.error("CatalogoProductos - Error decoding token:", e);
          localStorage.removeItem('authToken');
        }
      }
      this.isUserAdmin = isAdminUser;
      this.authChecked = true; // Marcar que la verificación se ha hecho

      // Después de verificar, si es admin, inicializa los datos
      if (this.isUserAdmin) {
        this.initializeAdminData();
      }
    },

    initializeAdminData() {
      console.log("CatalogoProductos: Inicializando datos de admin.");
      this.selectSection('articulos');
      this.fetchUnidades();
      this.fetchIvas();
      this.fetchFamilias();
      this.fetchMarcas();
      this.fetchProveedores();
      this.fetchHistorialCompras();
    },

    async selectSection(section) { // Mantenemos async aquí por si en el futuro necesitas un await al inicio
      this.activeSection = section;
      this.currentSearchTerm = "";
      this.searchQuery = "";

      switch (section) {
        case 'articulos':
          this.currentPageArticulos = 1;
          this.fetchProductos(); // SIN await
          if (!this.familias.length) this.fetchFamilias(); // SIN await
          if (!this.unidades.length) this.fetchUnidades(); // SIN await
          if (!this.ivas.length) this.fetchIvas(); // SIN await
          break;
        case 'unidades':
          this.currentPageUnidades = 1;
          this.fetchUnidades(); // SIN await
          break;
        case 'iva':
          this.currentPageIvas = 1;
          this.fetchIvas(); // SIN await
          break;
        case 'familias':
          this.currentPageFamilias = 1;
          this.fetchFamilias(); // SIN await
          break;
        case 'marcas':
          this.currentPageMarcas = 1;
          this.fetchMarcas(); // SIN await
          break;
        case 'proveedores':
          this.currentPageProveedores = 1;
          this.fetchProveedores(); // SIN await
          break;
        case 'historialCompras':
          this.currentPageHistorialCompras = 1;
          // Si estas fetch no tienen dependencias entre sí, también puedes quitar await
          if (!this.productos.length) this.fetchProductos();
          if (!this.proveedores.length) this.fetchProveedores();
          this.fetchHistorialCompras();
          break;
      }
    },

    prevPageArticulos() { if (this.currentPageArticulos > 1) this.currentPageArticulos--; },
    nextPageArticulos() { if (this.currentPageArticulos < this.totalPagesArticulos) this.currentPageArticulos++; },

    prevPageUnidades() { if (this.currentPageUnidades > 1) this.currentPageUnidades--; },
    nextPageUnidades() { if (this.currentPageUnidades < this.totalPagesUnidades) this.currentPageUnidades++; },

    prevPageIvas() { if (this.currentPageIvas > 1) this.currentPageIvas--; },
    nextPageIvas() { if (this.currentPageIvas < this.totalPagesIvas) this.currentPageIvas++; },

    prevPageFamilias() { if (this.currentPageFamilias > 1) this.currentPageFamilias--; },
    nextPageFamilias() { if (this.currentPageFamilias < this.totalPagesFamilias) this.currentPageFamilias++; },

    prevPageMarcas() { if (this.currentPageMarcas > 1) this.currentPageMarcas--; },
    nextPageMarcas() { if (this.currentPageMarcas < this.totalPagesMarcas) this.currentPageMarcas++; },

    prevPageProveedores() { if (this.currentPageProveedores > 1) this.currentPageProveedores--; },
    nextPageProveedores() { if (this.currentPageProveedores < this.totalPagesProveedores) this.currentPageProveedores++; },

    prevPageHistorialCompras() { if (this.currentPageHistorialCompras > 1) this.currentPageHistorialCompras--; },
    nextPageHistorialCompras() { if (this.currentPageHistorialCompras < this.totalPagesHistorialCompras) this.currentPageHistorialCompras++; },



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

    async fetchProductos() {
      try {
        const response = await axios.get(API_BASE_URL + "articulos");
        this.productos = response.data;
        this.currentPageArticulos = 1;
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    },

    async fetchUnidades() {
      try {
        const response = await axios.get(API_BASE_URL + "Unidades");
        this.unidades = response.data;
        this.currentPageUnidades = 1;
      } catch (error) {
        console.error("Error al cargar las unidades:", error);
      }
    },

    async fetchIvas() {
      try {
        const response = await axios.get(API_BASE_URL + "Iva");
        this.ivas = response.data;
        this.currentPageIvas = 1;
      } catch (error) {
        console.error("Error al cargar los IVA:", error);
      }
    },

    async fetchFamilias() {
      try {
        const response = await axios.get(API_BASE_URL + "Familias");
        this.familias = response.data;
        this.currentPageFamilias = 1;
      } catch (error) {
        console.error("Error al cargar las familias:", error);
      }

    },

    async fetchMarcas() {
      try {
        const response = await axios.get(API_BASE_URL + "Marcas");
        this.marcas = response.data;
        this.currentPageMarcas = 1;
      } catch (error) {
        console.error("Error al cargar las marcas:", error);
      }
    },

    async fetchProveedores() {
      try {
        const response = await axios.get(API_BASE_URL + "Proveedores");
        this.proveedores = response.data;
        this.currentPageProveedores = 1;
      } catch (error) {
        console.error("Error al cargar los proveedores:", error);
      }
    },

    async fetchHistorialCompras() {
      try {
        const response = await axios.get(API_BASE_URL + "HistorialCompra");
        this.historialCompras = response.data;
        this.currentPageHistorialCompras = 1;
      } catch (error) {
        console.error("Error al cargar el historial de compras:", error);
      }
    },

    deleteProduct(id) {
      localStorage.setItem('productId', id);
      axios.delete(API_BASE_URL + "articulos/" + id)
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
      axios.delete(API_BASE_URL + "Unidades/" + id)
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
      axios.delete(API_BASE_URL + "Iva/" + id)
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
      axios.delete(API_BASE_URL + "Familias/" + id)
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
      axios.delete(API_BASE_URL + "Marcas/" + id)
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
      axios.delete(API_BASE_URL + "Proveedores/" + id)
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

    confirmDeleteHistorial(id) {
      if (confirm("¿Deseas eliminar este historial de compra?")) {
        this.deleteHistorial(id);
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

    /*selectHistorialForEdit(historial) {
      console.log("Historial seleccionado para edición:", historial);
      this.selectedHistorial = { ...historial };
      this.showEditFormHistorial = true;
    },*/

    selectFamiliaForEdit(familia) {
      console.log("Familia seleccionada para edición:", familia);
      this.selectedFamilia = { ...familia };
      this.showEditFormFamilia = true;
    },
    updateProducto() {
      axios.put(API_BASE_URL + `Articulos/${this.selectedProducto.a_id}`, this.selectedProducto

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
    updateUnidad() {
      const unidadToUpdate = {
        un_id: this.selectedUnidad.un_id,
        un_nombre: this.selectedUnidad.un_nombre
      };
      axios.put(API_BASE_URL + `Unidades/${unidadToUpdate.un_id}`, unidadToUpdate)
        .then(() => {
          alert("Unidad actualizada correctamente");
          this.fetchUnidades();
          this.closeEditFormUnidad();
        })
        .catch((error) => {
          console.error("Error al actualizar unidad", error);
        })
    },
    updateIva() {
      axios.put(API_BASE_URL + `Iva/${this.selectedIva.iva_id}`, this.selectedIva)
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
      axios.put(API_BASE_URL + `Familias/${this.selectedFamilia.fa_id}`, this.selectedFamilia)
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
      axios.put(API_BASE_URL + `Marcas/${this.selectedMarca.ma_id}`, this.selectedMarca)
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
      axios.put(API_BASE_URL + `Proveedores/${this.selectedProveedor.p_id}`, this.selectedProveedor)
        .then(() => {
          alert("Proveedor actualizado correctamente");
          this.fetchProveedores();
          this.closeEditFormProveedor();
        })
        .catch((error) => {
          console.error("Error al actualizar proveedor", error);
        })
    },

    /*updateHistorial() {
      this.mostrarFormularioHistorial = true;
      axios.put(API_BASE_URL+"historialCompra/" + this.selectedHistorial.hc_fecha, this.selectedHistorial)
        .then(() => {
          alert("Historial actualizado correctamente");
          this.fetchHistorial();
          this.closeEditFormHistorial();
        })
        .catch((error) => {
          console.error("Error al actualizar historial", error);
        })
    },*/
    guardarArticulo() {
      this.mostrarFormularioArticulo = true;
      axios.post(API_BASE_URL + "Articulos", this.nuevoArticulo)
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
      axios.post(API_BASE_URL + "Unidades", this.nuevaUnidad)
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
      axios.post(API_BASE_URL + "Iva", this.nuevoIva)
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
      axios.post(API_BASE_URL + "Familias", this.nuevaFamilia)
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
      axios.post(API_BASE_URL + "Marcas", this.nuevaMarca)
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
      axios.post(API_BASE_URL + "Proveedores", this.nuevoProveedor)
        .then(() => {
          this.fetchProveedores();
          this.cancelarFormularioProveedor();
        })
        .catch((error) => {
          console.error("Error al crear proveedor", error);
        })
    },

    guardarHistorialCompras() {
      this.mostrarFormularioHistorial = true;
      axios.post(API_BASE_URL + "HistorialCompra", this.nuevoHistorial)
        .then(() => {
          this.fetchHistorialCompras();
          this.cancelarFormularioHistorial();
        })
        .catch((error) => {
          console.error("Error al crear historial", error);
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
    abrirFormularioMarca() {
      this.mostrarFormularioMarca = true;
    },
    abrirFormularioFamilia() {
      this.mostrarFormularioFamilia = true;
    },
    abrirFormularioProveedor() {
      this.mostrarFormularioProveedor = true;
    },

    abrirFormularioHistorial() {
      this.mostrarFormularioHistorial = true;
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

    cancelarFormularioHistorial() {
      this.mostrarFormularioHistorial = false;
      this.resetFormularioHistorial();
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

    resetFormularioHistorial() {
      this.nuevoHistorial = {
        a_id: null,
        p_id: null,
        hc_precio: 0,
        hc_fecha: ''
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

    closeEditFormHistorial() {
      this.showEditFormHistorial = false;
      this.selectedHistorial = null;
    },
  },
};

</script>