import { useEffect, useState } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { getCurso, inscribir, desinscribir } from '../services/api'

export default function CursoDetalle() {
  // Obtención de parámetros de la URL para enrutamiento dinámico
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const from = searchParams.get('from')

  // Estados para el manejo de la data y la UI
  const [curso, setCurso] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [procesando, setProcesando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  /**
   * Efecto para cargar los datos del curso al montar el componente.
   * Implementa el patrón 'cleanup function' con la variable 'mounted' 
   * para evitar actualizaciones de estado en componentes desmontados (memory leaks).
   */
  useEffect(() => {
    let mounted = true
    getCurso(id)
      .then(res => { if (mounted) setCurso(res.data.curso) })
      .catch(err => { if (mounted) setError(err.response?.data?.error || 'Error al cargar el curso') })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [id])

  /**
   * Ejecuta la petición a la API para inscribir al usuario actual en el curso.
   * Tras una respuesta exitosa, actualiza el estado local del curso.
   */
  async function handleInscribir() {
    setProcesando(true)
    setMensaje('')
    try {

      const res = await inscribir(parseInt(id))
      setMensaje(res.data.message || 'Inscripción exitosa')
      const updated = await getCurso(id)
      setCurso(updated.data.curso)
    } catch (err) {
      setMensaje(err.response?.data?.error || 'Error al inscribirse')
    } finally {
      setProcesando(false)
    }
  }

  /**
   * Ejecuta la petición a la API para retirar al usuario del curso.
   * Tras una respuesta exitosa, actualiza el estado local del curso.
   */
  async function handleDesinscribir() {
    setProcesando(true)
    setMensaje('')
    try {
      const res = await desinscribir(parseInt(id))
      setMensaje(res.data.message || 'Te has retirado del curso')
      const updated = await getCurso(id)
      setCurso(updated.data.curso)
    } catch (err) {
      setMensaje(err.response?.data?.error || 'Error al retirarse')
    } finally {
      setProcesando(false)
    }
  }

  // Renderizado condicional basado en el estado de la petición inicial
  if (loading) return <div className="page-wrap"><div className="loading-spinner">Cargando curso...</div></div>
  if (error) return <div className="page-wrap"><div className="alert alert-error">{error}</div></div>
  if (!curso) return <div className="page-wrap"><p className="text-muted">Curso no encontrado</p></div>

  // Cálculo derivado para la UI
  const vacantesDisponibles = curso.vacantes - curso.inscritos

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h2>Detalle del Curso</h2>
        <div className="page-actions">
          {from === 'dashboard' ? (
            <Link to="/dashboard" className="btn btn-secondary">&larr; Volver a Mis Cursos</Link>
          ) : (
            <Link to="/cursos" className="btn btn-secondary">&larr; Volver al Catálogo</Link>
          )}
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

          {mensaje && <div className={`alert ${mensaje.includes('exitosamente') || mensaje.includes('retirado') ? 'alert-success' : mensaje.includes('exitosa') ? 'alert-success' : 'alert-error'}`}>{mensaje}</div>}
          {curso.estaInscrito ? (
            <button onClick={handleDesinscribir} className="btn btn-danger btn-full" disabled={procesando}>
              {procesando ? 'Procesando...' : 'Retirarme de este curso'}
            </button>

          ) : vacantesDisponibles > 0 ? (
            <button onClick={handleInscribir} className="btn btn-primary btn-full" disabled={procesando}>
              {procesando ? 'Inscribiendo...' : 'Inscribirme a este curso'}
            </button>
          ) : (
            <div className="alert alert-error">Curso sin vacantes disponibles</div>
          )}
        </div>
      </div>
    </div>
  )
}
