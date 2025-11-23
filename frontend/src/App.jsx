import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './views/Home';
import Login from './views/Login';
import AdminDashboard from './views/AdminDashboard';
import TournamentDetails from './views/TournamentDetails';
import AthletesPage from './views/AthletesPage';
import LiveTiming from './views/LiveTiming';
import ResultsPage from './views/ResultsPage';
import InscriptionsPage from './views/InscriptionsPage';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className='app'>
      <header className='topbar'>
        <div className='logo'>
          <Link to='/'>Torneos PWA</Link>
        </div>
        <nav>
          <Link to='/'>Home</Link>
          <Link to='/results'>Resultados</Link>
          {isAuthenticated ? (
            <>
              <Link to='/athletes'>Atletas</Link>
              <Link to='/inscriptions'>Inscripciones</Link>
              <Link to='/timing'>Tiempos</Link>
              {user?.role === 'admin' && (
                <Link to='/dashboard'>Dashboard</Link>
              )}
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </>
          ) : (
            <Link to='/login'>Login</Link>
          )}
        </nav>
      </header>
      <main>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/results' element={<ResultsPage/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route 
            path='/dashboard' 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard/>
              </ProtectedRoute>
            }
          />
          <Route 
            path='/tournaments/:id' 
            element={
              <ProtectedRoute>
                <TournamentDetails/>
              </ProtectedRoute>
            }
          />
          <Route 
            path='/athletes' 
            element={
              <ProtectedRoute>
                <AthletesPage/>
              </ProtectedRoute>
            }
          />
          <Route 
            path='/timing' 
            element={
              <ProtectedRoute>
                <LiveTiming/>
              </ProtectedRoute>
            }
          />
          <Route 
            path='/inscriptions' 
            element={
              <ProtectedRoute>
                <InscriptionsPage/>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}