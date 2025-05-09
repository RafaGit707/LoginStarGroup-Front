<template>
    <div>
      <h1>Gestión de Artículos</h1>
      <button @click="abrirFormulario()">Nuevo Artículo</button>
  
      <ArticulosForm
        v-if="mostrarFormulario"
        :articulo="formulario"
        :familias="familias"
        :unidades="unidades"
        :ivas="ivas"
        @submit="guardarArticulo"
        @cancel="cancelarFormulario"
      />
  
      <ArticulosList
        :articulos="articulos"
        @editar="abrirFormulario"
        @eliminar="eliminarArticulo"
      />
    </div>
  </template>
  
  <script>
  import ArticulosForm from '../components/ArticulosForm.vue'
  import ArticulosList from '../components/ArticulosList.vue'
  import axios from 'axios'
  
  export default {
    name: 'ArticulosPage',
    components: { ArticulosForm, ArticulosList },
    data() {
      return {
        articulos: [],
        familias: [],
        unidades: [],
        ivas: [],
        mostrarFormulario: false,
        formulario: this.articuloVacio()
      }
    },
    mounted() {
      this.obtenerArticulos()
      this.obtenerDatosRelacionados()
    },
    methods: {
      articuloVacio() {
        return {
          a_id: null,
          a_cod: '',
          a_nombre: '',
          a_pvp: 0,
          a_cod_barras: '',
          fa_id: null,
          un_id: null,
          iva_id: null
        }
      },
      obtenerArticulos() {
        axios.get('http://localhost:5289/api/Articulos')
          .then(res => this.articulos = res.data)
          .catch(err => console.error('Error cargando artículos:', err))
      },
      obtenerDatosRelacionados() {
        axios.get('http://localhost:5289/api/Familias').then(res => this.familias = res.data)
        axios.get('http://localhost:5289/api/Unidades').then(res => this.unidades = res.data)
        axios.get('http://localhost:5289/api/Iva').then(res => this.ivas = res.data)
      },
      abrirFormulario(articulo = null) {
        this.formulario = articulo ? { ...articulo } : this.articuloVacio()
        this.mostrarFormulario = true
      },
      cancelarFormulario() {
        this.mostrarFormulario = false
        this.formulario = this.articuloVacio()
      },
      guardarArticulo(articulo) {
        const peticion = articulo.a_id
          ? axios.put(`http://localhost:5289/api/Articulos/${articulo.a_id}`, articulo)
          : axios.post('http://localhost:5289/api/Articulos', articulo)
  
        peticion
          .then(() => {
            this.obtenerArticulos()
            this.cancelarFormulario()
          })
          .catch(err => console.error('Error al guardar artículo:', err))
      },
      eliminarArticulo(id) {
        if (confirm('¿Eliminar este artículo?')) {
          axios.delete(`http://localhost:5289/api/Articulos/${id}`)
            .then(() => this.obtenerArticulos())
            .catch(err => console.error('Error al eliminar artículo:', err))
        }
      }
    }
  }
  </script>
  