const express = require('express');

function createInscriptionsRouter(pool, authenticateToken) {
  const router = express.Router();

  // GET inscriptions with powerful filtering and joined data
  router.get('/', async (req, res) => {
    const { event_id, athlete_id, bib } = req.query;
    
    let query = `
      SELECT 
        i.id, i.athlete_id, i.event_id, i.bib, i.category, i.created_at,
        a.first_name, a.last_name, a.gender, a.club,
        e.name as event_name, e.distance, e.tournament_id,
        t.name as tournament_name
      FROM inscriptions i
      LEFT JOIN athletes a ON i.athlete_id = a.id
      LEFT JOIN events e ON i.event_id = e.id
      LEFT JOIN tournaments t ON e.tournament_id = t.id
    `;
    const params = [];
    const conditions = [];

    if (event_id) {
      conditions.push('i.event_id = ?');
      params.push(event_id);
    }
    if (athlete_id) {
      conditions.push('i.athlete_id = ?');
      params.push(athlete_id);
    }
    if (bib) {
      conditions.push('i.bib = ?');
      params.push(bib);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY i.created_at DESC';

    try {
      const [rows] = await pool.query(query, params);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  // GET inscription by ID
  router.get('/:id', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM inscriptions WHERE id = ?', [req.params.id]);
      if (!rows.length) return res.sendStatus(404);
      res.json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // POST new inscription
  router.post('/', authenticateToken, async (req, res) => {
    const { athlete_id, event_id, bib, category } = req.body;
    if (!athlete_id || !event_id) {
      return res.status(400).json({ error: 'Missing required fields: athlete_id, event_id' });
    }
    try {
      // Check for duplicate inscription
      const [existing] = await pool.query('SELECT id FROM inscriptions WHERE athlete_id = ? AND event_id = ?', [athlete_id, event_id]);
      if (existing.length > 0) {
        return res.status(409).json({ error: 'Athlete already inscribed in this event.' });
      }

      // Si no se proporciona un dorsal, generar uno automáticamente
      let finalBib = bib;
      if (!finalBib || finalBib.trim() === '') {
        // Obtener el siguiente número disponible para este evento
        const [maxBib] = await pool.query(
          'SELECT MAX(CAST(bib AS UNSIGNED)) as max_bib FROM inscriptions WHERE event_id = ? AND bib REGEXP "^[0-9]+$"',
          [event_id]
        );
        const nextBib = (maxBib[0]?.max_bib || 0) + 1;
        finalBib = String(nextBib).padStart(4, '0'); // Formato: 0001, 0002, etc.
      }

      // Verificar que el dorsal no esté duplicado en el evento
      if (finalBib) {
        const [duplicate] = await pool.query(
          'SELECT id FROM inscriptions WHERE event_id = ? AND bib = ?',
          [event_id, finalBib]
        );
        if (duplicate.length > 0) {
          // Si está duplicado, generar uno nuevo
          const [maxBib] = await pool.query(
            'SELECT MAX(CAST(bib AS UNSIGNED)) as max_bib FROM inscriptions WHERE event_id = ? AND bib REGEXP "^[0-9]+$"',
            [event_id]
          );
          const nextBib = (maxBib[0]?.max_bib || 0) + 1;
          finalBib = String(nextBib).padStart(4, '0');
        }
      }

      const [r] = await pool.query('INSERT INTO inscriptions (athlete_id, event_id, bib, category) VALUES (?,?,?,?)', [athlete_id, event_id, finalBib, category || null]);
      res.status(201).json({ id: r.insertId, athlete_id, event_id, bib: finalBib, category });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // PUT update inscription
  router.put('/:id', authenticateToken, async (req, res) => {
    const { athlete_id, event_id, bib, category } = req.body;
     if (!athlete_id || !event_id) {
      return res.status(400).json({ error: 'Missing required fields: athlete_id, event_id' });
    }
    try {
      const [result] = await pool.query('UPDATE inscriptions SET athlete_id=?, event_id=?, bib=?, category=? WHERE id=?', [athlete_id, event_id, bib || null, category || null, req.params.id]);
      if (result.affectedRows === 0) return res.sendStatus(404);
      res.json({ id: req.params.id, athlete_id, event_id, bib, category });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // DELETE inscription
  router.delete('/:id', authenticateToken, async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM inscriptions WHERE id=?', [req.params.id]);
       if (result.affectedRows === 0) return res.sendStatus(404);
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
}

module.exports = createInscriptionsRouter;