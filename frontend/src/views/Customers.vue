<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/axios'
import { useRouter } from 'vue-router'

const customers = ref([])
const router = useRouter()

const form = ref({
  nombre: '',
  email: '',
  telefono: '',
  direccion: '',
  documentoFiscal: '',
})

const load = async () => {
  const res = await api.get('/customers')
  customers.value = res.data
}

const createCustomer = async () => {
  await api.post('/customers', form.value)

  form.value = {
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    documentoFiscal: '',
  }

  load()
}

const goOrders = (id) => {
  router.push(`/orders?customerId=${id}`)
}

onMounted(load)
</script>

<template>
  <div class="page">

    <h1>Clientes</h1>

    <!-- FORM -->
    <div class="card form-card">
      <h3>Crear Cliente</h3>

      <div class="grid">
        <input v-model="form.nombre" placeholder="Nombre" />
        <input v-model="form.email" placeholder="Email" />
        <input v-model="form.telefono" placeholder="Teléfono" />
        <input v-model="form.direccion" placeholder="Dirección" />
        <input v-model="form.documentoFiscal" placeholder="RFC" />
      </div>

      <button @click="createCustomer">
        Crear Cliente
      </button>
    </div>

    <!-- TABLE -->
    <div class="card">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>RFC</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="c in customers" :key="c.id">
            <td>{{ c.nombre }}</td>
            <td>{{ c.email }}</td>
            <td>{{ c.telefono }}</td>
            <td>{{ c.direccion }}</td>
            <td>{{ c.documentoFiscal }}</td>

            <td>
              <button @click="goOrders(c.id)">
                Ver órdenes
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<style scoped>
.page {
  padding: 20px;
}

.card {
  background: white;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.form-card button {
  margin-top: 10px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

input {
  padding: 8px;
  width: 100%;
}

button {
  padding: 8px 12px;
  background: #42b883;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f5f5f5;
  text-align: left;
  padding: 10px;
}

td {
  padding: 10px;
  border-top: 1px solid #eee;
}
</style>