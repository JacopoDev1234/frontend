// src/services/apiClient.js

const API_BASE = 'http://localhost:5000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}

export const apiClient = {
  async get(path, { params } = {}) {
    const url = new URL(API_BASE + path);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (!res.ok) {
      let data = null;
      try {
        data = await res.json();
      } catch {
        // ignore
      }
      const msg = data?.msg || `Errore GET ${path}`;
      throw new Error(msg);
    }

    return res.json();
  },

  async post(path, body) {
    const res = await fetch(API_BASE + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(body || {}),
    });

    if (!res.ok) {
      let data = null;
      try {
        data = await res.json();
      } catch {
        // ignore
      }
      const msg = data?.msg || `Errore POST ${path}`;
      throw new Error(msg);
    }

    return res.json();
  },

  async delete(path) {
    const res = await fetch(API_BASE + path, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
      },
    });

    if (!res.ok) {
      let data = null;
      try {
        data = await res.json();
      } catch {
        // ignore
      }
      const msg = data?.msg || `Errore DELETE ${path}`;
      throw new Error(msg);
    }

    return res.json();
  },
};
