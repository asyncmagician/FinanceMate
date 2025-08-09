import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';

function Register() {
  const navigate = useNavigate();
  const { t, language, changeLanguage } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    acceptTerms: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError(t('register.passwordMismatch'));
      return;
    }

    if (formData.password.length < 6) {
      setError(t('register.passwordTooShort'));
      return;
    }

    setLoading(true);
    try {
      const response = await api.register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );

      if (response.success) {
        navigate('/login', { 
          state: { message: t('login.successRegistration') }
        });
      }
    } catch (err) {
      setError(err.message || t('register.registrationError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian-bg">
      <div className="card w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-obsidian-text">
            {t('register.title')}
          </h2>
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="input-field text-sm px-2 py-1"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
              {t('register.firstName')}
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="input-field w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
              {t('register.lastName')}
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="input-field w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
              {t('register.email')}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
              {t('register.password')}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field w-full"
              required
              minLength="6"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
              {t('register.confirmPassword')}
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field w-full"
              required
              minLength="6"
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
              className="mt-1 rounded border-obsidian-border bg-obsidian-bg-secondary text-obsidian-accent focus:ring-obsidian-accent"
              required
            />
            <label htmlFor="acceptTerms" className="text-sm text-obsidian-text-muted">
              {t('consent.acceptTerms', 'J\'accepte les ')}
              <a href="/terms" target="_blank" className="text-obsidian-accent hover:underline">
                {t('consent.termsOfService', 'Conditions d\'Utilisation')}
              </a>
              {t('consent.and', ' et la ')}
              <a href="/privacy" target="_blank" className="text-obsidian-accent hover:underline">
                {t('consent.privacyPolicy', 'Politique de Confidentialité')}
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.acceptTerms}
            className="btn-primary w-full"
          >
            {loading ? t('loading') : t('register.submit')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-obsidian-link hover:text-obsidian-link-hover text-sm">
            {t('register.hasAccount')} {t('register.login')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;