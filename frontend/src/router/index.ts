import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Login.vue'
import DashboardView from '../views/Dashboard.vue'
import CustomersView from '../views/Customers.vue'
import OrdersView from '../views/Orders.vue'
import AppLayout from '../components/AppLayout.vue'
import Register from '@/views/Register.vue'


  const routes = [
  { path: '/login', component: LoginView },
  { path: '/register', component: Register },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', component: DashboardView },
      { path: 'customers', component: CustomersView },
      { path: 'orders', component: OrdersView },
    ],
  },
]


const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router

