import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getInscripciones } from '../services/api'

export default function Dashboard() {
  const { usuario } = useAuth()
  const [inscripciones, setInscripciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    getInscripciones()
      .then(res => { if (mounted) setInscripciones(res.data.inscripciones) })
      .catch(err => { if (mounted) setError(err.response?.data?.error || err.message || 'Error al cargar inscripciones') })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  return (
    <div className="page-wrap">
      <div className="dashboard-welcome">
        <h2>Bienvenido, {usuario?.nombre}</h2>
        <p className="welcome-sub">Código: {usuario?.codigo} &middot; {usuario?.correo}</p>
      </div>

      {loading && <div className="loading-spinner">Cargando inscripciones...</div>}
      {error && <div className="alert alert-error">{error}</div>}
      {!loading && !error && inscripciones.length === 0 && (
        <div className="empty-state">
          <p>Aún no estás inscrito en ningún curso.</p>
          <Link to="/cursos" className="btn btn-primary">Explorar Catálogo</Link>
        </div>
      )}
      {!loading && !error && inscripciones.length > 0 && (
        <>
          <h3 className="section-title">Mis Cursos Inscritos</h3>
          <div className="card-grid">
            {inscripciones.map(ins => (
              <div key={ins.id} className="card">
                <h4>{ins.curso?.nombre || 'Curso no disponible'}</h4>
                {ins.curso ? (
                  <>
                    <p className="text-muted">{ins.curso.docente}</p>
                    <p className="text-muted">{ins.curso.horario}</p>
                    <span className={`badge ${ins.curso.modalidad === 'Virtual' ? 'badge-virtual' : 'badge-presencial'}`}>
                      {ins.curso.modalidad}
                    </span>
                    <div className="vacantes-bar">
                      <div className="vacantes-fill" style={{ width: `${(ins.curso.inscritos / ins.curso.vacantes) * 100}%` }} />
                    </div>
                  </>
                ) : (
                  <p className="text-muted">Curso no disponible</p>
                )}
                <p className="text-muted">Inscrito el: {ins.fecha}</p>
                <div className="card-footer">
                  <Link to={`/cursos/${ins.cursoId}`} className="btn btn-sm btn-secondary">Ver Detalle</Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
