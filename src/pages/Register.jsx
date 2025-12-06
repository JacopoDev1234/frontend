// src/pages/Register.jsx
import React, { useState } from 'react';
import { authService } from '../services/authService';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirm) {
      setError('Le password non coincidono');
      return;
    }

    setLoading(true);
    try {
      await authService.register(username, password);
      setSuccess('Registrazione completata. Ora puoi fare login.');
      setUsername('');
      setPassword('');
      setConfirm('');
    } catch (e) {
      setError(e.message || 'Errore di registrazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="section-card auth-card">
        <h2 className="page-title">Registrazione</h2>
        <p className="page-subtitle">
          Crea un account per iniziare a usare il tuo PokéWallet.
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-field">
            <span className="form-label">Username</span>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(ev) => setUsername(ev.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <span className="form-label">Password</span>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <span className="form-label">Conferma password</span>
            <input
              type="password"
              className="form-input"
              value={confirm}
              onChange={(ev) => setConfirm(ev.target.value)}
              required
            />
          </div>

          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registrazione...' : 'Registrati'}
          </button>
        </form>
      </div>
    </div>
  );
}
