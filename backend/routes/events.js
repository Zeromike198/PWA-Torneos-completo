const express = require('express');

function createEventsRouter(pool, authenticateToken, authorizeAdmin) {
  const router = express.Router();

  // GET all events for a specific tournament
  router.get('/', async (req, res) => {
    const { tournament_id } = req.query;
    if (!tournament_id) {
      return res.status(400).json({ error: 'Missing required query parameter: tournament_id' });
    }
    try {
      const [rows] = await pool.query('SELECT * FROM events WHERE tournament_id = ? ORDER BY name', [tournament_id]);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // GET a single event by its ID
  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
      if (rows.length === 0) return res.sendStatus(404);
      res.json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // POST a new event
  router.post('/', [authenticateToken, authorizeAdmin], async (req, res) => {
    const { tournament_id, name, distance, category } = req.body;
    if (!tournament_id || !name) {
      return res.status(400).json({ error: 'Missing required fields: tournament_id, name' });
    }
    try {
      const [r] = await pool.query('INSERT INTO events (tournament_id, name, distance, category) VALUES (?, ?, ?, ?)', [tournament_id, name, distance || null, category || null]);
      res.status(201).json({ id: r.insertId, tournament_id, name, distance, category });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // PUT to update an event
  router.put('/:id', [authenticateToken, authorizeAdmin], async (req, res) => {
    const { tournament_id, name, distance, category } = req.body;
    if (!tournament_id || !name) {
      return res.status(400).json({ error: 'Missing required fields: tournament_id, name' });
    }
    try {
      const [result] = await pool.query('UPDATE events SET tournament_id=?, name=?, distance=?, category=? WHERE id=?', [tournament_id, name, distance || null, category || null, req.params.id]);
      if (result.affectedRows === 0) return res.sendStatus(404);
      res.json({ id: req.params.id, tournament_id, name, distance, category });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // DELETE an event
  router.delete('/:id', [authenticateToken, authorizeAdmin], async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM events WHERE id=?', [req.params.id]);
      if (result.affectedRows === 0) return res.sendStatus(404);
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
}

module.exports = createEventsRouter;
