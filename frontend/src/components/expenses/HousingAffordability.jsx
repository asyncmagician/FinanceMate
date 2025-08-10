import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';

export default function HousingAffordability({ housingExpenses = 0, totalFixedExpenses = 0, userSalary: propSalary, isVisible = true }) {
  const { t, language } = useLanguage();
  const [userSalary, setUserSalary] = useState(propSalary || null);
  const [showTips, setShowTips] = useState(false);

  useEffect(() => {
    if (!propSalary) {
      loadUserSalary();
    } else {
      setUserSalary(propSalary);
    }
  }, [propSalary]);

  const loadUserSalary = async () => {
    try {
      const response = await api.getSalary();
      setUserSalary(response.salary);
    } catch (err) {
      console.log('No salary configured');
    }
  };

  if (!userSalary || !isVisible || (housingExpenses === 0 && totalFixedExpenses === 0)) {
    return null;
  }

  // For debt ratio analysis, use total fixed expenses (all charges, not just housing)
  // This aligns with French "taux d'endettement" which considers all fixed charges
  const expensesToAnalyze = totalFixedExpenses;
  const isHousingSpecific = false; // We're analyzing total debt ratio, not just housing
  const debtRatio = (expensesToAnalyze / userSalary) * 100;
  
  const getStatusColor = () => {
    if (debtRatio < 30) return 'text-green-400';
    if (debtRatio <= 33) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusIcon = () => {
    if (debtRatio < 30) return '✅';
    if (debtRatio <= 33) return '⚠️';
    return '🔴';
  };

  const getStatusMessage = () => {
    const chargeType = isHousingSpecific ? 
      (language === 'fr' ? 'charges de logement' : 'housing costs') :
      (language === 'fr' ? 'charges fixes' : 'fixed expenses');
    
    if (language === 'fr') {
      if (debtRatio < 30) {
        return `Vos ${chargeType} représentent ${debtRatio.toFixed(1)}% de vos revenus. C'est un ratio sain qui vous laisse de la marge.`;
      }
      if (debtRatio <= 33) {
        return `Vos ${chargeType} représentent ${debtRatio.toFixed(1)}% de vos revenus. Vous approchez du maximum recommandé de 33%.`;
      }
      return `Vos ${chargeType} représentent ${debtRatio.toFixed(1)}% de vos revenus. En France, il est recommandé de ne pas dépasser 33% (taux d'endettement).`;
    } else {
      if (debtRatio < 30) {
        return `Your ${chargeType} represent ${debtRatio.toFixed(1)}% of your income. This is a healthy ratio with room to spare.`;
      }
      if (debtRatio <= 33) {
        return `Your ${chargeType} represent ${debtRatio.toFixed(1)}% of your income. You're approaching the recommended maximum of 33%.`;
      }
      return `Your ${chargeType} represent ${debtRatio.toFixed(1)}% of your income. The recommended maximum is 33% for financial health.`;
    }
  };

  const getTips = () => {
    if (language === 'fr') {
      return [
        {
          title: "Aides au logement (CAF)",
          link: "https://www.caf.fr/allocataires/aides-et-demarches/droits-et-prestations/logement/les-aides-au-logement",
          description: "Vérifiez votre éligibilité aux APL/ALS"
        },
        {
          title: "Réduire ses charges",
          link: "https://www.economie.gouv.fr/particuliers/faire-des-economies-denergie/nos-conseils-pour-reduire-sa-facture-delectricite",
          description: "Conseils pour diminuer vos factures d'énergie"
        },
        {
          title: "Négocier son loyer",
          link: "https://www.service-public.fr/particuliers/vosdroits/F1314",
          description: "Vos droits et recours en tant que locataire"
        },
        {
          title: "Action Logement",
          link: "https://www.actionlogement.fr/",
          description: "Solutions de logement abordable"
        }
      ];
    } else {
      return [
        {
          title: "Housing Benefits",
          link: "https://www.caf.fr/allocataires/aides-et-demarches/droits-et-prestations/logement/les-aides-au-logement",
          description: "Check your eligibility for housing assistance"
        },
        {
          title: "Reduce Expenses",
          link: "https://www.economie.gouv.fr/particuliers/reduire-facture-energie",
          description: "Tips to lower your utility bills"
        },
        {
          title: "Negotiate Rent",
          link: "https://www.service-public.fr/particuliers/vosdroits/F1314",
          description: "Your rights as a tenant"
        },
        {
          title: "Affordable Housing",
          link: "https://www.actionlogement.fr/",
          description: "Affordable housing solutions"
        }
      ];
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${
      debtRatio < 30 ? 'bg-green-900/20 border-green-600' :
      debtRatio <= 33 ? 'bg-yellow-900/20 border-yellow-600' :
      'bg-red-900/20 border-red-600'
    }`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{getStatusIcon()}</span>
        <div className="flex-1">
          <h4 className={`font-semibold mb-1 ${getStatusColor()}`}>
            {isHousingSpecific ? 
              t('expenses.housingAffordability', 'Analyse du taux d\'endettement') :
              t('expenses.debtRatioAnalysis', 'Analyse du taux d\'endettement')
            }
          </h4>
          <p className="text-sm text-obsidian-text-muted">
            {getStatusMessage()}
          </p>
          
          {debtRatio > 33 && (
            <button
              onClick={() => setShowTips(!showTips)}
              className="mt-3 text-sm text-obsidian-accent hover:underline"
            >
              {showTips 
                ? t('expenses.hideTips', 'Masquer les conseils')
                : t('expenses.showTips', 'Voir des conseils pour réduire vos charges')
              }
            </button>
          )}
        </div>
      </div>

      {showTips && debtRatio > 33 && (
        <div className="mt-4 pt-4 border-t border-obsidian-border/50">
          <h5 className="text-sm font-medium text-obsidian-text mb-3">
            {t('expenses.helpfulResources', 'Ressources utiles')}:
          </h5>
          <div className="space-y-2">
            {getTips().map((tip, index) => (
              <a
                key={index}
                href={tip.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-obsidian-bg rounded hover:bg-obsidian-bg-secondary transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h6 className="text-sm font-medium text-obsidian-accent">
                      {tip.title}
                    </h6>
                    <p className="text-xs text-obsidian-text-muted mt-1">
                      {tip.description}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-obsidian-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-obsidian-border/50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-obsidian-text-muted">
            {t('expenses.recommendedMax', 'Maximum recommandé')}:
          </span>
          <span className="font-medium text-obsidian-text">
            33% ({language === 'fr' ? 'France' : 'General guideline'})
          </span>
        </div>
        <div className="mt-2">
          <div className="w-full bg-obsidian-bg rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                debtRatio < 30 ? 'bg-green-500' :
                debtRatio <= 33 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${Math.min(debtRatio, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-obsidian-text-muted mt-1">
            <span>0%</span>
            <span className="text-yellow-400">33%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}