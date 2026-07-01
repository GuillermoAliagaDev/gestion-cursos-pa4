import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ofcourse_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ofcourse_token')
      localStorage.removeItem('ofcourse_usuario')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export function login(correo, password) {
  return api.post('/auth/login', { correo, password })
}

export function getCursos() {
  return api.get('/cursos')
}

export function getCurso(id) {
  return api.get(`/cursos/${id}`)
}

export function getInscripciones() {
  return api.get('/estudiante/inscripciones')
}

export function inscribir(cursoId) {
  return api.post('/estudiante/inscribir', { cursoId })
}

export default api
