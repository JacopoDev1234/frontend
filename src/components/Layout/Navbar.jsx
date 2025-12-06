import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function Navbar() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(authService.isAuthenticated());

  useEffect(() => {
    setIsAuth(authService.isAuthenticated());
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsAuth(false);
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <Link to="/">PokéWallet</Link>
      </div>
      <nav className="navbar-links">
        <Link to="/">Wallet</Link>
        <Link to="/about">Info</Link>

        {!isAuth && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Registrati</Link>
          </>
        )}

        {isAuth && (
          <button type="button" className="link-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
