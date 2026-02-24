<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'

const router = useRouter()

const email = ref('')
const password = ref('')

const login = async () => {
  const res = await api.post('/auth/login', {
    email: email.value,
    password: password.value,
  })

  localStorage.setItem('token', res.data.access_token)
  localStorage.setItem('user', JSON.stringify(res.data.user))
  router.push('/')
}
</script>

<template>
  <div class="container">
    <div class="card">
      <h2>Login</h2>

      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />

      <button @click="login">
        Iniciar sesión
      </button>

      <p>
        ¿No tienes cuenta?
        <span class="link" @click="$router.push('/register')">
          Registrarse
        </span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f2f2f2;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  width: 300px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

input {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
}

button {
  width: 100%;
  padding: 10px;
  background: #35495e;
  border: none;
  color: white;
  cursor: pointer;
}

.link {
  color: #42b883;
  cursor: pointer;
}
</style>