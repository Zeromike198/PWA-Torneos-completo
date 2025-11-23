Tutorial de instalación — PWA Torneos

1) Clonar repositorio
git clone https://github.com/usuario/pwa_torneos.git

2) Backend
cd backend
cp .env.example .env  # editar variables
npm install
# crear BD
mysql -u root -p < scripts/pwa_torneos_schema.sql
npm run dev

3) Frontend
cd frontend
npm install
# editar .env para VITE_API_URL
npm run dev

PWA: verificar public/manifest.json y public/sw.js (opcional en dev).