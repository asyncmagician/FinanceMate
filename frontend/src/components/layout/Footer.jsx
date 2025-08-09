import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Footer() {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-obsidian-border bg-obsidian-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-obsidian-text-muted text-sm">
            © {currentYear} FinanceMate - {t('footer.allRightsReserved', language === 'fr' ? 'Tous droits réservés' : 'All rights reserved')}
          </div>
          
          <div className="flex gap-6 text-sm">
            <Link 
              to="/privacy" 
              className="text-obsidian-text-muted hover:text-obsidian-accent transition-colors"
            >
              {t('footer.privacy', language === 'fr' ? 'Confidentialité' : 'Privacy')}
            </Link>
            <Link 
              to="/terms" 
              className="text-obsidian-text-muted hover:text-obsidian-accent transition-colors"
            >
              {t('footer.terms', language === 'fr' ? 'Conditions' : 'Terms')}
            </Link>
            <a 
              href="https://github.com/asyncmagician/FinanceMate" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-obsidian-text-muted hover:text-obsidian-accent transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}