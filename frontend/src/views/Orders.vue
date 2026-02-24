<script setup>
  import { ref, onMounted } from 'vue'
  import api from '../api/axios'
  import { useRoute } from 'vue-router'

  const orders = ref([])
  const customers = ref([])
  const editingId = ref(null)

  const showCreate = ref(false)

  const newOrder = ref({
    customerId: '',
    monto: '',
    moneda: 'MXN',
    notasInternas: ''
  })

  const route = useRoute()

  let user = {}

  try {
    user = JSON.parse(localStorage.getItem('user') || '{}')
  } catch (e) {
    user = {}
  }

  const isAdmin = user?.role === 'ADMIN'

  const loadOrders = async () => {
    const res = await api.get('/orders')
    const customerId = route.query.customerId

    if (customerId) {
      orders.value = res.data.filter(
        o => String(o.customerId) === String(customerId)
      )

      // preseleccionar cliente si viene de customers
      newOrder.value.customerId = customerId

    } else {
      orders.value = res.data
    }
  }

  const loadCustomers = async () => {
    const res = await api.get('/customers')
    customers.value = res.data
  }

  const createOrder = async () => {

    if (!newOrder.value.customerId || !newOrder.value.monto) {
      alert('Complete los campos')
      return
    }

    await api.post(`/customers/${newOrder.value.customerId}/orders`, {
      monto: Number(newOrder.value.monto),
      moneda: newOrder.value.moneda,
      notasInternas: newOrder.value.notasInternas,
    })

    newOrder.value.monto = ''
    showCreate.value = false

    loadOrders()
  }

  const getCustomerName = (id) => {
    const c = customers.value.find(c => c.id === id)
    return c ? c.nombre : id
  }

  const startEdit = (order) => {
    if (order.status === 'CANCELADA') return
    editingId.value = order.id
  }

  const saveStatus = async (order) => {

    if (order.status === 'CANCELADA' && !isAdmin) {
      alert('Solo admin puede cancelar')
      return
    }

    await api.patch(`/orders/${order.id}/status`, {
      status: order.status
    })

    editingId.value = null
    loadOrders()
  }

  const canEdit = (order) => {
    if (order.status === 'CANCELADA') return false
    return true
  }

  onMounted(() => {
    loadOrders()
    loadCustomers()
  })
</script>

<template>
  <div class="page">

    <h1>Órdenes</h1>

    <!-- BOTÓN NUEVA ORDEN -->
    <div style="margin-bottom:20px">
      <button @click="showCreate = !showCreate">
        Nueva Orden
      </button>
    </div>

    <!-- FORMULARIO CREAR -->
    <div v-if="showCreate" class="card form-card" style="margin-bottom:20px">

  <h3>Crear Orden</h3>

  <div class="form-grid">

    <!-- CLIENTE -->
    <div class="field">
      <label>Cliente</label>
      <select v-model="newOrder.customerId">
        <option disabled value="">Seleccione cliente</option>

        <option
          v-for="c in customers"
          :key="c.id"
          :value="c.id"
        >
          {{ c.nombre }}
        </option>
      </select>
    </div>

    <!-- MONTO -->
    <div class="field">
      <label>Monto</label>
      <input
        v-model="newOrder.monto"
        type="number"
        placeholder="Ingrese monto"
      />
    </div>

    <!-- MONEDA -->
    <div class="field">
      <label>Moneda</label>
      <select v-model="newOrder.moneda">
        <option value="MXN">MXN</option>
        <option value="USD">USD</option>
      </select>
    </div>

    <!-- NOTAS -->
    <div class="field full">
      <label>Notas internas</label>
      <textarea
        v-model="newOrder.notas"
        placeholder="Agregar comentarios o detalles..."
        rows="3"
      ></textarea>
    </div>

  </div>

  <button @click="createOrder">
    Guardar Orden
  </button>

</div>

    <!-- TABLA -->
    <div class="card">

      <table>
        <thead>
          <tr>
            <th>Folio</th>
            <th>Cliente</th>
            <th>Monto</th>
            <th>Moneda</th>
            <th>Estatus</th>
            <th>Notas</th>
            <th>Modifica</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="o in orders" :key="o.id">

            <td>{{ o.folio }}</td>
            <td>{{ getCustomerName(o.customerId) }}</td>
            <td>${{ o.monto }}</td>
            <td>{{ o.notasInternas }}</td>
            <td>{{ o.moneda }}</td>

            <!-- STATUS -->
            <td>

              <span v-if="editingId !== o.id">
                {{ o.status }}
              </span>

              <select
                v-else
                v-model="o.status"
              >
                <option value="CREADA">CREADA</option>
                <option value="PAGADA">PAGADA</option>

                <option v-if="isAdmin" value="CANCELADA">
                  CANCELADA
                </option>

              </select>

            </td>

            <!-- MODIFY -->
            <td>

              <button
                v-if="editingId !== o.id"
                :disabled="!canEdit(o)"
                @click="startEdit(o)"
              >
                Editar
              </button>

              <button
                v-else
                @click="saveStatus(o)"
              >
                Guardar
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
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f5f5f5;
  padding: 10px;
  text-align: left;
}

td {
  padding: 10px;
  border-top: 1px solid #eee;
}

button {
  padding: 6px 10px;
  background: #42b883;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

select {
  padding: 5px;
}
</style>