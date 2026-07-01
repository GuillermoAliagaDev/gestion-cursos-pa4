import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(correo, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        
        <div className="login-header">
          <h1>OfCourse</h1>
          <p>Portal del Estudiante</p>
        </div>

        <form onSubmit={handleSubmit}>

          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group">
            <label htmlFor="correo">Correo electrónico</label>
            <input id="correo" type="email" value={correo} onChange={e => setCorreo(e.target.value)} placeholder="estudiante@isil.pe" required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="123456" required />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>

        </form>

        <div className="login-footer">
          <p><strong>Demo:</strong> estudiante@isil.pe / 123456</p>
        </div>
      </div>
    </div>
  )
}
