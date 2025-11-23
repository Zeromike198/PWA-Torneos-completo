import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("admin@uvm.edu");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  // If user is already authenticated, redirect them
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError("Error en el inicio de sesión. Por favor, verifique sus credenciales.");
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: 'calc(100vh - 200px)',
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: 420, width: '100%' }}>
        <h2 style={{ 
          color: '#ff2e2e', 
          marginBottom: '30px',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          Iniciar Sesión
        </h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={submit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#ccc', 
              fontWeight: 'bold' 
            }}>
              Email
            </label>
            <input
              type="email"
              required
              style={{ 
                width: "100%", 
                padding: "12px", 
                borderRadius: "8px",
                border: '1px solid #444',
                background: '#222',
                color: 'white',
                boxSizing: 'border-box'
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#ccc', 
              fontWeight: 'bold' 
            }}>
              Contraseña
            </label>
            <input
              type="password"
              required
              style={{ 
                width: "100%", 
                padding: "12px", 
                borderRadius: "8px",
                border: '1px solid #444',
                background: '#222',
                color: 'white',
                boxSizing: 'border-box'
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div style={{ display: "flex", gap: "10px", flexDirection: 'column' }}>
            <button 
              className="button" 
              type="submit"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Iniciando sesión...' : 'Entrar'}
            </button>
            <p style={{ textAlign: 'center', color: '#888', fontSize: '0.9rem', marginTop: '10px' }}>
              ¿No tienes cuenta? <Link to="/" style={{ color: '#ff2e2e' }}>Contacta al administrador</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}