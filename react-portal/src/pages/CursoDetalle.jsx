import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getCurso, inscribir } from '../services/api'

export default function CursoDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [curso, setCurso] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [inscribiendo, setInscribiendo] = useState(false)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    getCurso(id)
      .then(res => setCurso(res.data.curso))
      .catch(() => setError('Error al cargar el curso'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleInscribir() {
    setInscribiendo(true)
    setMensaje('')
    try {
      const res = await inscribir(parseInt(id))
      setMensaje(res.data.message || 'Inscripción exitosa')
      const updated = await getCurso(id)
      setCurso(updated.data.curso)
    } catch (err) {
      setMensaje(err.response?.data?.error || 'Error al inscribirse')
    } finally {
      setInscribiendo(false)
    }
  }

  if (loading) return <p className="text-muted">Cargando curso...</p>
  if (error) return <div className="alert alert-error">{error}</div>
  if (!curso) return <p className="text-muted">Curso no encontrado</p>

  const vacantesDisponibles = curso.vacantes - curso.inscritos

  return (
    <div className="detalle-curso">
      <div className="page-header">
        <Link to="/cursos" className="btn btn-outline">&larr; Volver</Link>
      </div>
      <div className="detalle-card">
        <h2>{curso.nombre}</h2>
        <div className="detalle-grid">
          <div><strong>Docente:</strong> {curso.docente}</div>
          <div><strong>Horario:</strong> {curso.horario}</div>
          <div><strong>Modalidad:</strong> <span className={`badge ${curso.modalidad === 'Virtual' ? 'badge-virtual' : 'badge-presencial'}`}>{curso.modalidad}</span></div>
          <div><strong>Créditos:</strong> {curso.creditos}</div>
          <div><strong>Vacantes:</strong> {curso.vacantes}</div>
          <div><strong>Inscritos:</strong> {curso.inscritos}</div>
          <div><strong>Disponibles:</strong> {vacantesDisponibles}</div>
        </div>
        <div className="vacantes-bar">
          <div className="vacantes-fill" style={{ width: `${(curso.inscritos / curso.vacantes) * 100}%` }} />
        </div>
        <div className="detalle-descripcion">
          <h4>Descripción</h4>
          <p>{curso.descripcion}</p>
        </div>
        {mensaje && <div className={`alert ${mensaje.includes('exitosa') ? 'alert-success' : 'alert-error'}`}>{mensaje}</div>}
        {vacantesDisponibles > 0 ? (
          <button onClick={handleInscribir} className="btn btn-primary btn-full" disabled={inscribiendo}>
            {inscribiendo ? 'Inscribiendo...' : 'Inscribirme'}
          </button>
        ) : (
          <p className="alert alert-error">Curso sin vacantes disponibles</p>
        )}
      </div>
    </div>
  )
}
