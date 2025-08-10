import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';

export default function VerificationRequired() {
  const { t } = useLanguage();
  const location = useLocation();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  
  // Get email from location state (passed from login/register)
  const email = location.state?.email || '';

  const handleResend = async () => {
    if (!email) {
      setError(t('auth.emailRequired'));
      return;
    }

    setSending(true);
    setError('');
    setSent(false);

    try {
      await api.resendVerification(email);
      setSent(true);
    } catch (err) {
      setError(err.message || t('auth.resendError'));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-bg flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <div className="text-center space-y-4">
          <svg className="w-20 h-20 text-obsidian-accent mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          
          <h2 className="text-2xl font-bold text-obsidian-text">
            {t('auth.verificationRequired')}
          </h2>
          
          <p className="text-obsidian-text-muted">
            {t('auth.verificationRequiredDesc')}
          </p>

          {email && (
            <p className="text-sm text-obsidian-text-muted">
              {t('auth.verificationSentTo')}: <span className="font-medium">{email}</span>
            </p>
          )}

          {sent && (
            <div className="p-3 bg-green-900/20 border border-green-500 rounded-lg">
              <p className="text-green-400 text-sm">
                {t('auth.verificationResent')}
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-900/20 border border-red-500 rounded-lg">
              <p className="text-red-400 text-sm">
                {error}
              </p>
            </div>
          )}

          <div className="space-y-3 pt-4">
            <button
              onClick={handleResend}
              disabled={sending || !email}
              className="btn-primary w-full disabled:opacity-50"
            >
              {sending ? t('auth.sending') : t('auth.resendVerification')}
            </button>
            
            <Link 
              to="/login" 
              className="block text-obsidian-accent hover:underline text-sm"
            >
              {t('auth.backToLogin')}
            </Link>
          </div>

          <div className="pt-4 border-t border-obsidian-border">
            <p className="text-xs text-obsidian-text-muted">
              {t('auth.checkSpam')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}