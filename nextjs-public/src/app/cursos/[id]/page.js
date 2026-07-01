import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

async function getCurso(id) {
  try {
    const res = await fetch(`${API_URL}/public/cursos/${id}`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    const data = await res.json()
    return data.curso
  } catch {
    return null
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_URL}/public/cursos`)
    if (!res.ok) return []
    const data = await res.json()
    return data.cursos.map((curso) => ({ id: String(curso.id) }))
  } catch {
    return []
  }
}

export default async function CursoDetallePage({ params }) {
  const curso = await getCurso(params.id)

  if (!curso) {
    return (
      <div className="not-found">
        <h2>404</h2>
        <p>El curso que buscas no existe o no está disponible.</p>
        <Link href="/cursos">← Volver al catálogo</Link>
      </div>
    )
  }

  return (
    <div className="detalle-page">
      <Link href="/cursos" style={{ color: '#667eea', fontWeight: 600, textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>
        ← Volver al catálogo
      </Link>
      <div className="detalle-card">
        <h2>{curso.nombre}</h2>
        <div className="detalle-grid">
          <div><strong>Docente:</strong> {curso.docente}</div>
          <div><strong>Modalidad:</strong> <span className={`badge ${curso.modalidad === 'Virtual' ? 'badge-virtual' : 'badge-presencial'}`}>{curso.modalidad}</span></div>
          <div><strong>Créditos:</strong> {curso.creditos}</div>
        </div>
        <div className="detalle-descripcion">
          <h3>Descripción</h3>
          <p>{curso.descripcion}</p>
        </div>
        <div className="cursos-cta">
          <Link href="/cursos" className="btn btn-primary">Ver más cursos</Link>
        </div>
      </div>
    </div>
  )
}
