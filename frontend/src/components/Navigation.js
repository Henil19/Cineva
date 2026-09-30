import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);
  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/', { replace: true });
  };

  return (
    <header className="site-header">
      <nav className="nav-container" aria-label="Main navigation">
        <NavLink to="/" className="nav-brand" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span>Cineva</span>
        </NavLink>

        <button
          type="button"
          className={`nav-toggle ${menuOpen ? 'is-open' : ''}`}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <ul id="primary-navigation" className={`nav-menu ${menuOpen ? 'is-open' : ''}`}>
          <li>
            <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`} onClick={closeMenu}>
              Movies
            </NavLink>
          </li>
          {user && <li><NavLink to="/bookings" className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`} onClick={closeMenu}>My Bookings</NavLink></li>}
          <li>
            <NavLink to="/about" className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`} onClick={closeMenu}>
              About
            </NavLink>
          </li>
          {loading ? <li className="nav-auth-loading" aria-live="polite">Checking account…</li> : user ? (
            <>
              <li><span className="nav-user" title={user.email}><span className="nav-user-name">{user.name}</span><span className="nav-user-email">{user.email}</span></span></li>
              <li><button type="button" className="nav-link nav-logout" onClick={handleLogout}>Log out</button></li>
            </>
          ) : (
            <>
              <li><NavLink to="/login" className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`} onClick={closeMenu}>Login</NavLink></li>
              <li><NavLink to="/register" className={({ isActive }) => `nav-link nav-signup${isActive ? ' is-active' : ''}`} onClick={closeMenu}>Sign up</NavLink></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navigation;
