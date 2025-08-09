import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export default function NotFound() {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-obsidian-bg flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-obsidian-accent mb-4">404</h1>
        
        <h2 className="text-3xl font-semibold text-obsidian-text mb-4">
          {language === 'fr' ? 'Page non trouvée' : 'Page not found'}
        </h2>
        
        <p className="text-obsidian-text-muted mb-8 max-w-md mx-auto">
          {language === 'fr' 
            ? "Désolé, la page que vous recherchez n'existe pas ou a été déplacée."
            : "Sorry, the page you're looking for doesn't exist or has been moved."
          }
        </p>
        
        <div className="flex gap-4 justify-center">
          {user ? (
            // User is logged in - show dashboard link
            <Link 
              to="/" 
              className="btn-primary"
            >
              {language === 'fr' ? 'Retour au tableau de bord' : 'Back to Dashboard'}
            </Link>
          ) : (
            // User is not logged in - show login link
            <Link 
              to="/login" 
              className="btn-primary"
            >
              {language === 'fr' ? 'Se connecter' : 'Sign in'}
            </Link>
          )}
        </div>
        
        <div className="mt-12">
          <svg 
            className="w-64 h-64 mx-auto text-obsidian-text-muted opacity-20"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}