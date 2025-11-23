import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function LiveTiming() {
    const [tournaments, setTournaments] = useState([]);
    const [events, setEvents] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState('');
    const [selectedEvent, setSelectedEvent] = useState('');
    const [results, setResults] = useState([]);
    const [bib, setBib] = useState('');
    const [manualTime, setManualTime] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const bibInputRef = useRef(null);
    const socketRef = useRef(null);
    const { isAuthenticated } = useAuth();

    // Initialize Socket.IO connection
    useEffect(() => {
        socketRef.current = io(API_URL, {
            transports: ['websocket', 'polling']
        });

        socketRef.current.on('connect', () => {
            console.log('Connected to Socket.IO server');
        });

        socketRef.current.on('result_updated', (data) => {
            if (data.event_id === selectedEvent) {
                fetchResults();
            }
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [selectedEvent]);

    // Load tournaments on init
    useEffect(() => {
        axios.get(`${API_URL}/tournaments`)
            .then(res => setTournaments(res.data))
            .catch(() => setError('Error al cargar torneos.'));
    }, []);

    // Load events when a tournament is selected
    useEffect(() => {
        if (selectedTournament) {
            setEvents([]);
            setSelectedEvent('');
            setResults([]);
            axios.get(`${API_URL}/events?tournament_id=${selectedTournament}`)
                .then(res => setEvents(res.data))
                .catch(() => setError('Error al cargar eventos.'));
        }
    }, [selectedTournament]);

    // Load results when an event is selected
    const fetchResults = async () => {
        if (selectedEvent) {
            try {
                const res = await axios.get(`${API_URL}/results?event_id=${selectedEvent}`);
                setResults(res.data.sort((a, b) => {
                    // Sort by position first, then by time
                    if (a.position && b.position) {
                        return a.position - b.position;
                    }
                    if (a.position) return -1;
                    if (b.position) return 1;
                    return new Date(b.recorded_at) - new Date(a.recorded_at);
                }));
            } catch (err) {
                setError('Error al cargar resultados.');
            }
        }
    };

    useEffect(() => {
        fetchResults();
    }, [selectedEvent]);

    const handleRegisterTime = async (e) => {
        e.preventDefault();
        if (!bib || !selectedEvent) {
            setError('Por favor, introduce un dorsal y selecciona un evento.');
            return;
        }
        if (!isAuthenticated) {
            setError('No autorizado. Por favor, inicia sesión.');
            return;
        }

        // Validar y usar tiempo manual
        if (!manualTime || manualTime.trim() === '') {
            setError('Por favor, ingresa el tiempo de carrera (formato: HH:MM:SS o MM:SS)');
            return;
        }

        // Validar formato manual (HH:MM:SS o MM:SS)
        const timeRegex = /^([0-9]{1,2}):([0-5][0-9]):([0-5][0-9])$|^([0-5][0-9]):([0-5][0-9])$/;
        if (!timeRegex.test(manualTime.trim())) {
            setError('Formato de tiempo inválido. Use HH:MM:SS o MM:SS (ej: 01:23:45 o 23:45)');
            return;
        }

        const timeToRegister = manualTime.trim();

        setError('');
        setMessage('');
        setLoading(true);

        try {
            // 1. Find the inscription by event and bib number or by athlete name
            let inscription = null;
            
            // Primero intentar buscar por dorsal
            if (bib && bib.trim() !== '') {
                const inscriptionsRes = await axios.get(`${API_URL}/inscriptions?event_id=${selectedEvent}&bib=${bib.trim()}`);
                inscription = inscriptionsRes.data[0];
            }
            
            // Si no se encuentra por dorsal, intentar buscar por nombre del atleta
            if (!inscription && bib && bib.trim() !== '') {
                // Obtener todas las inscripciones del evento
                const allInscriptionsRes = await axios.get(`${API_URL}/inscriptions?event_id=${selectedEvent}`);
                const allInscriptions = allInscriptionsRes.data;
                
                // Buscar por nombre (el bib puede ser un nombre)
                const searchTerm = bib.trim().toLowerCase();
                inscription = allInscriptions.find(ins => {
                    const fullName = `${ins.first_name || ''} ${ins.last_name || ''}`.toLowerCase();
                    return fullName.includes(searchTerm) || 
                           (ins.first_name && ins.first_name.toLowerCase().includes(searchTerm)) ||
                           (ins.last_name && ins.last_name.toLowerCase().includes(searchTerm));
                });
            }

            if (!inscription) {
                setError(`No se encontró inscripción con el dorsal o nombre "${bib}" para este evento. Verifica que el atleta esté inscrito.`);
                setLoading(false);
                return;
            }

            // 2. Register the result
            const newResultPayload = {
                inscription_id: inscription.id,
                event_id: selectedEvent,
                time: timeToRegister,
            };

            const resultRes = await axios.post(`${API_URL}/results`, newResultPayload);
            const fullResultData = resultRes.data;

            // Update results list immediately
            setResults(prev => {
                const updated = [fullResultData, ...prev];
                return updated.sort((a, b) => {
                    if (a.position && b.position) {
                        return a.position - b.position;
                    }
                    if (a.position) return -1;
                    if (b.position) return 1;
                    return new Date(b.recorded_at) - new Date(a.recorded_at);
                });
            });

            setMessage(`✅ Tiempo registrado: ${timeToRegister} para ${fullResultData.first_name} ${fullResultData.last_name} (${bib})`);
            setBib('');
            setManualTime('');
            bibInputRef.current?.focus();

        } catch (err) {
            setError(err.response?.data?.error || 'Error al registrar el tiempo.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "25px", minHeight: "100vh" }}>
            <h1 style={{ fontSize: "32px", color: "#ff2e2e", textTransform: "uppercase", marginBottom: "30px" }}>
                ⏱️ Registro de Tiempos en Vivo
            </h1>
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}

            {/* Tournament and Event Selectors */}
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

            {/* Registration Form */}
            {selectedEvent && (
                <div className="card" style={{ marginBottom: '30px' }}>
                    <h2 style={{ color: '#ff2e2e', marginBottom: '20px' }}>Registrar Nuevo Tiempo</h2>
                    <form onSubmit={handleRegisterTime} style={{ display: 'grid', gap: '20px' }}>
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1', minWidth: '200px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontWeight: 'bold' }}>
                                    Dorsal o Nombre del Atleta
                                </label>
                                <input
                                    ref={bibInputRef}
                                    type="text"
                                    value={bib}
                                    onChange={(e) => setBib(e.target.value)}
                                    placeholder="Dorsal (ej: 101) o Nombre (ej: Juan Pérez)"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #444', background: '#222', color: 'white' }}
                                    autoFocus
                                />
                                <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '5px' }}>
                                    Puedes buscar por número de dorsal o por nombre del atleta
                                </p>
                            </div>
                            <div style={{ flex: '1', minWidth: '200px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontWeight: 'bold' }}>
                                    Tiempo de Carrera *
                                </label>
                                <input
                                    type="text"
                                    value={manualTime}
                                    onChange={(e) => setManualTime(e.target.value)}
                                    placeholder="HH:MM:SS o MM:SS (ej: 01:23:45 o 23:45)"
                                    style={{ 
                                        width: '100%', 
                                        padding: '12px', 
                                        borderRadius: '8px', 
                                        border: '1px solid #444', 
                                        background: '#222', 
                                        color: 'white',
                                        fontSize: '1.1rem',
                                        fontFamily: 'monospace',
                                        textAlign: 'center'
                                    }}
                                />
                                <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '5px', textAlign: 'center' }}>
                                    Formato: HH:MM:SS (ej: 01:23:45) o MM:SS (ej: 23:45)
                                </p>
                            </div>
                        </div>
                        <div>
                            <button 
                                type="submit" 
                                className="button" 
                                disabled={loading || !bib || !manualTime}
                                style={{ minWidth: '200px', padding: '12px 24px' }}
                            >
                                {loading ? 'Registrando...' : '⏱️ Registrar Tiempo'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Results Table */}
            {selectedEvent && (
                <div className="card">
                    <h2 style={{ color: '#ff2e2e', marginBottom: '20px' }}>
                        🏆 Resultados Registrados
                    </h2>
                    {results.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "#ff2e2e" }}>
                                        <th style={{ padding: "12px", textAlign: "left" }}>Pos.</th>
                                        <th style={{ padding: "12px", textAlign: "left" }}>Nombre</th>
                                        <th style={{ padding: "12px", textAlign: "left" }}>Dorsal</th>
                                        <th style={{ padding: "12px", textAlign: "left" }}>Categoría</th>
                                        <th style={{ padding: "12px", textAlign: "left" }}>Tiempo</th>
                                        <th style={{ padding: "12px", textAlign: "left" }}>Registrado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((r, index) => (
                                        <tr key={r.id} style={{ background: index < 3 ? 'rgba(255, 46, 46, 0.1)' : 'transparent' }}>
                                            <td style={{ padding: "12px", fontWeight: index < 3 ? 'bold' : 'normal' }}>
                                                {r.position || index + 1}
                                                {index === 0 && ' 🥇'}
                                                {index === 1 && ' 🥈'}
                                                {index === 2 && ' 🥉'}
                                            </td>
                                            <td style={{ padding: "12px" }}>{r.first_name} {r.last_name}</td>
                                            <td style={{ padding: "12px" }}>{r.bib}</td>
                                            <td style={{ padding: "12px" }}>{r.category || 'General'}</td>
                                            <td style={{ padding: "12px", fontWeight: 'bold', color: index < 3 ? '#ff2e2e' : 'inherit', fontFamily: 'monospace' }}>
                                                {r.time}
                                            </td>
                                            <td style={{ padding: "12px", color: '#888', fontSize: '0.9rem' }}>
                                                {new Date(r.recorded_at).toLocaleTimeString('es-ES', { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>
                            No hay resultados registrados para este evento todavía.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
