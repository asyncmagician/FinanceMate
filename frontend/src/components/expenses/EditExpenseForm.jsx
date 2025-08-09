import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function EditExpenseForm({ expense, onSubmit, onClose }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category_id: 1,
    subcategory: '',
    is_deducted: false,
    is_received: false
  });
  const [errors, setErrors] = useState({});

  const subcategoriesFixed = [
    t('expenses.housing'),
    t('expenses.car'),
    t('expenses.credit'),
    t('expenses.health'),
    t('expenses.servers'),
    t('expenses.subscriptions'),
    t('expenses.subcategoryOther')
  ];

  const subcategoriesVariable = [
    t('expenses.groceries'),
    t('expenses.restaurant'),
    t('expenses.outings'),
    t('expenses.gas'),
    t('expenses.shopping'),
    t('expenses.subcategoryOther')
  ];

  useEffect(() => {
    if (expense) {
      setFormData({
        description: expense.description || '',
        amount: expense.amount || '',
        category_id: expense.category_id || 1,
        subcategory: expense.subcategory || '',
        is_deducted: Boolean(expense.is_deducted),
        is_received: Boolean(expense.is_received)
      });
    }
  }, [expense]);

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
    
    if (formData.subcategory === t('expenses.subcategoryOther') && !formData.customSubcategory?.trim()) {
      newErrors.customSubcategory = t('expenses.subcategoryRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const finalSubcategory = formData.subcategory === t('expenses.subcategoryOther') 
        ? formData.customSubcategory?.trim() 
        : formData.subcategory;
      
      onSubmit({
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        category_id: formData.category_id,
        subcategory: finalSubcategory || null,
        is_deducted: formData.is_deducted,
        is_received: formData.is_received
      });
    }
  };

  const handleCategoryChange = (e) => {
    const newCategoryId = parseInt(e.target.value);
    setFormData({ 
      ...formData, 
      category_id: newCategoryId, 
      subcategory: '',
      customSubcategory: ''
    });
  };

  const getSubcategoriesForCategory = () => {
    if (formData.category_id === 1) return subcategoriesFixed;
    if (formData.category_id === 2) return subcategoriesVariable;
    return [];
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-obsidian-text">{t('expenses.edit')}</h3>
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
          <div>
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
              onChange={(e) => {
                setFormData({ ...formData, amount: e.target.value });
                if (errors.amount) setErrors({ ...errors, amount: '' });
              }}
              className={`input-field w-full ${errors.amount ? 'border-red-500' : ''}`}
              placeholder={t('expenses.amountPlaceholder')}
            />
            {errors.amount && (
              <p className="text-red-400 text-xs mt-1">{errors.amount}</p>
            )}
          </div>

          {formData.category_id !== 3 && (
            <>
              <div>
                <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
                  {t('expenses.category')}
                </label>
                <select
                  value={formData.category_id}
                  onChange={handleCategoryChange}
                  className="input-field w-full"
                >
                  <option value={1}>{t('expenses.fixed')}</option>
                  <option value={2}>{t('expenses.variable')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
                  {t('expenses.subcategory')}
                </label>
                <select
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value, customSubcategory: '' })}
                  className="input-field w-full"
                >
                  <option value="">{t('common.select', 'Sélectionner')}</option>
                  {getSubcategoriesForCategory().map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {formData.subcategory === t('expenses.subcategoryOther') && (
                <div>
                  <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
                    {t('expenses.customSubcategory')}
                  </label>
                  <input
                    type="text"
                    value={formData.customSubcategory || ''}
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
            </>
          )}

          {formData.category_id !== 3 && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_deducted}
                onChange={(e) => setFormData({ ...formData, is_deducted: e.target.checked })}
                className="rounded border-obsidian-border bg-obsidian-bg-secondary text-obsidian-accent focus:ring-obsidian-accent cursor-pointer"
              />
              <span className="text-sm text-obsidian-text">{t('expenses.alreadyDeducted')}</span>
            </label>
          )}

          {formData.category_id === 3 && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_received}
                onChange={(e) => setFormData({ ...formData, is_received: e.target.checked })}
                className="rounded border-obsidian-border bg-obsidian-bg-secondary text-green-400 focus:ring-green-400 cursor-pointer"
              />
              <span className="text-sm text-obsidian-text">
                {formData.is_received ? t('expenses.received') : t('expenses.pending')}
              </span>
            </label>
          )}

          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex-1">
              {t('save')}
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