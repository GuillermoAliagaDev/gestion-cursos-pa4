const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_super_seguro_cambiame';

app.use(cors());
app.use(express.json());

const usuarios = [
  { id: 1, correo: 'estudiante@isil.pe', password: '123456', nombre: 'Carlos López', codigo: 'E2024001' },
  { id: 2, correo: 'maria@isil.pe', password: '123456', nombre: 'María García', codigo: 'E2024002' },
];

const cursos = [
  { id: 1, nombre: 'Matemáticas Básicas', descripcion: 'Curso introductorio de matemáticas que cubre álgebra, trigonometría y geometría analítica.', docente: 'Dr. Ricardo Palma', horario: 'Lun-Mie 10:00-12:00', vacantes: 30, inscritos: 22, creditos: 4, modalidad: 'Presencial' },
  { id: 2, nombre: 'Programación Web II', descripcion: 'Desarrollo de aplicaciones web con React, Next.js y consumo de APIs REST.', docente: 'Mg. Luis Torres', horario: 'Mar-Jue 14:00-16:00', vacantes: 25, inscritos: 20, creditos: 3, modalidad: 'Presencial' },
  { id: 3, nombre: 'Base de Datos Avanzadas', descripcion: 'Modelado de datos, SQL avanzado, procedimientos almacenados y optimización de consultas.', docente: 'Ing. Ana Castillo', horario: 'Lun-Mie 16:00-18:00', vacantes: 20, inscritos: 18, creditos: 4, modalidad: 'Virtual' },
  { id: 4, nombre: 'Inglés Técnico', descripcion: 'Curso de inglés enfocado en vocabulario técnico y comunicación profesional en TI.', docente: 'Prof. John Smith', horario: 'Vie 08:00-12:00', vacantes: 35, inscritos: 28, creditos: 2, modalidad: 'Virtual' },
  { id: 5, nombre: 'Inteligencia Artificial', descripcion: 'Fundamentos de IA, machine learning, redes neuronales y aplicaciones prácticas.', docente: 'Dr. María Fernanda Ruiz', horario: 'Mar-Jue 18:00-20:00', vacantes: 20, inscritos: 20, creditos: 4, modalidad: 'Presencial' },
  { id: 6, nombre: 'Diseño UX/UI', descripcion: 'Principios de diseño de experiencia de usuario, prototipado y pruebas de usabilidad.', docente: 'Lic. Carla Mendoza', horario: 'Lun-Mie 08:00-10:00', vacantes: 28, inscritos: 15, creditos: 3, modalidad: 'Presencial' },
];

let inscripciones = [
  { id: 1, estudianteId: 1, cursoId: 1, estado: 'inscrito', fecha: '2026-03-01' },
  { id: 2, estudianteId: 1, cursoId: 2, estado: 'inscrito', fecha: '2026-03-01' },
  { id: 3, estudianteId: 2, cursoId: 3, estado: 'inscrito', fecha: '2026-03-01' },
];

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

app.post('/api/auth/login', (req, res) => {
  const { correo, password } = req.body;
  if (!correo || !password) {
    return res.status(400).json({ error: 'Correo y contraseña requeridos' });
  }
  const usuario = usuarios.find(u => u.correo === correo && u.password === password);
  if (!usuario) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  const token = jwt.sign(
    { id: usuario.id, correo: usuario.correo, nombre: usuario.nombre, codigo: usuario.codigo },
    JWT_SECRET,
    { expiresIn: '2h' }
  );
  res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, codigo: usuario.codigo } });
});

app.get('/api/cursos', authMiddleware, (req, res) => {
  res.json({ cursos });
});

app.get('/api/cursos/:id', authMiddleware, (req, res) => {
  const curso = cursos.find(c => c.id === parseInt(req.params.id));
  if (!curso) return res.status(404).json({ error: 'Curso no encontrado' });
  res.json({ curso });
});

app.get('/api/estudiante/inscripciones', authMiddleware, (req, res) => {
  const misInscripciones = inscripciones.filter(i => i.estudianteId === req.usuario.id);
  const resultado = misInscripciones.map(ins => {
    const curso = cursos.find(c => c.id === ins.cursoId);
    return { ...ins, curso };
  });
  res.json({ inscripciones: resultado });
});

app.post('/api/estudiante/inscribir', authMiddleware, (req, res) => {
  const { cursoId } = req.body;
  if (!cursoId) return res.status(400).json({ error: 'cursoId requerido' });
  const curso = cursos.find(c => c.id === cursoId);
  if (!curso) return res.status(404).json({ error: 'Curso no encontrado' });
  const yaInscrito = inscripciones.some(i => i.estudianteId === req.usuario.id && i.cursoId === cursoId);
  if (yaInscrito) return res.status(400).json({ error: 'Ya estás inscrito en este curso' });
  if (curso.inscritos >= curso.vacantes) return res.status(400).json({ error: 'Curso sin vacantes disponibles' });
  const nueva = {
    id: inscripciones.length + 1,
    estudianteId: req.usuario.id,
    cursoId,
    estado: 'inscrito',
    fecha: new Date().toISOString().split('T')[0],
  };
  inscripciones.push(nueva);
  curso.inscritos += 1;
  res.status(201).json({ inscripcion: nueva, message: 'Inscripción exitosa' });
});

app.get('/api/public/cursos', (req, res) => {
  res.json({ cursos: cursos.map(c => ({ id: c.id, nombre: c.nombre, descripcion: c.descripcion, docente: c.docente, modalidad: c.modalidad, creditos: c.creditos })) });
});

app.get('/api/public/cursos/:id', (req, res) => {
  const curso = cursos.find(c => c.id === parseInt(req.params.id));
  if (!curso) return res.status(404).json({ error: 'Curso no encontrado' });
  res.json({ curso });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`OfCourse API corriendo en http://localhost:${PORT}`);
});
