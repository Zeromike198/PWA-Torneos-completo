import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Home() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await axios.get(`${API_URL}/tournaments`);
      setTournaments(response.data.slice(0, 6)); // Mostrar solo los 6 más recientes
    } catch (err) {
      setError('Error al cargar los torneos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero Section */}
      <div className="card" style={{ 
        marginBottom: '40px', 
        background: 'linear-gradient(135deg, rgba(255, 46, 46, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)',
        border: '2px solid rgba(255, 46, 46, 0.3)'
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '30px', 
          alignItems: 'center', 
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h1 style={{ 
              fontSize: 'clamp(2rem, 5vw, 3rem)', 
              marginBottom: '20px',
              background: 'linear-gradient(135deg, #ff2e2e, #ff5252)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}>
              Gestiona tus Torneos Deportivos
            </h1>
            <p style={{ 
              fontSize: '1.2rem', 
              color: '#ccc', 
              marginBottom: '30px',
              lineHeight: '1.8'
            }}>
              Sistema completo para la administración de torneos en aguas abiertas, natación, acuatlón, triatlón y atletismo. 
              Inscripciones, registro de tiempos en tiempo real y visualización de resultados.
            </p>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <Link to="/results" className="button">Ver Resultados</Link>
              <Link to="/login" className="button" style={{ background: '#007bff' }}>Iniciar Sesión</Link>
            </div>
          </div>
          <div style={{ flex: '1', minWidth: '300px', textAlign: 'center' }}>
            <img 
              src='/assets/hero1.png' 
              alt='Deportes acuáticos' 
              style={{
                width: '100%',
                maxWidth: '500px',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ 
          fontSize: '2rem', 
          color: '#ff2e2e', 
          marginBottom: '30px',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          Características Principales
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px' 
        }}>
          <div className="card">
            <h3 style={{ color: '#ff2e2e', marginBottom: '10px' }}>⚡ Tiempo Real</h3>
            <p style={{ color: '#ccc' }}>Registro y actualización de tiempos en tiempo real con Socket.IO</p>
          </div>
          <div className="card">
            <h3 style={{ color: '#ff2e2e', marginBottom: '10px' }}>📱 PWA</h3>
            <p style={{ color: '#ccc' }}>Aplicación web progresiva instalable y funcional offline</p>
          </div>
          <div className="card">
            <h3 style={{ color: '#ff2e2e', marginBottom: '10px' }}>🏆 Resultados</h3>
            <p style={{ color: '#ccc' }}>Visualización de ganadores por categoría y generales</p>
          </div>
          <div className="card">
            <h3 style={{ color: '#ff2e2e', marginBottom: '10px' }}>👥 Gestión</h3>
            <p style={{ color: '#ccc' }}>Administración completa de atletas, eventos y categorías</p>
          </div>
        </div>
      </div>

      {/* Tournaments Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
          <h2 style={{ 
            fontSize: '2rem', 
            color: '#ff2e2e',
            textTransform: 'uppercase',
            letterSpacing: '2px'
          }}>
            Torneos Recientes
          </h2>
          <Link to="/results" className="button" style={{ background: '#007bff' }}>
            Ver Todos los Resultados
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="loading" style={{ width: '40px', height: '40px', margin: '0 auto' }}></div>
            <p style={{ marginTop: '20px', color: '#888' }}>Cargando torneos...</p>
          </div>
        ) : error ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p className="error-message">{error}</p>
          </div>
        ) : tournaments.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '20px' 
          }}>
            {tournaments.map((tournament) => (
              <Link 
                key={tournament.id} 
                to={`/tournaments/${tournament.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div className="card" style={{ 
                  height: '100%',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}>
                  <h3 style={{ 
                    color: '#ff2e2e', 
                    marginBottom: '15px',
                    fontSize: '1.3rem'
                  }}>
                    {tournament.name}
                  </h3>
                  <p style={{ color: '#ccc', marginBottom: '8px' }}>
                    <strong>Deporte:</strong> {tournament.sport}
                  </p>
                  <p style={{ color: '#ccc', marginBottom: '8px' }}>
                    <strong>Fecha:</strong> {new Date(tournament.start_date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  {tournament.location && (
                    <p style={{ color: '#ccc', marginBottom: '15px' }}>
                      <strong>📍</strong> {tournament.location}
                    </p>
                  )}
                  <div style={{ 
                    marginTop: 'auto',
                    paddingTop: '15px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <span style={{ 
                      color: '#ff2e2e', 
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      fontSize: '0.9rem',
                      letterSpacing: '1px'
                    }}>
                      Ver Detalles →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#888', fontSize: '1.1rem' }}>
              No hay torneos disponibles en este momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
