import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

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
          <li>
            <NavLink to="/about" className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`} onClick={closeMenu}>
              About
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navigation;
