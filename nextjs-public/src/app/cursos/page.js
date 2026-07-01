const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

async function getCursos() {
  try {
    const res = await fetch(`${API_URL}/public/cursos`, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error('Error al cargar cursos')
    const data = await res.json()
    return data.cursos
  } catch {
    return []
  }
}

export default async function CursosPage() {
  const cursos = await getCursos()

  return (
    <div className="container page-section">
      <h2>Catálogo de Cursos</h2>
      <p style={{ color: '#718096', marginBottom: '32px' }}>
        Explora nuestra oferta académica completa. Haz clic en un curso para ver más detalles.
      </p>
      {cursos.length === 0 ? (
        <div className="loading">No se pudieron cargar los cursos. Verifica que el servidor API esté corriendo.</div>
      ) : (
        <div className="card-grid">
          {cursos.map((curso) => (
            <a key={curso.id} href={`/cursos/${curso.id}`} className="card">
              <h3>{curso.nombre}</h3>
              <p>{curso.docente}</p>
              <p>{curso.creditos} créditos</p>
              <span className={`badge ${curso.modalidad === 'Virtual' ? 'badge-virtual' : 'badge-presencial'}`}>
                {curso.modalidad}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
