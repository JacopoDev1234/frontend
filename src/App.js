// src/App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from 'react-router-dom';
import Home from './pages/Home';
import Wallet from './pages/Wallet';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';

function isAuthenticated() {
  const token = localStorage.getItem('token');
  return !!token;
}

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppLayout({ children }) {
  const loggedIn = isAuthenticated();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header-left">
          <span className="app-logo">PokéWallet</span>
          {loggedIn && (
            <nav className="app-nav">
              <Link to="/" className="app-nav-link">
                Ricerca carte
              </Link>
              <Link to="/wallet" className="app-nav-link">
                Il mio wallet
              </Link>
              <Link to="/about" className="app-nav-link">
                About
              </Link>
            </nav>
          )}
        </div>
        <div className="app-header-right">
          {loggedIn ? (
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="app-nav-link">
                Login
              </Link>
              <Link to="/register" className="app-nav-link">
                Register
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="app-main">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ROUTE PUBBLICHE */}
        <Route
          path="/login"
          element={
            <AppLayout>
              <Login />
            </AppLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AppLayout>
              <Register />
            </AppLayout>
          }
        />

        {/* ROUTE PROTETTE */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Home />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Wallet />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <AppLayout>
                <About />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
