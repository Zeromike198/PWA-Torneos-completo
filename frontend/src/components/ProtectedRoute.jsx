import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div className="loading" style={{ width: '40px', height: '40px' }}></div>
        <p style={{ color: '#888' }}>Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px'
      }}>
        <h2 style={{ color: '#ff2e2e' }}>Acceso Denegado</h2>
        <p style={{ color: '#ccc' }}>No tienes permisos para acceder a esta sección.</p>
        <p style={{ color: '#888', fontSize: '0.9rem' }}>Se requiere rol de administrador.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;