import Link from 'next/link'
import './globals.css'

export const metadata = {
  title: 'OfCourse - Oferta Académica',
  description: 'Explora la oferta académica de cursos disponibles en OfCourse.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <header>
          <div className="container">
            <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>
              <h1>OfCourse</h1>
            </Link>
            <nav>
              <Link href="/">Inicio</Link>
              <Link href="/cursos">Cursos</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer>
          <div className="container">
            <p>&copy; {new Date().getFullYear()} OfCourse - Todos los derechos reservados</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
