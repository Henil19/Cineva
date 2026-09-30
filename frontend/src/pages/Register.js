import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';
import './Register.css';

function Register() {
  const { register } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const finishRegistration = (destination) => {
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
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (new TextEncoder().encode(password).length > 72) {
      setError('Password must be no more than 72 bytes.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await register({ name, email, password });
      finishRegistration(location.state?.from);
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Account could not be created. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page register-page">
      <section className="auth-panel" aria-labelledby="register-title">
        <Link className="auth-brand" to="/" aria-label="Cineva home"><span className="brand-mark" aria-hidden="true"><span /></span><span>Cineva</span></Link>
        <span className="section-kicker">Join Cineva</span>
        <h1 id="register-title">Create your account</h1>
        <p className="auth-intro">Keep your movie plans and bookings together.</p>
        {location.state?.message && <p className="auth-context-message" role="status">{location.state.message}</p>}
        {error && <p className="auth-error" role="alert">{error}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">Name
            <input className="auth-input" type="text" name="name" autoComplete="name" maxLength="100" value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label className="auth-field">Email
            <input className="auth-input" type="email" name="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label className="auth-field">Password
            <input className="auth-input" type="password" name="password" autoComplete="new-password" minLength="8" maxLength="72" value={password} onChange={(event) => setPassword(event.target.value)} required />
            <small>At least 8 characters.</small>
          </label>
          <label className="auth-field">Confirm password
            <input className="auth-input" type="password" name="confirmPassword" autoComplete="new-password" minLength="8" maxLength="72" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
          </label>
          <button className="button-primary auth-submit" type="submit" disabled={submitting}>{submitting ? 'Creating account…' : 'Create account'}</button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login" state={location.state}>Sign in</Link></p>
      </section>
    </main>
  );
}

export default Register;
