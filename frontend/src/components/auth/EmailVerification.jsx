import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';

export default function EmailVerification() {
  const { t } = useLanguage();
  const { token } = useParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      await api.verifyEmail(token);
      setSuccess(true);
      setVerifying(false);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || t('auth.verificationError'));
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-obsidian-bg flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-obsidian-accent mx-auto mb-4"></div>
          <p className="text-obsidian-text">{t('auth.verifyingEmail')}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-obsidian-bg flex items-center justify-center p-4">
        <div className="card max-w-md w-full">
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-900/20 border border-green-500 rounded-lg">
              <svg className="w-16 h-16 text-green-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-400 text-lg font-medium">
                {t('auth.emailVerified')}
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
        <div className="text-center space-y-4">
          <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg">
            <svg className="w-16 h-16 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-400 text-lg font-medium">
              {t('auth.verificationFailed')}
            </p>
            <p className="text-red-400 text-sm mt-2">
              {error}
            </p>
          </div>
          
          <div className="pt-4">
            <Link 
              to="/login" 
              className="text-obsidian-accent hover:underline"
            >
              {t('auth.backToLogin')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}