const express = require('express');

function createResultsRouter(pool, authenticateToken) {
  const router = express.Router();

  // GET results (should be filtered, e.g., by event_id)
  router.get('/', async (req, res) => {
    const { event_id } = req.query;
    if (!event_id) {
      return res.status(400).json({ error: 'Missing required query parameter: event_id' });
    }
    
    try {
      // Query to get results with athlete and event info
      const query = `
        SELECT 
          r.id, r.time, r.position, r.recorded_at,
          i.bib, i.category,
          a.first_name, a.last_name, a.gender, a.club,
          e.name as event_name, e.distance
        FROM results r
        JOIN inscriptions i ON r.inscription_id = i.id
        JOIN athletes a ON i.athlete_id = a.id
        JOIN events e ON r.event_id = e.id
        WHERE r.event_id = ?
        ORDER BY r.position ASC, r.time ASC
      `;
      const [rows] = await pool.query(query, [event_id]);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // POST new result and return the full object
  router.post('/', authenticateToken, async (req, res) => {
    const { inscription_id, event_id, time, position } = req.body;
    if (!inscription_id || !event_id || !time) {
        return res.status(400).json({ error: 'Missing required fields: inscription_id, event_id, time' });
    }
    
    // Validate time format (HH:MM:SS or MM:SS)
    const timeRegex = /^([0-9]{1,2}):([0-5][0-9]):([0-5][0-9])$|^([0-5][0-9]):([0-5][0-9])$/;
    if (!timeRegex.test(time)) {
        return res.status(400).json({ error: 'Invalid time format. Use HH:MM:SS or MM:SS' });
    }
    
    try {
      // Verify inscription exists and belongs to the event
      const [inscriptionCheck] = await pool.query(
        'SELECT id, event_id FROM inscriptions WHERE id = ? AND event_id = ?',
        [inscription_id, event_id]
      );
      
      if (inscriptionCheck.length === 0) {
        return res.status(404).json({ error: 'Inscription not found for this event' });
      }

      // 1. Insert the new result
      const [r] = await pool.query(
        'INSERT INTO results (inscription_id, event_id, time, position, recorded_by) VALUES (?,?,?,?,?)', 
        [inscription_id, event_id, time, position || null, req.user.id]
      );
      const newResultId = r.insertId;

      // 2. Fetch the newly created result with all the joined data
      const query = `
        SELECT 
          r.id, r.time, r.position, r.recorded_at,
          i.bib, i.category,
          a.first_name, a.last_name, a.gender, a.club,
          e.name as event_name, e.distance
        FROM results r
        JOIN inscriptions i ON r.inscription_id = i.id
        JOIN athletes a ON i.athlete_id = a.id
        JOIN events e ON r.event_id = e.id
        WHERE r.id = ?
      `;
      const [rows] = await pool.query(query, [newResultId]);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Could not find the newly created result.' });
      }

      // Emitir evento de nuevo resultado por Socket.IO
      const io = req.app.get('io');
      if (io) {
        io.emit('result_updated', { event_id, result: rows[0] });
      }
      res.status(201).json(rows[0]);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // PUT update result
  router.put('/:id', authenticateToken, async (req, res) => {
    const { time, position } = req.body;
    if (!time) {
        return res.status(400).json({ error: 'Missing required field: time' });
    }
    try {
      const [result] = await pool.query('UPDATE results SET time=?, position=?, recorded_by=? WHERE id=?', [time, position || null, req.user.id, req.params.id]);
      if (result.affectedRows === 0) return res.sendStatus(404);
      // Emitir evento de actualización de resultado por Socket.IO
      const io = req.app.get('io');
      if (io) {
        // Buscar el event_id del resultado actualizado
        const [rows] = await pool.query('SELECT event_id FROM results WHERE id=?', [req.params.id]);
        if (rows.length > 0) {
          io.emit('result_updated', { event_id: rows[0].event_id, result: { id: req.params.id, time, position } });
        }
      }
      res.json({ id: req.params.id, time, position });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // DELETE result
  router.delete('/:id', authenticateToken, async (req, res) => {
    try {
      const [result] = await pool.query('DELETE FROM results WHERE id=?', [req.params.id]);
      if (result.affectedRows === 0) return res.sendStatus(404);
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });


  return router;
}

module.exports = createResultsRouter;
