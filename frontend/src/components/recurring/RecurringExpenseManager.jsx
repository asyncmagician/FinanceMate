import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function RecurringExpenseManager({ onClose, onApply }) {
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category_id: 1,
    subcategory: '',
    day_of_month: 1,
    start_date: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});

  const fixedSubcategories = [
    'Logement',
    'Voiture', 
    'Crédit',
    'Santé',
    'Serveurs',
    'Abonnements'
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
      newErrors.description = 'La description est requise';
    } else if (formData.description.length > 200) {
      newErrors.description = 'Maximum 200 caractères';
    }
    
    const amountNum = parseFloat(formData.amount);
    if (!formData.amount) {
      newErrors.amount = 'Le montant est requis';
    } else if (isNaN(amountNum) || amountNum <= 0) {
      newErrors.amount = 'Montant invalide';
    } else if (amountNum > 999999) {
      newErrors.amount = 'Montant trop élevé';
    }
    
    if (formData.day_of_month < 1 || formData.day_of_month > 31) {
      newErrors.day_of_month = 'Jour invalide (1-31)';
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
        amount: parseFloat(formData.amount)
      });
      await loadRecurringExpenses();
      setShowAddForm(false);
      setFormData({
        description: '',
        amount: '',
        category_id: 1,
        subcategory: '',
        day_of_month: 1,
        start_date: new Date().toISOString().split('T')[0]
      });
      setErrors({});
    } catch (err) {
      console.error('Failed to create recurring expense:', err);
    }
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
    console.log('[RecurringExpenseManager] Applying expenses:', recurringExpenses);
    console.log('[RecurringExpenseManager] Number of expenses:', recurringExpenses.length);
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
          <h3 className="text-lg font-semibold text-obsidian-text">Gérer les dépenses récurrentes</h3>
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
            <p className="text-sm text-obsidian-text-muted">
              Ces dépenses seront automatiquement ajoutées chaque mois
            </p>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-secondary text-sm"
            >
              {showAddForm ? 'Annuler' : 'Ajouter'}
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleSubmit} className="bg-obsidian-bg p-4 rounded-lg mb-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field w-full"
                    placeholder="Description (ex: Loyer)"
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
                    placeholder="Montant"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
                    className="input-field w-full"
                  >
                    <option value={1}>Fixe</option>
                    <option value={2}>Variable</option>
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
                    placeholder="Jour du mois"
                  />
                </div>
                <button type="submit" className="btn-primary">
                  Créer
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {recurringExpenses.length === 0 ? (
            <div className="text-center py-8 text-obsidian-text-muted">
              Aucune dépense récurrente configurée
            </div>
          ) : (
            recurringExpenses.map(expense => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 bg-obsidian-bg rounded-lg border border-obsidian-border"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-obsidian-text">{expense.description}</div>
                    <div className="text-sm text-obsidian-text-muted">
                      Jour {expense.day_of_month} • {expense.category_type === 'fixed' ? 'Fixe' : 'Variable'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-obsidian-accent">
                    {formatCurrency(expense.amount)}
                  </span>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="text-obsidian-text-muted hover:text-obsidian-error transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            Appliquer au mois actuel
          </button>
          <button onClick={onClose} className="btn-secondary flex-1">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}