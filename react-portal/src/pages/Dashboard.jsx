import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getInscripciones } from '../services/api'

export default function Dashboard() {
  const { usuario, logout } = useAuth()
  const [inscripciones, setInscripciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    getInscripciones()
      .then(res => setInscripciones(res.data.inscripciones))
      .catch(() => setError('Error al cargar inscripciones'))
      .finally(() => setLoading(false))
  }, [])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h2>Bienvenido, {usuario?.nombre}</h2>
          <p className="text-muted">Código: {usuario?.codigo} | {usuario?.correo}</p>
        </div>
        <button onClick={handleLogout} className="btn btn-outline">Cerrar Sesión</button>
      </div>

      <div className="dashboard-nav">
        <Link to="/dashboard" className="btn btn-primary">Mis Inscripciones</Link>
        <Link to="/cursos" className="btn btn-outline">Catálogo de Cursos</Link>
      </div>

      <h3>Mis Cursos Inscritos</h3>
      {loading && <p className="text-muted">Cargando inscripciones...</p>}
      {error && <div className="alert alert-error">{error}</div>}
      {!loading && !error && inscripciones.length === 0 && (
        <div className="empty-state">
          <p>No tienes cursos inscritos.</p>
          <Link to="/cursos" className="btn btn-primary">Ver Catálogo</Link>
        </div>
      )}
      <div className="card-grid">
        {inscripciones.map(ins => (
          <div key={ins.id} className="card">
            <h4>{ins.curso.nombre}</h4>
            <p className="text-muted">{ins.curso.docente}</p>
            <p className="text-muted">{ins.curso.horario}</p>
            <span className={`badge ${ins.curso.modalidad === 'Virtual' ? 'badge-virtual' : 'badge-presencial'}`}>
              {ins.curso.modalidad}
            </span>
            <p className="text-muted">Inscrito el: {ins.fecha}</p>
            <Link to={`/cursos/${ins.cursoId}`} className="btn btn-sm btn-outline">Ver Detalle</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
