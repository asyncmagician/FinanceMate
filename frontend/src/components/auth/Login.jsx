import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t, language, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/profile');
    } catch (err) {
      // Generic error message for security - don't reveal if email exists or not
      setError(t('login.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian-bg">
      <div className="card w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-obsidian-text">{t('login.title')}</h1>
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="input-field text-sm px-2 py-1"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {successMessage && (
            <div className="bg-green-900/20 border border-green-500 text-green-400 px-4 py-2 rounded">
              {successMessage}
            </div>
          )}
          
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-2 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-obsidian-text-muted mb-1">
              {t('login.email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field w-full"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-obsidian-text-muted mb-1">
              {t('login.password')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full"
              required
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? t('loading') : t('login.submit')}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <Link 
            to="/register" 
            className="text-obsidian-link hover:text-obsidian-link-hover text-sm"
          >
            {t('login.noAccount')} {t('login.register')}
          </Link>
        </div>
      </div>
    </div>
  );
}