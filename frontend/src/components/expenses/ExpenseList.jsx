import { useState } from 'react';

export default function ExpenseList({ expenses, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getCategoryColor = (type) => {
    switch(type) {
      case 'fixed': return 'text-red-400';
      case 'variable': return 'text-orange-400';
      case 'reimbursement': return 'text-green-400';
      default: return 'text-obsidian-text';
    }
  };

  const handleReimbursementToggle = (expense) => {
    onUpdate(expense.id, { is_received: !expense.is_received });
  };

  const handleDeductedToggle = (expense) => {
    onUpdate(expense.id, { is_deducted: !expense.is_deducted });
  };

  const groupedExpenses = expenses.reduce((acc, expense) => {
    const type = expense.category_type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(expense);
    return acc;
  }, {});

  const categoryOrder = ['fixed', 'variable', 'reimbursement'];
  const categoryLabels = {
    fixed: 'Fixed Expenses',
    variable: 'Variable Expenses',
    reimbursement: 'Reimbursements'
  };

  return (
    <div className="space-y-6">
      {categoryOrder.map(category => {
        const categoryExpenses = groupedExpenses[category] || [];
        if (categoryExpenses.length === 0) return null;

        return (
          <div key={category}>
            <h3 className={`text-sm font-semibold mb-2 ${getCategoryColor(category)}`}>
              {categoryLabels[category]}
            </h3>
            
            <div className="space-y-2">
              {categoryExpenses.map(expense => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 bg-obsidian-bg rounded-lg border border-obsidian-border hover:border-obsidian-text-faint transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-obsidian-text-muted text-sm w-12">
                      {formatDate(expense.date)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="text-obsidian-text">{expense.description}</div>
                    </div>

                    {category === 'reimbursement' && (
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={expense.is_received}
                          onChange={() => handleReimbursementToggle(expense)}
                          className="rounded border-obsidian-border bg-obsidian-bg-secondary text-obsidian-accent focus:ring-obsidian-accent cursor-pointer"
                        />
                        <span className={expense.is_received ? 'text-green-400' : 'text-obsidian-text-muted'}>
                          {expense.is_received ? 'Reçu' : 'En attente'}
                        </span>
                      </label>
                    )}

                    <label className="flex items-center gap-2 text-sm cursor-pointer ml-4">
                      <input
                        type="checkbox"
                        checked={expense.is_deducted}
                        onChange={() => handleDeductedToggle(expense)}
                        className="rounded border-obsidian-border bg-obsidian-bg-secondary text-obsidian-accent focus:ring-obsidian-accent cursor-pointer"
                      />
                      <span className="text-obsidian-text-muted">Déduit</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    <span className={`font-semibold ${getCategoryColor(category)}`}>
                      {formatCurrency(expense.amount)}
                    </span>
                    
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="text-obsidian-text-muted hover:text-obsidian-error transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {expenses.length === 0 && (
        <div className="text-center py-8 text-obsidian-text-muted">
          No expenses for this month
        </div>
      )}
    </div>
  );
}