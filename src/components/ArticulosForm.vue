<template>
    <form @submit.prevent="submit">
    <input v-model="local.a_cod" placeholder="Código" required />
    <input v-model="local.a_nombre" placeholder="Nombre" required />
    <input v-model="local.a_pvp" type="number" placeholder="PVP" required />
    <input v-model="local.a_cod_barras" placeholder="Código de barras" />

    <select v-model="local.fa_id" required>
        <option disabled value="">Familia</option>
        <option v-for="f in familias" :key="f.fa_id" :value="f.fa_id">{{ f.fa_nombre }}</option>
    </select>

    <select v-model="local.un_id" required>
        <option disabled value="">Unidad</option>
        <option v-for="u in unidades" :key="u.un_id" :value="u.un_id">{{ u.un_nombre }}</option>
    </select>

    <select v-model="local.iva_id" required>
        <option disabled value="">IVA</option>
        <option v-for="i in ivas" :key="i.iva_id" :value="i.iva_id">{{ i.iva_nombre }} ({{ i.iva_value }}%)</option>
    </select>

    <button type="submit">Guardar</button>
    <button type="button" @click="$emit('cancel')">Cancelar</button>
    </form>
</template>

<script>
export default {
    name: 'ArticulosForm',
    props: {
    articulo: Object,
    familias: Array,
    unidades: Array,
    ivas: Array
    },
    data() {
    return {
        local: { ...this.articulo }
    }
    },
    watch: {
    articulo: {
        handler(newVal) {
        this.local = { ...newVal }
        },
        deep: true
    }
    },
    methods: {
    submit() {
        this.$emit('submit', this.local)
    }
    }
}
</script>
