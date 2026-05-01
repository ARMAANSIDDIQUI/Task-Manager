import { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

// This provider wraps our app and keeps track of who is logged in
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // When the app starts, check if we have a user saved or a token
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await API.get('/auth/me');
          const userData = res.data.data;
          // Normalize ID just in case
          setUser({ ...userData, id: userData.id || userData._id });
        } catch (err) {
          console.error('Session validation failed:', err.response?.data || err.message);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email: email.toLowerCase(), password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
