const express = require('express');

function createAthletesRouter(pool, authenticateToken) {
  const router = express.Router();

  // GET all athletes
  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM athletes ORDER BY last_name, first_name');
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // GET athlete by ID
  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM athletes WHERE id = ?', [req.params.id]);
      if (!rows.length) return res.sendStatus(404);
      res.json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // POST new athlete
  router.post('/', authenticateToken, async (req, res) => {
    const { user_id, first_name, last_name, birthdate, gender, club } = req.body;
    if (!first_name || !last_name || !birthdate || !gender) {
      return res.status(400).json({ error: 'Missing required fields: first_name, last_name, birthdate, gender' });
    }
    try {
      const [r] = await pool.query('INSERT INTO athletes (user_id, first_name, last_name, birthdate, gender, club) VALUES (?,?,?,?,?,?)', [user_id || null, first_name, last_name, birthdate, gender, club || null]);
      res.status(201).json({ id: r.insertId, user_id, first_name, last_name, birthdate, gender, club });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // PUT update athlete
  router.put('/:id', authenticateToken, async (req, res) => {
    const { user_id, first_name, last_name, birthdate, gender, club } = req.body;
    if (!first_name || !last_name || !birthdate || !gender) {
      return res.status(400).json({ error: 'Missing required fields: first_name, last_name, birthdate, gender' });
    }
    try {
      const [result] = await pool.query('UPDATE athletes SET user_id=?, first_name=?, last_name=?, birthdate=?, gender=?, club=? WHERE id=?', [user_id || null, first_name, last_name, birthdate, gender, club || null, req.params.id]);
      if (result.affectedRows === 0) return res.sendStatus(404);
      res.json({ id: req.params.id, user_id, first_name, last_name, birthdate, gender, club });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // DELETE athlete
  router.delete('/:id', authenticateToken, async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM athletes WHERE id=?', [req.params.id]);
      if (result.affectedRows === 0) return res.sendStatus(404);
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });


  return router;
}

module.exports = createAthletesRouter;
