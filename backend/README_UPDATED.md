Rutas añadidas (stubs):
- routes/tournaments.js
- routes/athletes.js
- routes/inscriptions.js
- routes/results.js

Integración sugerida (server.js):
const tournaments = require('./routes/tournaments');
app.use('/tournaments', tournaments);