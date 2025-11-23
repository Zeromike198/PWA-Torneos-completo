require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const { initializeDatabase } = require('./scripts/init-db');

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in the environment variables.");
  process.exit(1);
}

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline scripts for PWA
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- SOCKET.IO SETUP ---
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }
});

// Compartir instancia de io con rutas
app.set('io', io);

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pwa_torneos',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function authorizeAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.sendStatus(403); // Forbidden
  }
  next();
}

// Auth: register
app.post('/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!email || !password) return res.status(400).json({error:'email and password required'});
  try {
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length) return res.status(409).json({error:'Email already registered'});
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)', [name||null,email,hash,role||'user']);
    const userId = result.insertId;
    res.status(201).json({id:userId,email});
  } catch (err) {
    console.error(err);
    res.status(500).json({error:'server error'});
  }
});

// Auth: login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({error:'email and password required'});
  try {
    const [rows] = await pool.query('SELECT id,name,email,password_hash,role FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({error:'Invalid credentials'});
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({error:'Invalid credentials'});
    const token = jwt.sign({id:user.id,email:user.email,role:user.role}, process.env.JWT_SECRET, {expiresIn:'8h'});
    res.json({accessToken:token});
  } catch (err) {
    console.error(err);
    res.status(500).json({error:'server error'});
  }
});

// Example protected route: list users
app.get('/users', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id,name,email,role,created_at FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({error:'server error'});
  }
});

// Routes
const createTournamentsRouter = require('./routes/tournaments');
const createAthletesRouter = require('./routes/athletes');
const createInscriptionsRouter = require('./routes/inscriptions');
const createResultsRouter = require('./routes/results');
const createEventsRouter = require('./routes/events');

app.use('/tournaments', createTournamentsRouter(pool, authenticateToken, authorizeAdmin));
app.use('/athletes', createAthletesRouter(pool, authenticateToken));
app.use('/inscriptions', createInscriptionsRouter(pool, authenticateToken));
app.use('/results', createResultsRouter(pool, authenticateToken));
app.use('/events', createEventsRouter(pool, authenticateToken, authorizeAdmin));

const port = process.env.PORT || 3000;

// Iniciar servidor después de que la BD esté lista
(async () => {
  try {
    console.log('🚀 Inicializando base de datos...\n');
    const success = await initializeDatabase();
    if (!success) {
      console.error('❌ Error en la inicialización de la base de datos');
      process.exit(1);
    }
    
    // Iniciar servidor después de la inicialización
    server.listen(port, () => {
      console.log(`\n✅ Servidor corriendo con Socket.IO en puerto ${port}`);
      console.log(`📡 API disponible en http://localhost:${port}\n`);
    });
  } catch (error) {
    console.error('❌ Error fatal durante la inicialización:', error);
    process.exit(1);
  }
})();