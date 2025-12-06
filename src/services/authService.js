// src/services/authService.js
import { apiClient } from './apiClient';

const API_BASE = 'http://localhost:5000/api';

export const authService = {
  async register(username, password) {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      let data;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      const msg = (data && data.msg) || 'Registrazione fallita';
      throw new Error(msg);
    }

    return res.json();
  },

  async login(username, password) {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      let data;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      const msg = (data && data.msg) || 'Login fallito';
      throw new Error(msg);
    }

    const data = await res.json(); // { access_token: '...' }
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
    }
    return data;
  },

  logout() {
    localStorage.removeItem('token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  async getCurrentUser() {
    // chiama /api/me per verificare che il token sia valido sul backend
    return apiClient.get('/me');
  },
};
