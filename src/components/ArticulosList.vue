<template>
    <div>
    <ArticulosCard
        v-for="art in articulos"
        :key="art.a_id"
        :articulo="art"
        @editar="$emit('editar', art)"
        @eliminar="$emit('eliminar', art.a_id)"
    />
    </div>
</template>

<script>
import ArticulosCard from './ArticulosCard.vue'
export default {
    name: 'ArticulosList',
    props: {
    articulos: Array
    },
    components: { ArticulosCard }
}
</script>
