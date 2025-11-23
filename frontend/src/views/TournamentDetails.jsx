import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import EventForm from './EventForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// EventList component now differentiates between user roles
const EventList = ({ events, user, inscribedEventIds, onEdit, onDelete, onInscribe }) => (
  <ul style={listStyle}>
    {events.map(event => {
      const isInscribed = inscribedEventIds.includes(event.id);
      return (
        <li key={event.id} style={listItemStyle}>
          <span>{event.name} ({event.distance || 'N/A'}) - Cat: {event.category || 'Todas'}</span>
          <div>
            {user?.role === 'admin' ? (
              <>
                <button onClick={() => onEdit(event)} style={buttonStyle}>Editar</button>
                <button onClick={() => onDelete(event.id)} style={{...buttonStyle, background: '#c00'}}>Eliminar</button>
              </>
            ) : (
              <button 
                onClick={() => onInscribe(event.id)} 
                style={{...buttonStyle, background: isInscribed ? '#555' : '#007bff'}}
                disabled={isInscribed}
              >
                {isInscribed ? 'Inscrito' : 'Inscribirse'}
              </button>
            )}
          </div>
        </li>
      );
    })}
  </ul>
);

export default function TournamentDetails() {
  const [tournament, setTournament] = useState(null);
  const [events, setEvents] = useState([]);
  const [inscriptions, setInscriptions] = useState([]);
  const [error, setError] = useState(null);
  const { id: tournamentId } = useParams();
  
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const { user, athlete } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        const tournamentRes = await axios.get(`${API_URL}/tournaments/${tournamentId}`);
        setTournament(tournamentRes.data);
        
        const eventsRes = await axios.get(`${API_URL}/events?tournament_id=${tournamentId}`);
        setEvents(eventsRes.data);

        // If a user is logged in and has an athlete profile, fetch their inscriptions
        if (athlete) {
          const inscriptionsRes = await axios.get(`${API_URL}/inscriptions?athlete_id=${athlete.id}`);
          setInscriptions(inscriptionsRes.data);
        }
      } catch (err) {
        setError('Error al cargar los datos del torneo.');
        console.error(err);
      }
    };
    fetchData();
  }, [tournamentId, athlete]);

  const handleSaveEvent = async (eventData) => {
    setError(null);
    try {
      if (editingEvent) {
        const response = await axios.put(`${API_URL}/events/${editingEvent.id}`, eventData);
        setEvents(events.map(e => e.id === editingEvent.id ? response.data : e));
      } else {
        const response = await axios.post(`${API_URL}/events`, eventData);
        setEvents([...events, response.data]);
      }
      setShowForm(false);
      setEditingEvent(null);
    } catch (err) {
      setError('Error al guardar el evento.');
      console.error(err.response?.data?.error || err.message);
    }
  };
  
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este evento?')) return;
    setError(null);
    try {
      await axios.delete(`${API_URL}/events/${eventId}`);
      setEvents(events.filter(e => e.id !== eventId));
    } catch (err) {
      setError('Error al eliminar el evento.');
      console.error(err);
    }
  };
  
  const handleInscribe = async (eventId) => {
    if (!athlete) {
      setError('No se encontró un perfil de atleta para tu usuario. Por favor, crea uno en la página de Atletas.');
      return;
    }
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/inscriptions`, {
        athlete_id: athlete.id,
        event_id: eventId
      });
      setInscriptions([...inscriptions, response.data]);
    } catch (err) {
       setError(err.response?.data?.error || 'Error al realizar la inscripción.');
       console.error(err.response?.data?.error || err.message);
    }
  };

  const handleShowCreateForm = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
  };

  const inscribedEventIds = inscriptions.map(inv => inv.event_id);

  if (!tournament) return <div style={{ padding: '20px', color: 'white' }}>Cargando...</div>;

  return (
    <div style={detailsStyle}>
      <Link to="/" style={backLinkStyle}>&larr; Volver a Home</Link>
      <h1 style={headerStyle}>{tournament.name}</h1>
      <p style={subHeaderStyle}>{tournament.sport} - {new Date(tournament.start_date).toLocaleDateString()}</p>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      
      <div style={{marginTop: '30px'}}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{color: '#ff2e2e'}}>Eventos del Torneo</h2>
          {user?.role === 'admin' && !showForm && (
            <button onClick={handleShowCreateForm} style={{...buttonStyle, padding: '10px 15px'}}>Crear Evento</button>
          )}
        </div>

        {showForm && user?.role === 'admin' ? (
          <EventForm event={editingEvent} tournamentId={tournamentId} onSave={handleSaveEvent} onCancel={handleCancel} />
        ) : (
          events.length > 0 ? (
            <EventList 
              events={events} 
              user={user}
              inscribedEventIds={inscribedEventIds}
              onEdit={(event) => { setEditingEvent(event); setShowForm(true); }}
              onDelete={handleDeleteEvent}
              onInscribe={handleInscribe}
            />
          ) : (
            <p>No hay eventos para este torneo todavía.</p>
          )
        )}
      </div>
    </div>
  );
}

// Styles
const detailsStyle = { padding: "25px", fontFamily: "Arial", background: "#0b0b0b", color: "white", minHeight: "100vh" };
const headerStyle = { fontSize: "32px", color: "#ff2e2e", borderBottom: "2px solid #ff2e2e", paddingBottom: "10px" };
const subHeaderStyle = { fontSize: '18px', color: '#ccc', marginTop: '-5px' };
const backLinkStyle = { color: '#ff2e2e', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' };
const listStyle = { listStyleType: 'none', padding: 0 };
const listItemStyle = { background: '#1a1a1a', padding: '15px', borderRadius: '8px', marginBottom: '10px', borderLeft: '4px solid #ff2e2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const buttonStyle = { background: '#ff2e2e', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', marginRight: '5px' };
