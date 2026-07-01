import { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('ofcourse_usuario')
    const token = localStorage.getItem('ofcourse_token')
    if (stored && token) {
      setUsuario(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  async function login(correo, password) {
    const res = await apiLogin(correo, password)
    const { token, usuario: user } = res.data
    localStorage.setItem('ofcourse_token', token)
    localStorage.setItem('ofcourse_usuario', JSON.stringify(user))
    setUsuario(user)
    return user
  }

  function logout() {
    localStorage.removeItem('ofcourse_token')
    localStorage.removeItem('ofcourse_usuario')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
