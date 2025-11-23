import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AthleteForm from './AthleteForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function AthletesPage() {
    const [athletes, setAthletes] = useState([]);
    const [filteredAthletes, setFilteredAthletes] = useState([]);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingAthlete, setEditingAthlete] = useState(null);
    const { user } = useAuth(); // Get the authenticated user

    useEffect(() => {
        const fetchAthletes = async () => {
            try {
                const response = await axios.get(`${API_URL}/athletes`);
                setAthletes(response.data);
                setFilteredAthletes(response.data);
            } catch (err) {
                setError('No se pudieron cargar los atletas.');
                console.error(err);
            }
        };
        fetchAthletes();
    }, []);

    useEffect(() => {
        const results = athletes.filter(athlete =>
            (athlete.first_name || '').toLowerCase().includes(search.toLowerCase()) ||
            (athlete.last_name || '').toLowerCase().includes(search.toLowerCase())
        );
        setFilteredAthletes(results);
    }, [search, athletes]);

    const handleSave = async (athleteData) => {
        setError(null);
        try {
            if (editingAthlete) {
                const response = await axios.put(`${API_URL}/athletes/${editingAthlete.id}`, athleteData);
                const updatedAthletes = athletes.map(a => a.id === editingAthlete.id ? response.data : a);
                setAthletes(updatedAthletes);
            } else {
                // When creating a new athlete, associate it with the logged-in user
                const response = await axios.post(`${API_URL}/athletes`, { ...athleteData, user_id: user.id });
                setAthletes([...athletes, response.data]);
            }
            setShowForm(false);
            setEditingAthlete(null);
        } catch (err) {
            setError('Error al guardar el atleta.');
            console.error(err.response?.data?.error || err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar este atleta?')) return;
        setError(null);
        try {
            await axios.delete(`${API_URL}/athletes/${id}`);
            setAthletes(athletes.filter(a => a.id !== id));
        } catch(err) {
            setError('Error al eliminar atleta.');
            console.error(err);
        }
    };
    
    const handleEdit = (athlete) => {
        setEditingAthlete(athlete);
        setShowForm(true);
    };

    return (
        <div style={pageStyle}>
            <h1 style={headerStyle}>Gestión de Atletas</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {showForm ? (
                <AthleteForm onSave={handleSave} onCancel={() => setShowForm(false)} athlete={editingAthlete} />
            ) : (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
                        <input
                            type="text"
                            placeholder="Buscar por nombre o apellido..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{...inputStyle, width: '70%'}}
                        />
                        <button onClick={() => { setEditingAthlete(null); setShowForm(true); }} style={buttonStyle}>Registrar Atleta</button>
                    </div>

                    <table style={tableStyle}>
                        <thead>
                            <tr style={{ background: "#ff2e2e" }}>
                                <th style={thStyle}>Nombre</th>
                                <th style={thStyle}>Club</th>
                                <th style={thStyle}>Género</th>
                                <th style={thStyle}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAthletes.map((a, i) => (
                                <tr key={a.id} style={{ background: i % 2 === 0 ? '#1a1a1a' : '#0f0f0f' }}>
                                    <td style={tdStyle}>{a.first_name} {a.last_name}</td>
                                    <td style={tdStyle}>{a.club}</td>
                                    <td style={tdStyle}>{a.gender}</td>
                                    <td style={tdStyle}>
                                        <button onClick={() => handleEdit(a)} style={buttonStyle}>Editar</button>
                                        <button onClick={() => handleDelete(a.id)} style={{...buttonStyle, background: '#c00'}}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

// Styles
const pageStyle = { padding: "25px", fontFamily: "Arial", background: "#0b0b0b", color: "white", minHeight: "100vh" };
const headerStyle = { fontSize: "32px", color: "#ff2e2e", textTransform: "uppercase" };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#222', color: 'white', boxSizing: 'border-box', marginBottom: '10px' };
const buttonStyle = { background: '#ff2e2e', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' };
const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: "15px" };
const thStyle = { padding: "12px", borderBottom: "2px solid #ff2e2e", textAlign: "left" };
const tdStyle = { padding: "12px", borderBottom: "1px solid #222" };
