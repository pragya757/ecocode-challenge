import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: add token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('ecocode_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: handle 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ecocode_token')
      delete api.defaults.headers.common['Authorization']
    }
    return Promise.reject(err)
  }
)

export default api
