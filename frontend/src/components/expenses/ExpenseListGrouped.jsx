import { useState } from 'react';

export default function ExpenseListGrouped({ expenses, onUpdate, onDelete }) {
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

  // Group expenses by category and subcategory
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const type = expense.category_type;
    const subcategory = expense.subcategory || 'Sans catégorie';
    
    if (!acc[type]) acc[type] = {};
    if (!acc[type][subcategory]) acc[type][subcategory] = [];
    
    acc[type][subcategory].push(expense);
    return acc;
  }, {});

  const categoryOrder = ['fixed', 'variable', 'reimbursement'];
  const categoryLabels = {
    fixed: 'Dépenses Fixes',
    variable: 'Dépenses Variables',
    reimbursement: 'Remboursements'
  };

  // Predefined subcategory order for fixed expenses
  const fixedSubcategoryOrder = [
    'Logement',
    'Voiture',
    'Crédit',
    'Santé',
    'Serveurs',
    'Abonnements',
    'Sans catégorie'
  ];

  const sortSubcategories = (a, b, categoryType) => {
    if (categoryType === 'fixed') {
      const indexA = fixedSubcategoryOrder.indexOf(a);
      const indexB = fixedSubcategoryOrder.indexOf(b);
      
      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    }
    return a.localeCompare(b);
  };

  return (
    <div className="space-y-6">
      {categoryOrder.map(category => {
        const categoryData = groupedExpenses[category];
        if (!categoryData) return null;

        const categoryTotal = Object.values(categoryData)
          .flat()
          .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

        return (
          <div key={category}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-lg font-semibold ${getCategoryColor(category)}`}>
                {categoryLabels[category]}
              </h3>
              <span className={`text-lg font-bold ${getCategoryColor(category)}`}>
                Total: {formatCurrency(categoryTotal)}
              </span>
            </div>
            
            <div className="ml-4 space-y-4">
              {Object.keys(categoryData)
                .sort((a, b) => sortSubcategories(a, b, category))
                .map(subcategory => {
                  const subcategoryExpenses = categoryData[subcategory];
                  const subcategoryTotal = subcategoryExpenses.reduce(
                    (sum, expense) => sum + parseFloat(expense.amount), 
                    0
                  );

                  return (
                    <div key={subcategory} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-obsidian-text-muted">
                          {subcategory}
                        </h4>
                        <span className="text-sm font-semibold text-blue-400">
                          {formatCurrency(subcategoryTotal)}
                        </span>
                      </div>
                      
                      <div className="ml-4 space-y-1">
                        {subcategoryExpenses.map(expense => (
                          <div
                            key={expense.id}
                            className="flex items-center justify-between p-2 bg-obsidian-bg rounded-lg border border-obsidian-border hover:border-obsidian-text-faint transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <label className="flex items-center gap-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={expense.is_deducted}
                                  onChange={() => handleDeductedToggle(expense)}
                                  className="rounded border-obsidian-border bg-obsidian-bg-secondary text-obsidian-accent focus:ring-obsidian-accent cursor-pointer"
                                />
                              </label>
                              
                              <div className="flex-1">
                                <span className="text-obsidian-text">{expense.description}</span>
                              </div>

                              {category === 'reimbursement' && (
                                <label className="flex items-center gap-2 text-sm cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={expense.is_received}
                                    onChange={() => handleReimbursementToggle(expense)}
                                    className="rounded border-obsidian-border bg-obsidian-bg-secondary text-green-400 focus:ring-green-400 cursor-pointer"
                                  />
                                  <span className={expense.is_received ? 'text-green-400' : 'text-obsidian-text-muted'}>
                                    {expense.is_received ? 'Reçu' : 'En attente'}
                                  </span>
                                </label>
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              <span className={`font-semibold text-yellow-400`}>
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
            </div>
          </div>
        );
      })}

      {expenses.length === 0 && (
        <div className="text-center py-8 text-obsidian-text-muted">
          Aucune dépense pour ce mois
        </div>
      )}
    </div>
  );
}