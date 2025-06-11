<template>
  <div id="app">
    <HeaderPage @login-success="handleLoginSuccess" />

    <main class="main-container">
      <router-view />
    </main>

    <FooterPage />
    <div class="notification-container">
      <NotificationCard v-for="notification in notifications" :key="notification.id" :message="notification.message"
        :type="notification.type" @closed="removeNotification(notification.id)" />
    </div>
  </div>
</template>

<script>
import HeaderPage from './components/HeaderPage.vue'
import FooterPage from './components/FooterPage.vue'
import NotificationCard from './components/NotificacionCard.vue'
import { jwtDecode } from 'jwt-decode';

export default {
  name: 'App',
  components: {
    HeaderPage,
    FooterPage,
    NotificationCard
  },
  data() {
    return {
      appIsAdmin: false,
      isAdmin: localStorage.getItem("isAdmin") === 'true',
      notifications: []
    };
  },
  created() {
    this.emitter.on('show-notification', (notification) => {
      this.addNotification(notification.message, notification.type);
    });

    // Opcional: Si App.vue necesita saber el estado de admin al cargar
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token); // Necesitas importar jwtDecode aquí también
        if (decoded.exp * 1000 > Date.now()) {
          this.appIsAdmin = decoded.email && decoded.email.toLowerCase() === 'antonio.carnero@star-group.net';
        }
      } catch (e) {
        this.appIsAdmin = false;
      }
    }
  },
  methods: {
    handleLoginSuccess(data) {
      this.appIsAdmin = data.isAdmin;
      this.isAdmin = data.isAdmin;
      localStorage.setItem("isAdmin", data.isAdmin);
    },

    addNotification(message, type = 'success') {
      const id = Date.now() + Math.random();
      this.notifications.push({ id, message, type });
    },
    removeNotification(id) {
      this.notifications = this.notifications.filter(n => n.id !== id);
    },
  }
}
</script>
