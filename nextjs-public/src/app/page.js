import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <h2>Tu futuro comienza aquí</h2>
          <p>
            Explora nuestra oferta académica y encuentra los cursos que impulsarán tu carrera profesional.
            OfCourse te conecta con la mejor educación.
          </p>
          <Link href="/cursos" className="btn btn-primary">
            Ver Cursos Disponibles
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h3>¿Por qué OfCourse?</h3>
          <div className="feature-grid">
            <div className="feature-card">
              <h4>📚 Cursos Actualizados</h4>
              <p>Contenido diseñado por expertos y alineado con las demandas del mercado laboral.</p>
            </div>
            <div className="feature-card">
              <h4>👨‍🏫 Docentes Expertos</h4>
              <p>Aprende de profesionales con amplia experiencia en la industria y la academia.</p>
            </div>
            <div className="feature-card">
              <h4>🕒 Horarios Flexibles</h4>
              <p>Modalidades presencial y virtual para que estudies a tu ritmo.</p>
            </div>
            <div className="feature-card">
              <h4>🎓 Certificación</h4>
              <p>Obtén certificados que respaldan tu aprendizaje y mejoran tu perfil profesional.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
