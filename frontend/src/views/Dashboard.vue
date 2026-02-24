<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/axios'

const orders = ref([])
const customers = ref([])

const stats = ref({
  totalOrders: 0,
  totalMXN: 0,
  totalUSD: 0,
  creadas: 0,
  pagadas: 0,
  canceladas: 0,
  totalCustomers: 0,
})

const loadData = async () => {
  const [ordersRes, customersRes] = await Promise.all([
    api.get('/orders'),
    api.get('/customers'),
  ])

  orders.value = ordersRes.data
  customers.value = customersRes.data

  calculateStats()
}

const calculateStats = () => {
  stats.value.totalOrders = orders.value.length
  stats.value.totalCustomers = customers.value.length

  orders.value.forEach(o => {

    if (o.moneda === 'MXN')
      stats.value.totalMXN += Number(o.monto)

    if (o.moneda === 'USD')
      stats.value.totalUSD += Number(o.monto)

    if (o.status === 'CREADA')
      stats.value.creadas++

    if (o.status === 'PAGADA')
      stats.value.pagadas++

    if (o.status === 'CANCELADA')
      stats.value.canceladas++
  })
}

onMounted(loadData)
</script>

<template>
  <div class="dashboard">

    <h1>Dashboard</h1>

    <h3>Bienvenido a Mini_crm</h3>

    <div class="grid">

      <div class="card">
        <h3>Órdenes Totales</h3>
        <p>{{ stats.totalOrders }}</p>
      </div>

      <div class="card">
        <h3>Clientes</h3>
        <p>{{ stats.totalCustomers }}</p>
      </div>

      <div class="card">
        <h3>Total MXN</h3>
        <p>${{ stats.totalMXN }}</p>
      </div>

      <div class="card">
        <h3>Total USD</h3>
        <p>${{ stats.totalUSD }}</p>
      </div>

      <div class="card">
        <h3>CREADAS</h3>
        <p>{{ stats.creadas }}</p>
      </div>

      <div class="card">
        <h3>PAGADAS</h3>
        <p>{{ stats.pagadas }}</p>
      </div>

      <div class="card">
        <h3>CANCELADAS</h3>
        <p>{{ stats.canceladas }}</p>
      </div>

    </div>

  </div>
</template>

<style scoped>
.dashboard {
  padding: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  text-align: center;
}

.card h3 {
  margin-bottom: 10px;
  color: #666;
}

.card p {
  font-size: 24px;
  font-weight: bold;
  color: #42b883;
}
</style>