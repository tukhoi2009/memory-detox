import { useAuthStore } from '@/modules/auth/store/useAuthStore'
import axios from 'axios'
import { API_BASE_URL } from './env'

const API_CLIENT = axios.create({
  baseURL: API_BASE_URL || 'https://your-api.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

API_CLIENT.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

API_CLIENT.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Delete all Zustand state
      const signOut = useAuthStore.getState().signOut
      signOut()
      
      // Note: Không thể dùng useRouter() trong interceptor
      // Thay vào đó, component sẽ tự redirect khi detect auth state change
      console.log('🔑 Token expired, user signed out')
    }
    return Promise.reject(error)
  },
)

export default API_CLIENT
