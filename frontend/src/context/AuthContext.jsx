import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error parsing JWT:", e);
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [athlete, setAthlete] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAthleteProfile = async (userId) => {
    if (!userId) return;
    try {
      // This is inefficient, a dedicated /api/athletes/me would be better
      const res = await axios.get(`${API_URL}/athletes`);
      const userAthlete = res.data.find(a => a.user_id === userId);
      setAthlete(userAthlete || null);
    } catch (err) {
      console.error("Could not fetch athlete profile:", err);
      setAthlete(null); // Clear previous athlete data on error
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        const decodedUser = parseJwt(token);
        if (decodedUser && decodedUser.exp * 1000 > Date.now()) {
          setUser(decodedUser);
          setIsAuthenticated(true);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          await fetchAthleteProfile(decodedUser.id);
        } else {
          logout(); // Clears everything
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { accessToken } = response.data;
      localStorage.setItem('token', accessToken);
      setToken(accessToken); // This will trigger the useEffect
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      logout();
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setAthlete(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    athlete,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};