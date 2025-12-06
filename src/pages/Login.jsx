import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(username, password);
      if (onLoginSuccess) onLoginSuccess();
      navigate('/');
    } catch (e) {
      setError(e.message || 'Errore di login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="section-card auth-card">
        <h2 className="page-title">Login</h2>
        <p className="page-subtitle">Accedi al tuo PokéWallet.</p>

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

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Accesso...' : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  );
}
