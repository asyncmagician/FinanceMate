import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';
import ExpenseSharing from '../expenses/ExpenseSharing';

export default function RecurringExpenseManager({ onClose, onApply }) {
  const { t } = useLanguage();
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [shareData, setShareData] = useState({});
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category_id: 1,
    subcategory: '',
    day_of_month: 1,
    start_date: new Date().toISOString().split('T')[0],
    share_type: 'none',
    share_value: '',
    share_with: ''
  });
  const [errors, setErrors] = useState({});

  const fixedSubcategories = [
    t('expenses.housing'),
    t('expenses.car'),
    t('expenses.credit'),
    t('expenses.health'),
    t('expenses.servers'),
    t('expenses.subscriptions')
  ];

  useEffect(() => {
    loadRecurringExpenses();
  }, []);

  const loadRecurringExpenses = async () => {
    try {
      const data = await api.getRecurringExpenses();
      setRecurringExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load recurring expenses:', err);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = t('expenses.descriptionRequired');
    } else if (formData.description.length > 200) {
      newErrors.description = t('expenses.descriptionTooLong');
    }
    
    const amountNum = parseFloat(formData.amount);
    if (!formData.amount) {
      newErrors.amount = t('expenses.amountRequired');
    } else if (isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = t('expenses.amountInvalid');
    } else if (amountNum > 999999) {
      newErrors.amount = t('expenses.amountTooLarge');
    }
    
    if (formData.day_of_month < 1 || formData.day_of_month > 31) {
      newErrors.day_of_month = t('recurring.invalidDay', 'Jour invalide (1-31)');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const finalAmount = shareData.user_amount || parseFloat(formData.amount);
    
    try {
      if (editingId) {
        await api.updateRecurringExpense(editingId, {
          ...formData,
          amount: finalAmount,
          share_type: shareData.share_type || 'none',
          share_value: shareData.share_value,
          share_with: shareData.share_with,
          full_amount: parseFloat(formData.amount)
        });
      } else {
        await api.createRecurringExpense({
          ...formData,
          amount: finalAmount,
          share_type: shareData.share_type || 'none',
          share_value: shareData.share_value,
          share_with: shareData.share_with,
          full_amount: parseFloat(formData.amount)
        });
      }
      await loadRecurringExpenses();
      setShowAddForm(false);
      setEditingId(null);
      setFormData({
        description: '',
        amount: '',
        category_id: 1,
        subcategory: '',
        day_of_month: 1,
        start_date: new Date().toISOString().split('T')[0],
        share_type: 'none',
        share_value: '',
        share_with: ''
      });
      setErrors({});
    } catch (err) {
      console.error('Failed to save recurring expense:', err);
    }
  };

  const handleEdit = (expense) => {
    setFormData({
      description: expense.description,
      amount: expense.amount,
      category_id: expense.category_id,
      subcategory: expense.subcategory || '',
      day_of_month: expense.day_of_month,
      start_date: expense.start_date ? expense.start_date.split('T')[0] : new Date().toISOString().split('T')[0],
      share_type: expense.share_type || 'none',
      share_value: expense.share_value || '',
      share_with: expense.share_with || ''
    });
    setEditingId(expense.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteRecurringExpense(id);
      await loadRecurringExpenses();
    } catch (err) {
      console.error('Failed to delete recurring expense:', err);
    }
  };

  const handleApplyToMonth = () => {
    if (recurringExpenses && recurringExpenses.length > 0) {
      onApply(recurringExpenses);
    }
    onClose();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="card w-full max-w-3xl my-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-obsidian-text">{t('recurring.title')}</h3>
          <button
            onClick={onClose}
            className="text-obsidian-text-muted hover:text-obsidian-text"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs sm:text-sm text-obsidian-text-muted">
              {t('recurring.description')}
            </p>
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                if (showAddForm) {
                  setEditingId(null);
                  setFormData({
                    description: '',
                    amount: '',
                    category_id: 1,
                    subcategory: '',
                    day_of_month: 1,
                    start_date: new Date().toISOString().split('T')[0],
                    share_type: 'none',
                    share_value: '',
                    share_with: ''
                  });
                }
              }}
              className="btn-secondary p-2 sm:px-4 text-sm"
              title={editingId ? t('recurring.cancelEdit', 'Annuler l\'édition') : (showAddForm ? t('cancel') : t('recurring.add'))}
            >
              <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d={showAddForm || editingId ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
              </svg>
              <span className="hidden sm:inline">
                {editingId ? t('recurring.cancelEdit', 'Annuler l\'édition') : (showAddForm ? t('cancel') : t('recurring.add'))}
              </span>
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleSubmit} className="bg-obsidian-bg p-4 rounded-lg mb-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field w-full"
                    placeholder={t('recurring.descriptionPlaceholder', 'Description (ex: Loyer)')}
                    required
                  />
                </div>
                <div>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="input-field w-full"
                    placeholder={t('expenses.amount')}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
                    className="input-field w-full"
                  >
                    <option value={1}>{t('expenses.fixed').replace(' Expenses', '').replace(' Dépenses', '')}</option>
                    <option value={2}>{t('expenses.variable').replace(' Expenses', '').replace(' Dépenses', '')}</option>
                  </select>
                </div>
                <div>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.day_of_month}
                    onChange={(e) => setFormData({ ...formData, day_of_month: parseInt(e.target.value) })}
                    className="input-field w-full"
                    placeholder={t('recurring.dayOfMonth')}
                  />
                </div>
                <button type="submit" className="btn-primary">
                  {editingId ? t('edit') : t('create')}
                </button>
              </div>
              
              {formData.category_id === 1 && formData.amount && (
                <div className="mt-4">
                  <ExpenseSharing
                    shareData={shareData}
                    onShareChange={setShareData}
                    totalAmount={parseFloat(formData.amount) || 0}
                  />
                </div>
              )}
            </form>
          )}
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {recurringExpenses.length === 0 ? (
            <div className="text-center py-8 text-obsidian-text-muted">
              {t('recurring.noRecurring')}
            </div>
          ) : (
            recurringExpenses.map(expense => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 bg-obsidian-bg rounded-lg border border-obsidian-border"
              >
                <div className="flex-1">
                  <div className="text-sm sm:text-base text-obsidian-text">{expense.description}</div>
                  <div className="text-xs sm:text-sm text-obsidian-text-muted">
                    {t('recurring.dayLabel', 'Jour')} {expense.day_of_month} • {expense.category_type === 'fixed' ? t('expenses.fixed').replace(' Expenses', '').replace(' Dépenses', '') : t('expenses.variable').replace(' Expenses', '').replace(' Dépenses', '')}
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="font-semibold text-obsidian-accent text-sm sm:text-base">
                    {formatCurrency(expense.amount)}
                  </span>
                  <button
                    onClick={() => handleEdit(expense)}
                    className="p-1 text-obsidian-text-muted hover:text-obsidian-accent transition-colors"
                    title={t('edit')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="p-1 text-obsidian-text-muted hover:text-obsidian-error transition-colors"
                    title={t('delete')}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleApplyToMonth}
            className="btn-primary flex-1"
            disabled={recurringExpenses.length === 0}
          >
            {t('recurring.apply')}
          </button>
          <button onClick={onClose} className="btn-secondary flex-1">
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}