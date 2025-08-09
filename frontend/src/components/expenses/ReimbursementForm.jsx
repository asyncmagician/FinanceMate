import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ReimbursementForm({ onSubmit, onClose }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    day: new Date().getDate(),
    is_received: false
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = t('expenses.descriptionRequired');
    } else if (formData.description.length > 200) {
      newErrors.description = t('expenses.descriptionTooLong');
    }
    
    const amount = parseFloat(formData.amount);
    if (!formData.amount) {
      newErrors.amount = t('expenses.amountRequired');
    } else if (isNaN(amount)) {
      newErrors.amount = t('expenses.amountInvalid');
    } else if (amount <= 0) {
      newErrors.amount = t('expenses.amountTooSmall');
    } else if (amount > 999999) {
      newErrors.amount = t('expenses.amountTooLarge');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        category_id: 3, // Reimbursement category ID
        day: formData.day,
        is_received: formData.is_received,
        is_deducted: false // Reimbursements don't need deducted flag
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full">
        <h2 className="text-xl font-semibold text-obsidian-text mb-4">
          {t('reimbursement.addTitle', 'Ajouter un remboursement')}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
              {t('expenses.description')}
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field w-full"
              placeholder={t('reimbursement.descriptionPlaceholder', 'Description du remboursement')}
              maxLength="200"
            />
            {errors.description && (
              <p className="text-red-400 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
              {t('expenses.amount')} (EUR)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="input-field w-full"
              placeholder={t('expenses.amountPlaceholder')}
            />
            {errors.amount && (
              <p className="text-red-400 text-xs mt-1">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
              {t('expenses.day')}
            </label>
            <input
              type="number"
              min="1"
              max="31"
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: parseInt(e.target.value) || 1 })}
              className="input-field w-full"
            />
          </div>

          <div className="bg-obsidian-bg-secondary p-3 rounded-lg">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_received}
                onChange={(e) => setFormData({ ...formData, is_received: e.target.checked })}
                className="rounded border-obsidian-border bg-obsidian-bg-secondary text-obsidian-accent focus:ring-obsidian-accent cursor-pointer"
              />
              <div>
                <span className="text-sm text-obsidian-text">
                  {t('reimbursement.markAsReceived', 'Marquer comme reçu')}
                </span>
                <p className="text-xs text-obsidian-text-muted mt-1">
                  {formData.is_received ? 
                    t('reimbursement.receivedInfo', 'Le remboursement sera ajouté au prévisionnel final') :
                    t('reimbursement.pendingInfo', 'Le remboursement sera affiché entre parenthèses (+montant)')
                  }
                </p>
              </div>
            </label>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex-1">
              {t('common.add', 'Ajouter')}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}