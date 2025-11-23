import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TournamentForm from './TournamentForm';
import EventForm from './EventForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const TournamentList = ({ tournaments, onEdit, onDelete, onShowCreateForm, onManageEvents }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
      <h2>Torneos Existentes</h2>
      <button className="button" onClick={onShowCreateForm}>+ Nuevo Torneo</button>
    </div>
    <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
      {tournaments.map((t) => (
        <div key={t.id} className="card" style={{ position: 'relative' }}>
          <Link to={`/tournaments/${t.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3 style={{ color: '#ff2e2e', marginBottom: '10px' }}>{t.name}</h3>
            <p style={{ color: '#ccc', marginBottom: '5px' }}><strong>Deporte:</strong> {t.sport}</p>
            <p style={{ color: '#ccc', marginBottom: '5px' }}><strong>Fecha:</strong> {new Date(t.start_date).toLocaleDateString()}</p>
            {t.end_date && <p style={{ color: '#ccc', marginBottom: '5px' }}><strong>Hasta:</strong> {new Date(t.end_date).toLocaleDateString()}</p>}
            {t.location && <p style={{ color: '#ccc', marginBottom: '15px' }}><strong>Ubicación:</strong> {t.location}</p>}
          </Link>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="button" onClick={() => onEdit(t)} style={{ padding: '8px 12px', fontSize: '0.9rem' }}>Editar</button>
            <button className="button" onClick={() => onManageEvents(t)} style={{ padding: '8px 12px', fontSize: '0.9rem', background: '#007bff' }}>Eventos</button>
            <button className="button" onClick={() => onDelete(t.id)} style={{ padding: '8px 12px', fontSize: '0.9rem', background: '#c00' }}>Eliminar</button>
          </div>
        </div>
      ))}
    </div>
    {tournaments.length === 0 && (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#888', fontSize: '1.1rem' }}>No hay torneos registrados. Crea uno nuevo para comenzar.</p>
      </div>
    )}
  </div>
);

const EventsManager = ({ tournament, events, onBack, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [error, setError] = useState(null);

  const handleSave = async (eventData) => {
    setError(null);
    try {
      if (editingEvent) {
        await axios.put(`${API_URL}/events/${editingEvent.id}`, eventData);
      } else {
        await axios.post(`${API_URL}/events`, eventData);
      }
      setShowForm(false);
      setEditingEvent(null);
      onRefresh();
    } catch (err) {
      setError('Error al guardar el evento.');
      console.error(err.response?.data?.error || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este evento?')) return;
    setError(null);
    try {
      await axios.delete(`${API_URL}/events/${id}`);
      onRefresh();
    } catch (err) {
      setError('Error al eliminar el evento.');
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <button className="button" onClick={onBack} style={{ padding: '8px 12px', fontSize: '0.9rem', background: '#555', marginBottom: '10px' }}>
            ← Volver a Torneos
          </button>
          <h2 style={{ color: '#ff2e2e' }}>Eventos de: {tournament.name}</h2>
        </div>
        {!showForm && (
          <button className="button" onClick={() => { setEditingEvent(null); setShowForm(true); }}>
            + Nuevo Evento
          </button>
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
      
      {showForm ? (
        <EventForm 
          event={editingEvent} 
          tournamentId={tournament.id} 
          onSave={handleSave} 
          onCancel={() => { setShowForm(false); setEditingEvent(null); }} 
        />
      ) : (
        <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {events.map((e) => (
            <div key={e.id} className="card">
              <h3 style={{ color: '#ff2e2e', marginBottom: '10px' }}>{e.name}</h3>
              {e.distance && <p style={{ color: '#ccc', marginBottom: '5px' }}><strong>Distancia:</strong> {e.distance}</p>}
              {e.category && <p style={{ color: '#ccc', marginBottom: '15px' }}><strong>Categoría:</strong> {e.category}</p>}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button className="button" onClick={() => { setEditingEvent(e); setShowForm(true); }} style={{ padding: '8px 12px', fontSize: '0.9rem' }}>
                  Editar
                </button>
                <button className="button" onClick={() => handleDelete(e.id)} style={{ padding: '8px 12px', fontSize: '0.9rem', background: '#c00' }}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '40px', gridColumn: '1 / -1' }}>
              <p style={{ color: '#888', fontSize: '1.1rem' }}>No hay eventos para este torneo. Crea uno nuevo.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function AdminDashboard() {
  const [tournaments, setTournaments] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [error, setError] = useState(null);
  const [editingTournament, setEditingTournament] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    if (selectedTournament) {
      fetchEvents(selectedTournament.id);
    }
  }, [selectedTournament]);

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/tournaments`);
      setTournaments(response.data);
    } catch (err) {
      setError('No se pudieron cargar los torneos. ¿Está el servidor backend en funcionamiento?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async (tournamentId) => {
    try {
      const response = await axios.get(`${API_URL}/events?tournament_id=${tournamentId}`);
      setEvents(response.data);
    } catch (err) {
      setError('Error al cargar eventos.');
      console.error(err);
    }
  };

  const handleSave = async (tournamentData) => {
    setError(null);
    try {
      if (editingTournament) {
        const response = await axios.put(`${API_URL}/tournaments/${editingTournament.id}`, tournamentData);
        setTournaments(tournaments.map(t => t.id === editingTournament.id ? response.data : t));
      } else {
        const response = await axios.post(`${API_URL}/tournaments`, tournamentData);
        setTournaments([...tournaments, response.data]);
      }
      setShowForm(false);
      setEditingTournament(null);
    } catch (err) {
      setError('Error al guardar el torneo.');
      console.error(err.response?.data?.error || err.message);
    }
  };

  const handleEdit = (tournament) => {
    setEditingTournament(tournament);
    setShowForm(true);
    setSelectedTournament(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este torneo? Esto eliminará todos los eventos asociados.')) {
      setError(null);
      try {
        await axios.delete(`${API_URL}/tournaments/${id}`);
        setTournaments(tournaments.filter(t => t.id !== id));
        if (selectedTournament?.id === id) {
          setSelectedTournament(null);
        }
      } catch (err) {
        setError('Error al eliminar el torneo.');
        console.error(err);
      }
    }
  };

  const handleShowCreateForm = () => {
    setEditingTournament(null);
    setShowForm(true);
    setSelectedTournament(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTournament(null);
  };

  const handleManageEvents = (tournament) => {
    setSelectedTournament(tournament);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div className="loading" style={{ width: '40px', height: '40px', margin: '0 auto' }}></div>
        <p style={{ marginTop: '20px', color: '#888' }}>Cargando...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "25px", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "25px", color: "#ff2e2e", fontWeight: "bold", textTransform: "uppercase" }}>
        Panel de Administración
      </h1>
      {error && <p className="error-message">{error}</p>}
      
      {selectedTournament ? (
        <EventsManager 
          tournament={selectedTournament} 
          events={events} 
          onBack={() => setSelectedTournament(null)} 
          onRefresh={() => fetchEvents(selectedTournament.id)}
        />
      ) : showForm ? (
        <TournamentForm tournament={editingTournament} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <TournamentList 
          tournaments={tournaments} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onShowCreateForm={handleShowCreateForm}
          onManageEvents={handleManageEvents}
        />
      )}
    </div>
  );
}
