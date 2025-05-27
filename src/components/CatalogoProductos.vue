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
          <td><img class="delete" src="../assets/delete_ic.svg" alt="" @click="confirmDeleteUnidad(unidad.un_id)" /></td>
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
      <button class="agregar-btn" @click="abrirFormulario">+ Agregar Articulo&Marca</button>
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
      <input v-model="searchQuery" type="text" placeholder="Buscar por nombre, código o familia" class="search-input" />
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
          <td><img class="delete" src="../assets/delete_ic.svg" alt="" @click="confirmDeleteFamilia(familia.fa_id)" /></td>
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
        </tr>
      </thead>
      <tbody>
        <tr v-for="historial in filteredHistorialCompras" :key="historial.hc_fecha">
          <td>{{ getNombreArticulo(historial.a_id) }}</td>
          <td>{{ getNombreProveedor(historial.p_id) }}</td>
          <td>{{ historial.hc_precio.toFixed(2) }}€</td>
          <td>{{ historial.hc_fecha }}</td>
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
     
      selectedProducto: null,
      selectedUnidad: null,
      selectedIva: null,
      selectedFamilia: null,
      selectedMarca: null,
      selectedProveedor: null,
      selectedHistorial: null,

      showEditForm: false, // Para el modal de edición de producto
      showEditFormUnidad: false,
      showEditFormIva: false,
      showEditFormFamilia: false,
      showEditFormMarca: false,
      showEditFormProveedor: false,
      showEditFormHistorial: false,

      mostrarFormularioArticulo: false, // Para el modal de nuevo artículo
      mostrarFormularioUnidades: false,
      mostrarFormularioIva: false,
      mostrarFormularioFamilia: false,
      mostrarFormularioMarca: false,
      mostrarFormularioProveedor: false,
      mostrarFormularioHistorial: false,

      searchQuery: "",
      isUserAdmin: false, // Nueva propiedad en data para almacenar el resultado de la verificación
      authChecked: false, // Para saber si la verificación inicial ya se hizo
    };
  },
 computed: {
    // Propiedad computada para determinar si el usuario es admin
    isAdmin() {
      return this.isUserAdmin;
    },
    // ... (tus otras propiedades computadas filteredProductos, filteredUnidades, etc. permanecen igual)
    filteredProductos() {
      if (!this.isAdmin) return []; // No mostrar productos si no es admin
      const query = this.searchQuery.toLowerCase();
      return this.productos.filter((producto) =>
        [producto.a_nombre, producto.a_cod, this.getFamiliaNombre(producto.fa_id)] // Incluir nombre de familia en la búsqueda
          .some((field) => field && field.toString().toLowerCase().includes(query))
      );
    },
    filteredUnidades() {
      if (!this.isAdmin) return [];
      const query = this.searchQuery.toLowerCase();
      return this.unidades.filter((unidad) =>
        [unidad.un_nombre]
          .some((field) => field && field.toString().toLowerCase().includes(query))
      );
    },
    filteredIvas() {
      if (!this.isAdmin) return [];
      const query = this.searchQuery.toLowerCase();
      return this.ivas.filter((iva) =>
        [iva.iva_nombre, iva.iva_value.toString()] // Convertir valor a string para includes
          .some((field) => field && field.toLowerCase().includes(query))
      );
    },
    filteredFamilias() {
      if (!this.isAdmin) return [];
      const query = this.searchQuery.toLowerCase();
      return this.familias.filter((familia) =>
        [familia.fa_nombre]
          .some((field) => field && field.toString().toLowerCase().includes(query))
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
  },
  created() {
    // Llama al método para verificar la autenticación y el rol al crear el componente
    this.verifyAuthAndSetAdminStatus();
  },

  methods: {
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

    selectSection(section) {
      this.activeSection = section;
      if (section === 'articulos') {
        this.fetchProductos();
      }
      if (section === 'unidades') {
        this.fetchUnidades();
      }
      if (section === 'ivas') {
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

    async fetchProductos() {
      try {
        const response = await axios.get(API_BASE_URL+"articulos");
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
        const response = await axios.get(API_BASE_URL+"Unidades");
        this.unidades = response.data;
      } catch (error) {
        console.error("Error al cargar las unidades:", error);
      }
    },

    async fetchIvas() {
      try {
        const response = await axios.get(API_BASE_URL+"Iva");
        this.ivas = response.data;
      } catch (error) {
        console.error("Error al cargar los IVA:", error);
      }
    },

    async fetchFamilias() {
      try {
        const response = await axios.get(API_BASE_URL+"Familias");
        this.familias = response.data;
      } catch (error) {
        console.error("Error al cargar las familias:", error);
      }

    },

    async fetchMarcas() {
      try {
        const response = await axios.get(API_BASE_URL+"Marcas");
        this.marcas = response.data;
      } catch (error) {
        console.error("Error al cargar las marcas:", error);
      }
    },

    async fetchProveedores() {
      try {
        const response = await axios.get(API_BASE_URL+"Proveedores");
        this.proveedores = response.data;
      } catch (error) {
        console.error("Error al cargar los proveedores:", error);
      }
    },

    async fetchHistorialCompras() {
      try {
        const response = await axios.get(API_BASE_URL+"HistorialCompra");
        this.historialCompras = response.data;
      } catch (error) {
        console.error("Error al cargar el historial de compras:", error);
      }
    },

    deleteProduct(id) {
      localStorage.setItem('productId', id);
      axios.delete(API_BASE_URL+"articulos/" + id)
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
      axios.delete(API_BASE_URL+"Unidades/" + id)
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
      axios.delete(API_BASE_URL+"Iva/" + id)
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
      axios.delete(API_BASE_URL+"Familias/" + id)
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
      axios.delete(API_BASE_URL+"Marcas/" + id)
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
      axios.delete(API_BASE_URL+"Proveedores/" + id)
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
      this.selectedProducto = {...producto};
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
      axios.put(API_BASE_URL+`Articulos/${this.selectedProducto.a_id}`, this.selectedProducto

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
      axios.put(API_BASE_URL+`Unidades/${unidadToUpdate.un_id}`, unidadToUpdate)
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
      axios.put(API_BASE_URL+`Iva/${this.selectedIva.iva_id}`, this.selectedIva)
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
      axios.put(API_BASE_URL+`Familias/${this.selectedFamilia.fa_id}`, this.selectedFamilia)
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
      axios.put(API_BASE_URL+`Marcas/${this.selectedMarca.ma_id}`, this.selectedMarca)
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
      axios.put(API_BASE_URL+`Proveedores/${this.selectedProveedor.p_id}`, this.selectedProveedor)
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
      axios.post(API_BASE_URL+"Articulos", this.nuevoArticulo)
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
      axios.post(API_BASE_URL+"Unidades", this.nuevaUnidad)
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
      axios.post(API_BASE_URL+"Iva", this.nuevoIva)
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
      axios.post(API_BASE_URL+"Familias", this.nuevaFamilia)
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
      axios.post(API_BASE_URL+"Marcas", this.nuevaMarca)
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
      axios.post(API_BASE_URL+"Proveedores", this.nuevoProveedor)
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
      axios.post(API_BASE_URL+"HistorialCompra", this.nuevoHistorial)
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