import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCursos } from '../services/api'

export default function Cursos() {
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getCursos()
      .then(res => setCursos(res.data.cursos))
      .catch(() => setError('Error al cargar cursos'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-muted">Cargando cursos...</p>
  if (error) return <div className="alert alert-error">{error}</div>

  return (
    <div>
      <div className="page-header">
        <h2>Catálogo de Cursos</h2>
        <Link to="/dashboard" className="btn btn-outline">Volver</Link>
      </div>
      <div className="card-grid">
        {cursos.map(curso => (
          <div key={curso.id} className="card">
            <h4>{curso.nombre}</h4>
            <p className="text-muted">{curso.docente}</p>
            <p className="text-muted">{curso.horario}</p>
            <span className={`badge ${curso.modalidad === 'Virtual' ? 'badge-virtual' : 'badge-presencial'}`}>
              {curso.modalidad}
            </span>
            <p className="text-muted">{curso.creditos} créditos</p>
            <div className="vacantes-bar">
              <div className="vacantes-fill" style={{ width: `${(curso.inscritos / curso.vacantes) * 100}%` }} />
            </div>
            <p className="text-muted">{curso.inscritos}/{curso.vacantes} inscritos</p>
            <Link to={`/cursos/${curso.id}`} className="btn btn-sm btn-primary">Ver Detalle</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
