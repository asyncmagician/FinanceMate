import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ExpenseSharing({ shareData, onShareChange, totalAmount }) {
  const { t } = useLanguage();
  const [isShared, setIsShared] = useState(shareData?.share_type !== 'none' && shareData?.share_type);
  const [shareType, setShareType] = useState(shareData?.share_type || 'equal');
  const [shareValue, setShareValue] = useState(shareData?.share_value || '');
  const [shareWith, setShareWith] = useState(shareData?.share_with || '');
  const [userAmount, setUserAmount] = useState(totalAmount);

  // Update state when shareData prop changes (e.g., when switching from add to edit)
  useEffect(() => {
    const hasShareData = shareData?.share_type && shareData.share_type !== 'none';
    setIsShared(hasShareData);
    setShareType(hasShareData ? shareData.share_type : 'equal');
    setShareValue(shareData?.share_value || '');
    setShareWith(shareData?.share_with || '');
  }, [shareData]);

  useEffect(() => {
    calculateUserAmount();
  }, [totalAmount, isShared, shareType, shareValue, shareWith]);

  const calculateUserAmount = () => {
    if (!isShared || !totalAmount) {
      setUserAmount(totalAmount);
      return;
    }

    const total = parseFloat(totalAmount);
    if (isNaN(total)) {
      setUserAmount(0);
      return;
    }

    let calculatedAmount = total;
    
    switch (shareType) {
      case 'equal':
        calculatedAmount = total / 2;
        break;
      case 'percentage':
        const percentage = parseFloat(shareValue) || 50;
        calculatedAmount = (total * percentage) / 100;
        break;
      case 'amount':
        calculatedAmount = parseFloat(shareValue) || total;
        break;
      default:
        calculatedAmount = total;
    }

    setUserAmount(calculatedAmount);
    
    // Notify parent component
    onShareChange({
      share_type: isShared ? shareType : 'none',
      share_value: isShared ? (shareType === 'equal' ? null : shareValue) : null,
      share_with: isShared ? shareWith : null,
      user_amount: calculatedAmount
    });
  };

  const handleShareToggle = () => {
    const newIsShared = !isShared;
    setIsShared(newIsShared);
    if (!newIsShared) {
      setShareType('equal');
      setShareValue('');
      setShareWith('');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isShared}
            onChange={handleShareToggle}
            className="mr-2"
          />
          <span className="text-sm text-obsidian-text">
            {t('expenses.sharedExpense', 'Dépense partagée')}
          </span>
        </label>
        
        {isShared && userAmount !== totalAmount && (
          <span className="text-sm font-medium text-obsidian-accent">
            {t('expenses.yourPart', 'Votre part')}: {formatCurrency(userAmount)}
          </span>
        )}
      </div>

      {isShared && (
        <div className="pl-6 space-y-3 animate-fadeIn">
          <div>
            <label className="block text-xs text-obsidian-text-muted mb-1">
              {t('expenses.splitType', 'Type de partage')}
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShareType('equal');
                  setShareValue('');
                }}
                className={`px-3 py-1 text-xs rounded ${
                  shareType === 'equal' 
                    ? 'bg-obsidian-accent text-obsidian-bg' 
                    : 'bg-obsidian-bg-secondary text-obsidian-text-muted'
                }`}
              >
                50/50
              </button>
              <button
                type="button"
                onClick={() => setShareType('percentage')}
                className={`px-3 py-1 text-xs rounded ${
                  shareType === 'percentage' 
                    ? 'bg-obsidian-accent text-obsidian-bg' 
                    : 'bg-obsidian-bg-secondary text-obsidian-text-muted'
                }`}
              >
                %
              </button>
              <button
                type="button"
                onClick={() => setShareType('amount')}
                className={`px-3 py-1 text-xs rounded ${
                  shareType === 'amount' 
                    ? 'bg-obsidian-accent text-obsidian-bg' 
                    : 'bg-obsidian-bg-secondary text-obsidian-text-muted'
                }`}
              >
                €
              </button>
            </div>
          </div>

          {shareType === 'percentage' && (
            <div>
              <label className="block text-xs text-obsidian-text-muted mb-1">
                {t('expenses.yourPercentage', 'Votre pourcentage')}
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={shareValue}
                onChange={(e) => setShareValue(e.target.value)}
                className="input-field w-full text-sm"
                placeholder="50"
              />
            </div>
          )}

          {shareType === 'amount' && (
            <div>
              <label className="block text-xs text-obsidian-text-muted mb-1">
                {t('expenses.yourAmount', 'Votre montant')}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={shareValue}
                onChange={(e) => setShareValue(e.target.value)}
                className="input-field w-full text-sm"
                placeholder={formatCurrency(totalAmount / 2).replace('€', '').trim()}
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-obsidian-text-muted mb-1">
              {t('expenses.sharedWith', 'Partagé avec')} <span className="text-obsidian-error">*</span>
            </label>
            <input
              type="text"
              value={shareWith}
              onChange={(e) => setShareWith(e.target.value)}
              className="input-field w-full text-sm"
              placeholder={t('expenses.partnerName', 'Nom du partenaire')}
              maxLength="100"
              required
            />
            <p className="text-xs text-obsidian-text-faint mt-1">
              {t('expenses.partnerRequired', 'Requis pour créer automatiquement les remboursements')}
            </p>
          </div>

          {shareType !== 'equal' && totalAmount && (
            <div className="text-xs text-obsidian-text-muted p-2 bg-obsidian-bg rounded">
              {shareType === 'percentage' && (
                <>
                  {t('expenses.splitBreakdown', 'Répartition')}: {t('expenses.you', 'Vous')} {shareValue || 50}% 
                  ({formatCurrency(userAmount)}) / {shareWith || t('expenses.partner', 'Partenaire')} {100 - (parseFloat(shareValue) || 50)}% 
                  ({formatCurrency(totalAmount - userAmount)})
                </>
              )}
              {shareType === 'amount' && (
                <>
                  {t('expenses.splitBreakdown', 'Répartition')}: {t('expenses.you', 'Vous')} {formatCurrency(userAmount)} / 
                  {shareWith || t('expenses.partner', 'Partenaire')} {formatCurrency(totalAmount - userAmount)}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}