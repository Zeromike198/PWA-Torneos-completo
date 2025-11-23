import React, { useState, useEffect } from 'react';

const AthleteForm = ({ onSave, onCancel, athlete }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        birthdate: '',
        gender: 'Otro',
        club: ''
    });

    useEffect(() => {
        if (athlete) {
            setFormData({
                first_name: athlete.first_name || '',
                last_name: athlete.last_name || '',
                birthdate: athlete.birthdate ? new Date(athlete.birthdate).toISOString().split('T')[0] : '',
                gender: athlete.gender || 'Otro',
                club: athlete.club || ''
            });
        } else {
            setFormData({
                first_name: '',
                last_name: '',
                birthdate: '',
                gender: 'Otro',
                club: ''
            });
        }
    }, [athlete]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div style={formContainerStyle}>
            <h3 style={{ color: '#ff2e2e' }}>{athlete ? 'Editar Atleta' : 'Registrar Atleta'}</h3>
            <form onSubmit={handleSubmit}>
                <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Nombre" required style={inputStyle} />
                <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Apellido" required style={inputStyle} />
                <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} required style={inputStyle} />
                <select name="gender" value={formData.gender} onChange={handleChange} style={inputStyle}>
                    <option>Masculino</option>
                    <option>Femenino</option>
                    <option>Otro</option>
                </select>
                <input name="club" value={formData.club} onChange={handleChange} placeholder="Club" style={inputStyle} />
                <div style={{ marginTop: '20px' }}>
                    <button type="submit" style={buttonStyle}>Guardar</button>
                    <button type="button" onClick={onCancel} style={{ ...buttonStyle, background: '#555' }}>Cancelar</button>
                </div>
            </form>
        </div>
    );
}

// Styles
const formContainerStyle = { background: '#161616', padding: '25px', borderRadius: '12px', border: '2px solid #ff2e2e', margin: '20px 0' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #444', background: '#222', color: 'white', boxSizing: 'border-box', marginBottom: '10px' };
const buttonStyle = { background: '#ff2e2e', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' };

export default AthleteForm;