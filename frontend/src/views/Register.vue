<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'

const router = useRouter()

const form = ref({
  nombre: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = ref({})

const validate = () => {
  const e = {}

  if (!form.value.nombre.trim())
    e.nombre = 'Nombre requerido'

  if (!form.value.email.trim())
    e.email = 'Email requerido'
  else if (!/^\S+@\S+\.\S+$/.test(form.value.email))
    e.email = 'Email inválido'

  if (!form.value.password)
    e.password = 'Contraseña requerida'
  else if (form.value.password.length < 6)
    e.password = 'Mínimo 6 caracteres'

  if (form.value.confirmPassword !== form.value.password)
    e.confirmPassword = 'Las contraseñas no coinciden'

  errors.value = e
  return Object.keys(e).length === 0
}

const isValid = computed(() => validate())

const register = async () => {
  if (!validate()) return

  try {
    await api.post('/auth/register', {
      nombre: form.value.nombre,
      email: form.value.email,
      password: form.value.password,
    })

    alert('Usuario creado correctamente')
    router.push('/login')

  } catch (err) {
    alert('Error al registrar')
  }
}
</script>

<template>
  <div class="container">
    <form class="card" @submit.prevent="register">

      <h2>Registro</h2>

      <input v-model="form.nombre" placeholder="Nombre" />
      <small v-if="errors.nombre" class="error">{{ errors.nombre }}</small>

      <input v-model="form.email" placeholder="Email" />
      <small v-if="errors.email" class="error">{{ errors.email }}</small>

      <input v-model="form.password" type="password" placeholder="Contraseña" />
      <small v-if="errors.password" class="error">{{ errors.password }}</small>

      <input v-model="form.confirmPassword" type="password" placeholder="Confirmar contraseña" />
      <small v-if="errors.confirmPassword" class="error">{{ errors.confirmPassword }}</small>

      <button type="submit" :disabled="!isValid">
        Registrarse
      </button>

      <p>
        ¿Ya tienes cuenta?
        <span class="link" @click="$router.push('/login')">
          Iniciar sesión
        </span>
      </p>

    </form>
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
  width: 340px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

input {
  width: 100%;
  margin-bottom: 5px;
  padding: 10px;
}

button {
  width: 100%;
  padding: 10px;
  background: #42b883;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 10px;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error {
  color: red;
  font-size: 12px;
  margin-bottom: 8px;
  display: block;
}

.link {
  color: #42b883;
  cursor: pointer;
  margin-left: 5px;
}
</style>