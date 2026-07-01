import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCurso, inscribir } from '../services/api'

export default function CursoDetalle() {
  const { id } = useParams()
  const [curso, setCurso] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [inscribiendo, setInscribiendo] = useState(false)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    let mounted = true
    getCurso(id)
      .then(res => { if (mounted) setCurso(res.data.curso) })
      .catch(err => { if (mounted) setError(err.response?.data?.error || 'Error al cargar el curso') })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
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

  if (loading) return <div className="page-wrap"><div className="loading-spinner">Cargando curso...</div></div>
  if (error) return <div className="page-wrap"><div className="alert alert-error">{error}</div></div>
  if (!curso) return <div className="page-wrap"><p className="text-muted">Curso no encontrado</p></div>

  const vacantesDisponibles = curso.vacantes - curso.inscritos

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h2>Detalle del Curso</h2>
        <div className="page-actions">
          <Link to="/cursos" className="btn btn-secondary">&larr; Volver al Catálogo</Link>
        </div>
      </div>
      <div className="detalle-curso">
        <div className="detalle-card">
          <h2>{curso.nombre}</h2>
          <div className="detalle-grid">
            <div><strong>Docente</strong> {curso.docente}</div>
            <div><strong>Horario</strong> {curso.horario}</div>
            <div><strong>Modalidad</strong> <span className={`badge ${curso.modalidad === 'Virtual' ? 'badge-virtual' : 'badge-presencial'}`}>{curso.modalidad}</span></div>
            <div><strong>Créditos</strong> {curso.creditos}</div>
            <div><strong>Vacantes</strong> {curso.vacantes}</div>
            <div><strong>Inscritos</strong> {curso.inscritos}</div>
            <div><strong>Disponibles</strong> {vacantesDisponibles}</div>
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
              {inscribiendo ? 'Inscribiendo...' : 'Inscribirme a este curso'}
            </button>
          ) : (
            <div className="alert alert-error">Curso sin vacantes disponibles</div>
          )}
        </div>
      </div>
    </div>
  )
}
