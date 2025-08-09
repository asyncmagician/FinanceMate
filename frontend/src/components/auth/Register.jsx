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
    acceptTerms: false,
    acceptPrivacy: false,
    ageConfirmation: false
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

    if (formData.password.length < 8) {
      setError(t('register.passwordTooShort'));
      return;
    }

    // Check password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(formData.password)) {
      setError(t('register.passwordTooWeak', 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'));
      return;
    }

    if (!formData.ageConfirmation) {
      setError(t('register.ageRequired', 'Vous devez confirmer avoir 16 ans ou plus'));
      return;
    }

    if (!formData.acceptTerms || !formData.acceptPrivacy) {
      setError(t('register.consentRequired', 'Vous devez accepter les conditions et la politique de confidentialité'));
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

          {/* Lawful Basis Notice */}
          <div className="p-3 bg-obsidian-bg-secondary rounded-lg text-sm text-obsidian-text-muted mb-4">
            {t('register.lawfulBasis', 'Nous traitons vos données pour fournir des services de gestion budgétaire (exécution du contrat) et sur la base de votre consentement.')}
          </div>

          {/* Age Verification */}
          <div className="flex items-start gap-2 mb-3">
            <input
              type="checkbox"
              id="ageConfirmation"
              name="ageConfirmation"
              checked={formData.ageConfirmation}
              onChange={(e) => setFormData({ ...formData, ageConfirmation: e.target.checked })}
              className="mt-1 rounded border-obsidian-border bg-obsidian-bg-secondary text-obsidian-accent focus:ring-obsidian-accent"
              required
            />
            <label htmlFor="ageConfirmation" className="text-sm text-obsidian-text-muted">
              {t('register.ageConfirmation', 'Je confirme avoir 16 ans ou plus')}
            </label>
          </div>

          {/* Terms of Service Consent */}
          <div className="flex items-start gap-2 mb-3">
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
            </label>
          </div>

          {/* Privacy Policy Consent */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="acceptPrivacy"
              name="acceptPrivacy"
              checked={formData.acceptPrivacy}
              onChange={(e) => setFormData({ ...formData, acceptPrivacy: e.target.checked })}
              className="mt-1 rounded border-obsidian-border bg-obsidian-bg-secondary text-obsidian-accent focus:ring-obsidian-accent"
              required
            />
            <label htmlFor="acceptPrivacy" className="text-sm text-obsidian-text-muted">
              {t('consent.acceptPrivacy', 'J\'accepte la ')}
              <a href="/privacy" target="_blank" className="text-obsidian-accent hover:underline">
                {t('consent.privacyPolicy', 'Politique de Confidentialité')}
              </a>
              {t('consent.dataProcessing', ' et le traitement de mes données personnelles')}
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.acceptTerms || !formData.acceptPrivacy || !formData.ageConfirmation}
            className="btn-primary w-full"
          >
            {loading ? t('loading') : t('register.submit')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-obsidian-text-muted mb-2">
            {t('register.hasAccount')}
          </p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="btn-secondary w-full"
          >
            {t('register.login')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;