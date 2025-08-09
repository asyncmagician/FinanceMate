import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ExpenseForm({ onSubmit, onClose }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category_id: 2,  // Default to Variable
    subcategory: '',
    customSubcategory: '',
    day: new Date().getDate(),
    is_deducted: false
  });
  const [showCustomSubcategory, setShowCustomSubcategory] = useState(false);
  const [errors, setErrors] = useState({});

  const fixedSubcategories = [
    t('expenses.housing'),
    t('expenses.car'), 
    t('expenses.credit'),
    t('expenses.health'),
    t('expenses.servers'),
    t('expenses.subscriptions'),
    t('expenses.other')
  ];

  const variableSubcategories = [
    t('expenses.groceries'),
    t('expenses.restaurant'),
    t('expenses.outings'),
    t('expenses.gas'),
    t('expenses.shopping'),
    t('expenses.other')
  ];

  const validateForm = () => {
    const newErrors = {};
    
    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = t('expenses.descriptionRequired');
    } else if (formData.description.length > 200) {
      newErrors.description = t('expenses.descriptionTooLong');
    }
    
    // Validate amount
    const amountNum = parseFloat(formData.amount);
    if (!formData.amount) {
      newErrors.amount = t('expenses.amountRequired');
    } else if (isNaN(amountNum)) {
      newErrors.amount = t('expenses.amountInvalid');
    } else if (amountNum <= 0) {
      newErrors.amount = t('expenses.amountTooSmall');
    } else if (amountNum > 999999) {
      newErrors.amount = t('expenses.amountTooLarge');
    }
    
    // Validate custom subcategory if shown
    if (showCustomSubcategory && !formData.customSubcategory.trim()) {
      newErrors.customSubcategory = t('expenses.subcategoryRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit({
      ...formData,
      subcategory: showCustomSubcategory ? formData.customSubcategory : formData.subcategory,
      amount: parseFloat(formData.amount)
    });
  };

  const handleSubcategoryChange = (value) => {
    if (value === t('expenses.other')) {
      setShowCustomSubcategory(true);
      setFormData({ ...formData, subcategory: value, customSubcategory: '' });
    } else {
      setShowCustomSubcategory(false);
      setFormData({ ...formData, subcategory: value, customSubcategory: '' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-obsidian-text">{t('expenses.addExpenseTitle')}</h3>
          <button
            onClick={onClose}
            className="text-obsidian-text-muted hover:text-obsidian-text"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
                {t('expenses.description')}
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (errors.description) setErrors({ ...errors, description: '' });
                }}
                className={`input-field w-full ${errors.description ? 'border-red-500' : ''}`}
                placeholder={t('expenses.descriptionPlaceholder')}
                maxLength="200"
                required
                autoFocus
              />
              {errors.description && (
                <p className="text-red-400 text-xs mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
                {t('expenses.amount')} (€)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="999999"
                value={formData.amount}
                onChange={(e) => {
                  setFormData({ ...formData, amount: e.target.value });
                  if (errors.amount) setErrors({ ...errors, amount: '' });
                }}
                className={`input-field w-full ${errors.amount ? 'border-red-500' : ''}`}
                placeholder={t('expenses.amountPlaceholder')}
                required
              />
              {errors.amount && (
                <p className="text-red-400 text-xs mt-1">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
                {t('expenses.category')}
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value), subcategory: '' })}
                className="input-field w-full"
              >
                <option value={1}>{t('expenses.fixed').replace(' Expenses', '').replace(' Dépenses', '')}</option>
                <option value={2}>{t('expenses.variable').replace(' Expenses', '').replace(' Dépenses', '')}</option>
                <option value={3}>{t('expenses.reimbursement')}</option>
              </select>
            </div>

            {(formData.category_id === 1 || formData.category_id === 2) && (
              <div>
                <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
                  {t('expenses.subcategory')}
                </label>
                <select
                  value={formData.subcategory}
                  onChange={(e) => handleSubcategoryChange(e.target.value)}
                  className="input-field w-full"
                >
                  <option value="">-- {t('common.choose', 'Choisir')} --</option>
                  {(formData.category_id === 1 ? fixedSubcategories : variableSubcategories).map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            )}

            {showCustomSubcategory && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
                  {t('expenses.customSubcategory')}
                </label>
                <input
                  type="text"
                  value={formData.customSubcategory}
                  onChange={(e) => {
                    setFormData({ ...formData, customSubcategory: e.target.value });
                    if (errors.customSubcategory) setErrors({ ...errors, customSubcategory: '' });
                  }}
                  className={`input-field w-full ${errors.customSubcategory ? 'border-red-500' : ''}`}
                  placeholder={t('expenses.customSubcategoryPlaceholder')}
                  maxLength="100"
                  required
                />
                {errors.customSubcategory && (
                  <p className="text-red-400 text-xs mt-1">{errors.customSubcategory}</p>
                )}
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_deducted}
              onChange={(e) => setFormData({ ...formData, is_deducted: e.target.checked })}
              className="rounded border-obsidian-border bg-obsidian-bg-secondary text-obsidian-accent focus:ring-obsidian-accent cursor-pointer"
            />
            <span className="text-sm text-obsidian-text">{t('expenses.alreadyDeducted', 'Déjà déduit de la banque')}</span>
          </label>

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