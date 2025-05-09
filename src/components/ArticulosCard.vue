<template>
    <div class="articulo-card">
    <h3>{{ articulo.a_nombre }}</h3>
    <p><strong>Código:</strong> {{ articulo.a_cod }}</p>
    <p><strong>PVP:</strong> {{ articulo.a_pvp }} €</p>
    <p><strong>Unidad:</strong> {{ articulo.unidad?.un_nombre }}</p>
    <p><strong>Familia:</strong> {{ articulo.familia?.fa_nombre }}</p>
    <p><strong>IVA:</strong> {{ articulo.iva?.iva_nombre }} ({{ articulo.iva?.iva_value }}%)</p>
    <button @click="$emit('editar')">Editar</button>
    <button @click="$emit('eliminar')">Eliminar</button>
    </div>
</template>

<script>
export default {
    name: 'ArticulosCard',
    props: {
    articulo: Object
    }
}
</script>

<style scoped>
.articulo-card {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 15px;
}
</style>
