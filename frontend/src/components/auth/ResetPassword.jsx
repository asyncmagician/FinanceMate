import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';

export default function ResetPassword() {
  const { t } = useLanguage();
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password.length < 8) {
      setError(t('auth.passwordTooShort'));
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError(t('auth.passwordRequirements'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }

    setLoading(true);

    try {
      await api.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || t('auth.resetPasswordError'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-obsidian-bg flex items-center justify-center p-4">
        <div className="card max-w-md w-full">
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-900/20 border border-green-500 rounded-lg">
              <p className="text-green-400 text-lg font-medium">
                {t('auth.passwordResetSuccess')}
              </p>
              <p className="text-green-400 text-sm mt-2">
                {t('auth.redirectingToLogin')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-bg flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <h2 className="text-2xl font-bold text-obsidian-text mb-6 text-center">
          {t('auth.resetPassword')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
              {t('auth.newPassword')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full"
              required
              disabled={loading}
              placeholder={t('auth.newPasswordPlaceholder')}
            />
            <p className="text-xs text-obsidian-text-muted mt-1">
              {t('auth.passwordRequirements')}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
              {t('auth.confirmNewPassword')}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field w-full"
              required
              disabled={loading}
              placeholder={t('auth.confirmPasswordPlaceholder')}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? t('auth.resetting') : t('auth.resetPasswordButton')}
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
      </div>
    </div>
  );
}