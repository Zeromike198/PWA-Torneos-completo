import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function ResultsPage() {
    const [tournaments, setTournaments] = useState([]);
    const [events, setEvents] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState('');
    const [selectedEvent, setSelectedEvent] = useState('');
    const [results, setResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const socketRef = React.useRef(null);
    
    // State for filters
    const [genderFilter, setGenderFilter] = useState('');
    const [clubFilter, setClubFilter] = useState('');

    // Initialize Socket.IO for real-time updates
    useEffect(() => {
        socketRef.current = io(API_URL, {
            transports: ['websocket', 'polling']
        });

        socketRef.current.on('connect', () => {
            console.log('Connected to Socket.IO server for results');
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

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_URL}/tournaments`)
            .then(res => {
                setTournaments(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Error al cargar torneos.');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (selectedTournament) {
            setLoading(true);
            axios.get(`${API_URL}/events?tournament_id=${selectedTournament}`)
                .then(res => {
                    setEvents(res.data);
                    setSelectedEvent('');
                    setResults([]);
                    setLoading(false);
                })
                .catch(() => {
                    setError('Error al cargar eventos.');
                    setLoading(false);
                });
        } else {
            setEvents([]);
            setResults([]);
        }
    }, [selectedTournament]);

    const fetchResults = async () => {
        if (selectedEvent) {
            setLoading(true);
            try {
                const res = await axios.get(`${API_URL}/results?event_id=${selectedEvent}`);
                setResults(res.data);
            } catch (err) {
                setError('Error al cargar resultados.');
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchResults();
    }, [selectedEvent]);

    // Effect for applying filters
    useEffect(() => {
        let tempResults = [...results];
        if (genderFilter) {
            tempResults = tempResults.filter(r => r.gender === genderFilter);
        }
        if (clubFilter) {
            tempResults = tempResults.filter(r => (r.club || '').toLowerCase().includes(clubFilter.toLowerCase()));
        }
        setFilteredResults(tempResults);
    }, [results, genderFilter, clubFilter]);
    
    // Group filtered results by category and calculate winners
    const resultsByCategory = filteredResults.reduce((acc, result, index) => {
        const category = result.category || 'General';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push({ ...result, displayPosition: acc[category].length + 1 });
        return acc;
    }, {});

    // Get overall winners (top 3)
    const overallWinners = filteredResults
        .filter(r => r.position)
        .sort((a, b) => a.position - b.position)
        .slice(0, 3);

    return (
        <div style={{ padding: "25px", minHeight: "100vh" }}>
            <h1 style={{ fontSize: "32px", color: "#ff2e2e", textTransform: "uppercase", marginBottom: "30px" }}>
                🏆 Resultados de Competencias
            </h1>
            {error && <p className="error-message">{error}</p>}

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
                            <option value="">-- Selecciona Torneo --</option>
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
                            <option value="">-- Selecciona Evento --</option>
                            {events.map(e => <option key={e.id} value={e.id}>{e.name} {e.category ? `(${e.category})` : ''}</option>)}
                        </select>
                    </div>
                </div>
            </div>
            
            {/* Filter Controls */}
            {selectedEvent && (
                <div className="card" style={{ marginBottom: '30px' }}>
                    <h3 style={{ color: '#ff2e2e', marginBottom: '15px' }}>Filtros</h3>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1', minWidth: '150px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontWeight: 'bold' }}>
                                Género
                            </label>
                            <select 
                                value={genderFilter} 
                                onChange={e => setGenderFilter(e.target.value)} 
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #444', background: '#222', color: 'white' }}
                            >
                                <option value="">-- Todos --</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                            </select>
                        </div>
                        <div style={{ flex: '1', minWidth: '200px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#ccc', fontWeight: 'bold' }}>
                                Club
                            </label>
                            <input
                                type="text"
                                placeholder="Buscar por club..."
                                value={clubFilter}
                                onChange={e => setClubFilter(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #444', background: '#222', color: 'white' }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Overall Winners Section */}
            {selectedEvent && overallWinners.length > 0 && (
                <div className="card" style={{ 
                    marginBottom: '40px', 
                    background: 'linear-gradient(135deg, rgba(255, 46, 46, 0.2) 0%, rgba(0, 0, 0, 0.3) 100%)',
                    border: '2px solid rgba(255, 46, 46, 0.5)'
                }}>
                    <h2 style={{ color: '#ff2e2e', marginBottom: '20px', textAlign: 'center' }}>
                        🏆 Ganadores Generales
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        {overallWinners.map((winner, index) => (
                            <div key={winner.id} style={{ 
                                textAlign: 'center', 
                                padding: '20px',
                                background: 'rgba(0, 0, 0, 0.3)',
                                borderRadius: '12px',
                                border: index === 0 ? '3px solid gold' : index === 1 ? '3px solid silver' : '3px solid #cd7f32'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                </div>
                                <h3 style={{ color: '#ff2e2e', marginBottom: '5px' }}>
                                    {winner.first_name} {winner.last_name}
                                </h3>
                                <p style={{ color: '#ccc', marginBottom: '5px' }}>Dorsal: {winner.bib}</p>
                                <p style={{ color: '#ccc', marginBottom: '5px' }}>Tiempo: <strong>{winner.time}</strong></p>
                                {winner.club && <p style={{ color: '#888', fontSize: '0.9rem' }}>{winner.club}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Results by Category */}
            {selectedEvent && Object.keys(resultsByCategory).length > 0 ? (
                Object.keys(resultsByCategory).map(category => {
                    const categoryResults = resultsByCategory[category];
                    const categoryWinners = categoryResults.slice(0, 3);
                    
                    return (
                        <div key={category} className="card" style={{ marginBottom: '40px' }}>
                            <h2 style={{ 
                                fontSize: "24px", 
                                color: "#ff2e2e", 
                                borderBottom: '2px solid #ff2e2e', 
                                paddingBottom: '10px', 
                                marginBottom: '20px',
                                textTransform: 'uppercase'
                            }}>
                                Categoría: {category}
                            </h2>
                            
                            {/* Category Winners */}
                            {categoryWinners.length > 0 && (
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                                    gap: '15px',
                                    marginBottom: '30px',
                                    padding: '20px',
                                    background: 'rgba(255, 46, 46, 0.1)',
                                    borderRadius: '12px'
                                }}>
                                    {categoryWinners.map((winner, index) => (
                                        <div key={winner.id} style={{ 
                                            textAlign: 'center',
                                            padding: '15px',
                                            background: 'rgba(0, 0, 0, 0.3)',
                                            borderRadius: '8px'
                                        }}>
                                            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                                                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                            </div>
                                            <p style={{ color: '#ff2e2e', fontWeight: 'bold', marginBottom: '5px' }}>
                                                {winner.first_name} {winner.last_name}
                                            </p>
                                            <p style={{ color: '#ccc', fontSize: '0.9rem' }}>{winner.time}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Full Category Results Table */}
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead>
                                        <tr style={{ background: "#ff2e2e" }}>
                                            <th style={{ padding: "12px", textAlign: "left" }}>Pos.</th>
                                            <th style={{ padding: "12px", textAlign: "left" }}>Atleta</th>
                                            <th style={{ padding: "12px", textAlign: "left" }}>Club</th>
                                            <th style={{ padding: "12px", textAlign: "left" }}>Tiempo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categoryResults.map((r, i) => (
                                            <tr key={r.id} style={{ 
                                                background: i < 3 ? 'rgba(255, 46, 46, 0.1)' : i % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                                            }}>
                                                <td style={{ 
                                                    padding: "12px", 
                                                    width: '60px', 
                                                    textAlign: 'center',
                                                    fontWeight: i < 3 ? 'bold' : 'normal'
                                                }}>
                                                    {r.position || r.displayPosition || '-'}
                                                </td>
                                                <td style={{ padding: "12px" }}>
                                                    {r.first_name} {r.last_name}
                                                </td>
                                                <td style={{ padding: "12px", color: '#888' }}>
                                                    {r.club || 'N/A'}
                                                </td>
                                                <td style={{ 
                                                    padding: "12px", 
                                                    width: '120px',
                                                    fontWeight: i < 3 ? 'bold' : 'normal',
                                                    color: i < 3 ? '#ff2e2e' : 'inherit'
                                                }}>
                                                    {r.time}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })
            ) : selectedEvent && !loading ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: '#888', fontSize: '1.1rem' }}>
                        No hay resultados para mostrar con los filtros actuales.
                    </p>
                </div>
            ) : selectedEvent && loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="loading" style={{ width: '40px', height: '40px', margin: '0 auto' }}></div>
                    <p style={{ marginTop: '20px', color: '#888' }}>Cargando resultados...</p>
                </div>
            ) : null}
        </div>
    );
}
