import React, { useState, useEffect } from 'react';

const TournamentForm = ({ tournament, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    sport: '',
    start_date: '',
    end_date: '',
    location: ''
  });

  useEffect(() => {
    if (tournament) {
      // Format dates for the input[type="date"]
      const formatDate = (date) => date ? new Date(date).toISOString().split('T')[0] : '';
      setFormData({
        name: tournament.name || '',
        sport: tournament.sport || '',
        start_date: formatDate(tournament.start_date),
        end_date: formatDate(tournament.end_date),
        location: tournament.location || ''
      });
    } else {
      // Reset form for creating a new one
      setFormData({
        name: '',
        sport: '',
        start_date: '',
        end_date: '',
        location: ''
      });
    }
  }, [tournament]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div style={formContainerStyle}>
      <h2>{tournament ? 'Editar Torneo' : 'Crear Nuevo Torneo'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={inputGroupStyle}>
          <label>Nombre</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
        </div>
        <div style={inputGroupStyle}>
          <label>Deporte</label>
          <input type="text" name="sport" value={formData.sport} onChange={handleChange} required style={inputStyle} />
        </div>
        <div style={inputGroupStyle}>
          <label>Fecha de Inicio</label>
          <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required style={inputStyle} />
        </div>
        <div style={inputGroupStyle}>
          <label>Fecha de Fin (Opcional)</label>
          <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={inputGroupStyle}>
          <label>Ubicación</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={buttonGroupStyle}>
          <button type="submit" style={buttonStyle}>Guardar</button>
          <button type="button" onClick={onCancel} style={{...buttonStyle, background: '#555'}}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

// Styles
const formContainerStyle = {
  background: '#1a1a1a',
  padding: '25px',
  borderRadius: '8px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
  maxWidth: '600px',
  margin: '20px auto'
};

const inputGroupStyle = {
  marginBottom: '15px'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #333',
  background: '#222',
  color: 'white',
  boxSizing: 'border-box'
};

const buttonGroupStyle = {
  marginTop: '20px',
  display: 'flex',
  gap: '10px'
};

const buttonStyle = {
  background: '#ff2e2e',
  color: 'white',
  border: 'none',
  padding: '10px 15px',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default TournamentForm;