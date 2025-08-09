import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';
import ConfirmModal from '../common/ConfirmModal';

export default function RecurringView() {
  const { t } = useLanguage();
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category_id: 1,
    subcategory: '',
    day_of_month: 1
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const fixedSubcategories = [
    t('expenses.housing'),
    t('expenses.car'),
    t('expenses.credit'),
    t('expenses.health'),
    t('expenses.servers'),
    t('expenses.subscriptions'),
    t('expenses.other')
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
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = t('expenses.descriptionRequired');
    }
    
    const amountNum = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = t('expenses.amountInvalid');
    }
    
    if (formData.day_of_month < 1 || formData.day_of_month > 31) {
      newErrors.day_of_month = t('recurring.invalidDay');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await api.createRecurringExpense({
        ...formData,
        amount: parseFloat(formData.amount),
        start_date: new Date().toISOString().split('T')[0]
      });
      
      setFormData({
        description: '',
        amount: '',
        category_id: 1,
        subcategory: '',
        day_of_month: 1
      });
      setShowAddForm(false);
      setErrors({});
      await loadRecurringExpenses();
    } catch (err) {
      console.error('Failed to create recurring expense:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteRecurringExpense(id);
      await loadRecurringExpenses();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete recurring expense:', err);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-obsidian-text-muted">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-obsidian-text">{t('recurring.pageTitle', 'Dépenses Récurrentes')}</h1>
        <p className="text-obsidian-text-muted mt-2">
          {t('recurring.pageDescription', 'Gérez vos dépenses fixes mensuelles. Ces dépenses peuvent être appliquées automatiquement à chaque mois.')}
        </p>
      </div>

      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-obsidian-text">{t('recurring.templates', 'Templates de dépenses')}</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary"
          >
            {showAddForm ? t('cancel') : t('recurring.addRecurringExpense', 'Ajouter une dépense récurrente')}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit} className="bg-obsidian-bg p-4 rounded-lg mb-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder={t('recurring.descriptionPlaceholder')}
                  maxLength="200"
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
                  value={formData.amount}
                  onChange={(e) => {
                    setFormData({ ...formData, amount: e.target.value });
                    if (errors.amount) setErrors({ ...errors, amount: '' });
                  }}
                  className={`input-field w-full ${errors.amount ? 'border-red-500' : ''}`}
                  placeholder="0.00"
                />
                {errors.amount && (
                  <p className="text-red-400 text-xs mt-1">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
                  {t('expenses.subcategory')}
                </label>
                <select
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  className="input-field w-full"
                >
                  <option value="">-- {t('common.choose', 'Choisir')} --</option>
                  {fixedSubcategories.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
                  {t('recurring.dayOfMonth')}
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.day_of_month}
                  onChange={(e) => {
                    setFormData({ ...formData, day_of_month: parseInt(e.target.value) || 1 });
                    if (errors.day_of_month) setErrors({ ...errors, day_of_month: '' });
                  }}
                  className={`input-field w-full ${errors.day_of_month ? 'border-red-500' : ''}`}
                />
                {errors.day_of_month && (
                  <p className="text-red-400 text-xs mt-1">{errors.day_of_month}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                {t('create')}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowAddForm(false);
                  setErrors({});
                }}
                className="btn-secondary"
              >
                {t('cancel')}
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {recurringExpenses.length === 0 ? (
            <p className="text-center py-8 text-obsidian-text-muted">
              {t('recurring.noRecurring')}
            </p>
          ) : (
            recurringExpenses.map(expense => (
              <div 
                key={expense.id}
                className="flex items-center justify-between p-4 bg-obsidian-bg rounded-lg border border-obsidian-border hover:border-obsidian-text-faint transition-colors"
              >
                <div className="flex-1">
                  <div className="font-semibold text-obsidian-text">
                    {expense.description}
                  </div>
                  <div className="text-sm text-obsidian-text-muted">
                    {expense.subcategory && `${expense.subcategory} • `}
                    {t('recurring.dayLabel')} {expense.day_of_month} {t('recurring.ofMonth', 'du mois')}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-yellow-400">
                    {formatCurrency(expense.amount)}
                  </span>
                  
                  <button
                    onClick={() => setDeleteConfirm(expense)}
                    className="text-obsidian-text-muted hover:text-obsidian-error transition-colors p-2"
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
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-obsidian-text mb-3">
          {t('recurring.howToTitle', 'Comment utiliser les dépenses récurrentes ?')}
        </h3>
        <ol className="space-y-2 text-obsidian-text-muted">
          <li>1. {t('recurring.howTo1', 'Ajoutez vos dépenses fixes mensuelles (loyer, abonnements, etc.)')}</li>
          <li>2. {t('recurring.howTo2', 'Naviguez vers un mois spécifique')}</li>
          <li>3. {t('recurring.howTo3', 'Cliquez sur "Dépenses récurrentes" puis "Appliquer au mois actuel"')}</li>
          <li>4. {t('recurring.howTo4', 'Les dépenses seront ajoutées automatiquement (sans doublon)')}</li>
        </ol>
      </div>

      <ConfirmModal
        isOpen={!!deleteConfirm}
        onConfirm={() => {
          if (deleteConfirm) {
            handleDelete(deleteConfirm.id);
          }
        }}
        onCancel={() => setDeleteConfirm(null)}
        title={t('recurring.deleteTitle', 'Supprimer la dépense récurrente')}
        message={deleteConfirm ? `${t('confirm.deleteExpense')} "${deleteConfirm.description}" ?` : ''}
        confirmText={t('delete')}
        cancelText={t('cancel')}
        confirmStyle="danger"
      />
    </div>
  );
}