import React from "react";

export default function Dashboard() {
  // Datos ficticios seguros
  const atletas = [
    { id: 1, nombre: "Richard Quintero", pais: "Venezuela" },
    { id: 2, nombre: "María González", pais: "México" },
    { id: 3, nombre: "José Pérez", pais: "Colombia" },
    { id: 4, nombre: "Ana Beltrán", pais: "Chile" },
    { id: 5, nombre: "Marcos Silva", pais: "Brasil" }
  ];

  const stats = [
    { label: "Atletas inscritos", valor: atletas.length },
    { label: "Resultados disponibles", valor: 2 },
    { label: "Eventos activos", valor: 3 },
  ];

  return (
    <div style={{
      padding: "25px",
      fontFamily: "Arial",
      background: "#0b0b0b",
      color: "white",
      minHeight: "100vh"
    }}>

      <h1 style={{
        fontSize: "32px",
        marginBottom: "25px",
        color: "#ff2e2e",
        fontWeight: "bold",
        textTransform: "uppercase"
      }}>
        Dashboard Deportivo
      </h1>

      {/* Tarjetas estadísticas */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginBottom: "35px"
      }}>
        {stats.map((s, i) => (
          <div key={i}
            style={{
              padding: "25px",
              background: "#161616",
              borderRadius: "12px",
              border: "2px solid #ff2e2e",
              boxShadow: "0 4px 10px rgba(255,0,0,0.25)",
              textAlign: "center"
            }}>
            <div style={{ fontSize: "16px", color: "#ccc" }}>{s.label}</div>
            <div style={{
              fontSize: "30px",
              fontWeight: "bold",
              marginTop: "8px",
              color: "#ff2e2e"
            }}>
              {s.valor}
            </div>
          </div>
        ))}
      </div>

      {/* Tabla de atletas */}
      <h2 style={{
        marginBottom: "12px",
        fontSize: "24px",
        color: "#ff2e2e",
        textTransform: "uppercase"
      }}>
        Lista de Atletas
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "15px",
          background: "#111",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 4px 10px rgba(255,0,0,0.15)"
        }}
      >
        <thead>
          <tr style={{ background: "#ff2e2e", color: "white" }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>País</th>
          </tr>
        </thead>

        <tbody>
          {atletas.map((a, i) => (
            <tr key={a.id}
              style={{
                background: i % 2 === 0 ? "#1a1a1a" : "#0f0f0f"
              }}>
              <td style={tdStyle}>{a.id}</td>
              <td style={tdStyle}>{a.nombre}</td>
              <td style={tdStyle}>{a.pais}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

// Estilos compartidos
const thStyle = {
  padding: "12px",
  border: "1px solid #000",
  fontWeight: "bold",
  textAlign: "left"
};

const tdStyle = {
  padding: "12px",
  border: "1px solid #222",
  color: "white"
};