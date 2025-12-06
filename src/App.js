// src/App.js
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { authService } from './services/authService';
import './App.css';

// Controlla autenticazione lato backend (token + /api/me)
function RequireAuth({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState('checking'); // 'checking' | 'ok' | 'no'

  useEffect(() => {
    async function checkAuth() {
      if (!authService.isAuthenticated()) {
        setStatus('no');
        return;
      }

      try {
        await authService.getCurrentUser();
        setStatus('ok');
      } catch (e) {
        authService.logout();
        setStatus('no');
      }
    }

    checkAuth();
  }, []);

  if (status === 'checking') {
    return <p className="loading-text">Verifica sessione...</p>;
  }

  if (status === 'no') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function AppInner() {
  const [isAuth, setIsAuth] = useState(authService.isAuthenticated());

  useEffect(() => {
    const handleStorage = () => {
      setIsAuth(authService.isAuthenticated());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsAuth(false);
    window.location.href = '/login';
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-title">
            <div className="app-title-logo" />
            <div>
              <div className="app-title-text">PokéWallet</div>
              <div className="muted-text" style={{ fontSize: 11 }}>
                Il tuo raccoglitore digitale di carte Pokémon
              </div>
            </div>
          </div>

          <nav className="app-nav">
            {isAuth && (
              <>
                <Link to="/" className="app-nav-link">
                  Home
                </Link>
                <button
                  type="button"
                  className="app-nav-link app-nav-link-primary"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}

            {!isAuth && (
              <>
                <Link to="/login" className="app-nav-link">
                  Login
                </Link>
                <Link to="/register" className="app-nav-link app-nav-link-primary">
                  Registrati
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />

          <Route
            path="/login"
            element={<Login onLoginSuccess={() => setIsAuth(true)} />}
          />
          <Route path="/register" element={<Register />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}
