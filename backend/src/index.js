const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET = process.env.JWT_SECRET || 'devsecret';

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'pwa_torneos',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

app.post('/auth/login', async (req,res) => {
  const { email, password } = req.body;
  try {
    const conn = await mysql.createConnection(poolConfig);
    const [rows] = await conn.execute('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    await conn.end();
    if (rows.length === 0) return res.status(401).json({ message: 'Usuario no encontrado' });
    const user = rows[0];
    if (user.password_raw !== password) return res.status(401).json({ message: 'Credenciales inválidas' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: '8h' });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role }});
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error servidor' });
  }
});

app.get('/api/athletes', async (req,res) => {
  try {
    const conn = await mysql.createConnection(poolConfig);
    const [rows] = await conn.execute('SELECT id, first_name, last_name, country FROM athletes ORDER BY created_at DESC');
    await conn.end();
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error servidor' });
  }
});

app.post('/athletes', async (req,res)=>{
  const { first_name,last_name,dob,sex,country,category,club,notes } = req.body;
  try{ const conn = await mysql.createConnection(poolConfig); const [r] = await conn.execute('INSERT INTO athletes (first_name,last_name,dob,sex,country,category,club,notes) VALUES (?,?,?,?,?,?,?,?)',[first_name,last_name,dob,sex,country,category,club,notes]); await conn.end(); res.json({id:r.insertId}); }catch(e){console.error(e);res.status(500).json({message:'Error'});}
});

const port = process.env.PORT || 4000;
app.listen(port, ()=> console.log('API running on', port));
