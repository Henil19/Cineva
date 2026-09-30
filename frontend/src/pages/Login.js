import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';
import './Login.css';

function Login() {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const finishLogin = (destination) => {
    if (destination?.pathname) {
      navigate({ pathname: destination.pathname, search: destination.search || '', hash: destination.hash || '' }, {
        replace: true,
        state: destination.state,
      });
    } else {
      navigate('/', { replace: true });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login({ email, password });
      finishLogin(location.state?.from);
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Sign in could not be completed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page login-page">
      <section className="auth-panel" aria-labelledby="login-title">
        <Link className="auth-brand" to="/" aria-label="Cineva home"><span className="brand-mark" aria-hidden="true"><span /></span><span>Cineva</span></Link>
        <span className="section-kicker">Welcome back</span>
        <h1 id="login-title">Sign in to your account</h1>
        <p className="auth-intro">Pick up where your next movie night begins.</p>
        {location.state?.message && <p className="auth-context-message" role="status">{location.state.message}</p>}
        {error && <p className="auth-error" role="alert">{error}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">Email
            <input className="auth-input" type="email" name="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label className="auth-field">Password
            <input className="auth-input" type="password" name="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          <button className="button-primary auth-submit" type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <p className="auth-switch">New to Cineva? <Link to="/register" state={location.state}>Create an account</Link></p>
      </section>
    </main>
  );
}

export default Login;
