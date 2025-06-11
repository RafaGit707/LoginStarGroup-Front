<template>
  <transition name="slide-fade">
    <div v-if="visible" :class="['notification-card', type]" @click="close">
      <div class="notification-content">
        <span class="notification-icon">{{ icon }}</span>
        <p class="notification-message">{{ message }}</p>
      </div>
      <button class="notification-close" @click.stop="close">×</button>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'NotificationCard',
  props: {
    message: {
      type: String,
      required: true,
    },
    // 'success' para correcto, 'error' para incorrecto
    type: {
      type: String,
      default: 'success',
      validator: (value) => ['success', 'error'].includes(value),
    },
    duration: {
      type: Number,
      default: 8000, // La notificación desaparecerá después de 4 segundos
    },
  },
  data() {
    return {
      visible: false,
      timer: null,
    };
  },
  computed: {
    // Devuelve un icono según el tipo de notificación
    icon() {
      return this.type === 'success' ? '✔' : '✖';
    },
  },
  mounted() {
    // Hacemos visible el componente al montarlo
    this.visible = true;
    // Creamos un temporizador para que se oculte solo
    this.timer = setTimeout(() => {
      this.close();
    }, this.duration);
  },
  beforeUnmount() {
    // Limpiamos el temporizador si el componente se destruye antes
    clearTimeout(this.timer);
  },
  methods: {
    close() {
      clearTimeout(this.timer);
      this.visible = false;
      // Esperamos a que la animación de salida termine para emitir el evento 'closed'
      setTimeout(() => {
        this.$emit('closed');
      }, 3000); // La duración debe coincidir con la transición en CSS
    },
  },
};
</script>

<style scoped>
.notification-card {
  position: fixed;
  bottom: 20px;
  right: 20px;
  min-width: 300px;
  max-width: 400px;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  z-index: 9999;
  cursor: pointer;
}

/* Estilo para notificación de éxito */
.notification-card.success {
  background-color: #28a745; /* Verde éxito */
  border-left: 5px solid #218838;
}

/* Estilo para notificación de error */
.notification-card.error {
  background-color: #dc3545; /* Rojo error */
  border-left: 5px solid #c82333;
}

.notification-content {
  display: flex;
  align-items: center;
}

.notification-icon {
  font-size: 1.5rem;
  margin-right: 15px;
}

.notification-message {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
}

.notification-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  opacity: 0.7;
  padding-left: 15px;
}
.notification-close:hover {
  opacity: 1;
}

/* Animación de entrada y salida */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-in-out;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>