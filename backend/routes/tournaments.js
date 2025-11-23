const express = require('express');

function createTournamentsRouter(pool, authenticateToken, authorizeAdmin) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM tournaments ORDER BY start_date DESC');
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  });

  router.post('/', [authenticateToken, authorizeAdmin], async (req, res) => {
    const { name, sport, start_date, end_date, location } = req.body;
    // Basic validation
    if (!name || !sport || !start_date) {
      return res.status(400).json({ error: 'Missing required fields: name, sport, start_date' });
    }
    try {
      const [r] = await pool.query('INSERT INTO tournaments (name,sport,start_date,end_date,location) VALUES (?,?,?,?,?)', [name, sport, start_date, end_date, location]);
      res.status(201).json({ id: r.insertId, name, sport, start_date, end_date, location });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM tournaments WHERE id = ?', [req.params.id]);
      if (!rows.length) return res.sendStatus(404);
      res.json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  });

  router.put('/:id', [authenticateToken, authorizeAdmin], async (req, res) => {
    const { name, sport, start_date, end_date, location } = req.body;
    if (!name || !sport || !start_date) {
      return res.status(400).json({ error: 'Missing required fields: name, sport, start_date' });
    }
    try {
      const [result] = await pool.query('UPDATE tournaments SET name=?,sport=?,start_date=?,end_date=?,location=? WHERE id=?', [name, sport, start_date, end_date, location, req.params.id]);
      if (result.affectedRows === 0) return res.sendStatus(404);
      res.json({ id: req.params.id, name, sport, start_date, end_date, location });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  });

  router.delete('/:id', [authenticateToken, authorizeAdmin], async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM tournaments WHERE id=?', [req.params.id]);
      if (result.affectedRows === 0) return res.sendStatus(404);
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  });

  return router;
}

module.exports = createTournamentsRouter;