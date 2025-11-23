import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Componente para editar dorsal en línea
const InscriptionRow = ({ inscription, athlete, index, onUpdateBib, onDelete }) => {
    const [editingBib, setEditingBib] = useState(inscription.bib || '');
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        onUpdateBib(inscription.id, editingBib);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditingBib(inscription.bib || '');
        setIsEditing(false);
    };

    return (
        <tr style={{ background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent' }}>
            <td style={{ padding: "12px" }}>
                {isEditing ? (
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <input
                            type="text"
                            value={editingBib}
                            onChange={(e) => setEditingBib(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') handleSave();
                                if (e.key === 'Escape') handleCancel();
                            }}
                            style={{ 
                                width: '80px', 
                                padding: '5px', 
                                borderRadius: '4px', 
                                border: '1px solid #444', 
                                background: '#222', 
                                color: 'white' 
                            }}
                            autoFocus
                        />
                        <button
                            className="button"
                            onClick={handleSave}
                            style={{ padding: '5px 10px', fontSize: '0.85rem' }}
                        >
                            ✓
                        </button>
                        <button
                            className="button"
                            onClick={handleCancel}
                            style={{ padding: '5px 10px', fontSize: '0.85rem', background: '#6c757d' }}
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', fontFamily: 'monospace', minWidth: '60px' }}>
                            {inscription.bib || 'Sin dorsal'}
                        </span>
                        <button
                            className="button"
                            onClick={() => setIsEditing(true)}
                            style={{ padding: '3px 8px', fontSize: '0.75rem', background: '#007bff' }}
                        >
                            ✏️
                        </button>
                    </div>
                )}
            </td>
            <td style={{ padding: "12px" }}>
                {athlete ? `${athlete.first_name} ${athlete.last_name}` : 'N/A'}
            </td>
            <td style={{ padding: "12px", color: '#888' }}>
                {athlete?.club || 'N/A'}
            </td>
            <td style={{ padding: "12px" }}>
                {inscription.category || 'General'}
            </td>
            <td style={{ padding: "12px" }}>
                <button
                    className="button"
                    onClick={() => onDelete(inscription.id)}
                    style={{ padding: '5px 10px', fontSize: '0.85rem', background: '#c00' }}
                >
                    Eliminar
                </button>
            </td>
        </tr>
    );
};

export default function InscriptionsPage() {
    const [tournaments, setTournaments] = useState([]);
    const [events, setEvents] = useState([]);
    const [athletes, setAthletes] = useState([]);
    const [inscriptions, setInscriptions] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState('');
    const [selectedEvent, setSelectedEvent] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchTournaments();
        fetchAthletes();
    }, []);

    useEffect(() => {
        if (selectedTournament) {
            fetchEvents(selectedTournament);
            setSelectedEvent('');
            setInscriptions([]);
        }
    }, [selectedTournament]);

    useEffect(() => {
        if (selectedEvent) {
            fetchInscriptions(selectedEvent);
        }
    }, [selectedEvent]);

    const fetchTournaments = async () => {
        try {
            const response = await axios.get(`${API_URL}/tournaments`);
            setTournaments(response.data);
        } catch (err) {
            setError('Error al cargar torneos.');
        }
    };

    const fetchEvents = async (tournamentId) => {
        try {
            const response = await axios.get(`${API_URL}/events?tournament_id=${tournamentId}`);
            setEvents(response.data);
        } catch (err) {
            setError('Error al cargar eventos.');
        }
    };

    const fetchAthletes = async () => {
        try {
            const response = await axios.get(`${API_URL}/athletes`);
            setAthletes(response.data);
        } catch (err) {
            setError('Error al cargar atletas.');
        }
    };

    const fetchInscriptions = async (eventId) => {
        try {
            const response = await axios.get(`${API_URL}/inscriptions?event_id=${eventId}`);
            setInscriptions(response.data);
        } catch (err) {
            setError('Error al cargar inscripciones.');
        }
    };

    const handleInscribe = async (athleteId) => {
        if (!selectedEvent) {
            setError('Por favor, selecciona un evento primero.');
            return;
        }

        setError(null);
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/inscriptions`, {
                athlete_id: athleteId,
                event_id: selectedEvent
            });
            setMessage(`✅ Atleta inscrito con dorsal ${response.data.bib}`);
            fetchInscriptions(selectedEvent);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al inscribir atleta.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBib = async (inscriptionId, newBib) => {
        if (!newBib || newBib.trim() === '') {
            setError('El dorsal no puede estar vacío.');
            return;
        }

        setError(null);
        try {
            const inscription = inscriptions.find(i => i.id === inscriptionId);
            await axios.put(`${API_URL}/inscriptions/${inscriptionId}`, {
                athlete_id: inscription.athlete_id,
                event_id: inscription.event_id,
                bib: newBib.trim(),
                category: inscription.category
            });
            setMessage('✅ Dorsal actualizado correctamente');
            fetchInscriptions(selectedEvent);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al actualizar dorsal.');
        }
    };

    const handleDelete = async (inscriptionId) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta inscripción?')) return;
        setError(null);
        try {
            await axios.delete(`${API_URL}/inscriptions/${inscriptionId}`);
            setMessage('✅ Inscripción eliminada');
            fetchInscriptions(selectedEvent);
        } catch (err) {
            setError('Error al eliminar inscripción.');
        }
    };

    // Filtrar atletas no inscritos en el evento seleccionado
    const availableAthletes = selectedEvent
        ? athletes.filter(athlete => 
            !inscriptions.some(ins => ins.athlete_id === athlete.id)
          )
        : [];

    return (
        <div style={{ padding: "25px", minHeight: "100vh" }}>
            <h1 style={{ fontSize: "32px", color: "#ff2e2e", textTransform: "uppercase", marginBottom: "30px" }}>
                📝 Gestión de Inscripciones
            </h1>
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}

            {/* Selectors */}
            <div className="card" style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontWeight: 'bold' }}>
                            Torneo
                        </label>
                        <select 
                            onChange={(e) => setSelectedTournament(e.target.value)} 
                            value={selectedTournament} 
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #444', background: '#222', color: 'white' }}
                        >
                            <option value="">-- Selecciona un Torneo --</option>
                            {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <div style={{ flex: '1', minWidth: '200px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontWeight: 'bold' }}>
                            Evento
                        </label>
                        <select 
                            onChange={(e) => setSelectedEvent(e.target.value)} 
                            value={selectedEvent} 
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #444', background: '#222', color: 'white' }}
                            disabled={!selectedTournament}
                        >
                            <option value="">-- Selecciona un Evento --</option>
                            {events.map(e => <option key={e.id} value={e.id}>{e.name} {e.category ? `(${e.category})` : ''}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {selectedEvent && (
                <>
                    {/* Inscribir Nuevo Atleta */}
                    <div className="card" style={{ marginBottom: '30px' }}>
                        <h2 style={{ color: '#ff2e2e', marginBottom: '20px' }}>Inscribir Nuevo Atleta</h2>
                        {availableAthletes.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                                {availableAthletes.map(athlete => (
                                    <div key={athlete.id} style={{ 
                                        padding: '15px', 
                                        background: 'rgba(0, 0, 0, 0.3)', 
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                    }}>
                                        <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                            {athlete.first_name} {athlete.last_name}
                                        </p>
                                        <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '10px' }}>
                                            {athlete.club || 'Sin club'}
                                        </p>
                                        <button 
                                            className="button" 
                                            onClick={() => handleInscribe(athlete.id)}
                                            disabled={loading}
                                            style={{ width: '100%', padding: '8px' }}
                                        >
                                            {loading ? 'Inscribiendo...' : 'Inscribir'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
                                {athletes.length === 0 
                                    ? 'No hay atletas registrados. Ve a la página de Atletas para crear uno.'
                                    : 'Todos los atletas ya están inscritos en este evento.'}
                            </p>
                        )}
                    </div>

                    {/* Inscripciones Existentes */}
                    <div className="card">
                        <h2 style={{ color: '#ff2e2e', marginBottom: '20px' }}>Inscripciones del Evento</h2>
                        {inscriptions.length > 0 ? (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ background: "#ff2e2e" }}>
                                            <th style={{ padding: "12px", textAlign: "left" }}>Dorsal</th>
                                            <th style={{ padding: "12px", textAlign: "left" }}>Atleta</th>
                                            <th style={{ padding: "12px", textAlign: "left" }}>Club</th>
                                            <th style={{ padding: "12px", textAlign: "left" }}>Categoría</th>
                                            <th style={{ padding: "12px", textAlign: "left" }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inscriptions.map((ins, index) => {
                                            const athlete = athletes.find(a => a.id === ins.athlete_id);
                                            return (
                                                <InscriptionRow
                                                    key={ins.id}
                                                    inscription={ins}
                                                    athlete={athlete}
                                                    index={index}
                                                    onUpdateBib={handleUpdateBib}
                                                    onDelete={handleDelete}
                                                />
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>
                                No hay inscripciones para este evento todavía.
                            </p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

