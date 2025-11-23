import React, { useState, useEffect } from 'react';

const EventForm = ({ event, tournamentId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    distance: '',
    category: '',
    tournament_id: tournamentId
  });

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || '',
        distance: event.distance || '',
        category: event.category || '',
        tournament_id: event.tournament_id || tournamentId
      });
    } else {
      setFormData({
        name: '',
        distance: '',
        category: '',
        tournament_id: tournamentId
      });
    }
  }, [event, tournamentId]);

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
      <h2>{event ? 'Editar Evento' : 'Crear Nuevo Evento'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={inputGroupStyle}>
          <label>Nombre del Evento</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
        </div>
        <div style={inputGroupStyle}>
          <label>Distancia</label>
          <input type="text" name="distance" value={formData.distance} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={inputGroupStyle}>
          <label>Categoría</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} style={inputStyle} />
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

export default EventForm;