<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const logout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="layout-container">
    <nav class="navbar">
      <div class="nav-brand">
        Mini CRM
      </div>

      <div class="nav-links">
        <button class="nav-btn" @click="$router.push('/')">Dashboard</button>
        <button class="nav-btn" @click="$router.push('/customers')">Clientes</button>
        <button class="nav-btn" @click="$router.push('/orders')">Órdenes</button>
      </div>

      <div class="nav-auth">
        <button class="logout-btn" @click="logout">Logout</button>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
/* Contenedor principal para dar un fondo gris claro que haga resaltar las cards */
.layout-container {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  height: 70px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05); /* Sombra suave como las cards */
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  letter-spacing: -0.5px;
}

.nav-links {
  display: flex;
  gap: 10px;
}

/* Estilo de botones de navegación */
.nav-btn {
  background: transparent;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  color: #42b883; /* El verde de tus stats */
  background-color: rgba(66, 184, 131, 0.1);
}

/* Botón de Logout con un estilo diferenciado */
.logout-btn {
  background-color: #ff5f5f; 
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.3s;
}

.logout-btn:hover {
  opacity: 0.8;
}

.main-content {
  padding: 20px;
}
</style>