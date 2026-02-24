import { defineStore } from 'pinia'
import api from '../api/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),

  actions: {
    async login(email, password) {
      const res = await api.post('/auth/login', {
        email,
        password,
      })

      this.token = res.data.access_token
      localStorage.setItem('token', this.token)

      await this.getMe()
    },

    async getMe() {
      const res = await api.get('/auth/me')
      this.user = res.data
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    },
  },
})