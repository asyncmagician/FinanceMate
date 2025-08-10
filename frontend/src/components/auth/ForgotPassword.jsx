import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';

export default function ForgotPassword() {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await api.requestPasswordReset(email);
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(err.message || t('auth.passwordResetError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-bg flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <h2 className="text-2xl font-bold text-obsidian-text mb-6 text-center">
          {t('auth.forgotPassword')}
        </h2>

        {success ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-900/20 border border-green-500 rounded-lg">
              <p className="text-green-400">
                {t('auth.passwordResetSent')}
              </p>
            </div>
            <Link 
              to="/login" 
              className="block text-center text-obsidian-accent hover:underline"
            >
              {t('auth.backToLogin')}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-obsidian-text-muted text-sm">
              {t('auth.passwordResetInstructions')}
            </p>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
                {t('auth.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full"
                required
                disabled={loading}
                placeholder={t('auth.emailPlaceholder')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? t('auth.sending') : t('auth.sendResetLink')}
            </button>

            <div className="text-center">
              <Link 
                to="/login" 
                className="text-obsidian-accent hover:underline text-sm"
              >
                {t('auth.backToLogin')}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}