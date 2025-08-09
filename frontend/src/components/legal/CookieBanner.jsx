import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function CookieBanner() {
  const { t } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  const handleReject = () => {
    // For essential cookies only, we still need to inform the user
    localStorage.setItem('cookieConsent', 'essential-only');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-obsidian-bg-secondary border-t border-obsidian-border p-4 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-obsidian-text text-sm">
            {t('cookies.message', 'Nous utilisons des cookies essentiels pour le fonctionnement de l\'application (authentification et préférences). Ces cookies sont nécessaires et ne peuvent pas être désactivés.')}
          </p>
          <a 
            href="/privacy" 
            className="text-obsidian-accent hover:underline text-sm"
          >
            {t('cookies.learnMore', 'En savoir plus')}
          </a>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReject}
            className="btn-secondary text-sm px-4 py-2"
          >
            {t('cookies.essentialOnly', 'Essentiels uniquement')}
          </button>
          <button
            onClick={handleAccept}
            className="btn-primary text-sm px-4 py-2"
          >
            {t('cookies.accept', 'Accepter')}
          </button>
        </div>
      </div>
    </div>
  );
}