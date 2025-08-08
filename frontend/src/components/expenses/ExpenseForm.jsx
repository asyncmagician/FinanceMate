import { useState } from 'react';

export default function ExpenseForm({ onSubmit, onClose }) {
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

  const fixedSubcategories = [
    'Logement',
    'Voiture', 
    'Crédit',
    'Santé',
    'Serveurs',
    'Abonnements',
    'Autre'
  ];

  const variableSubcategories = [
    'Courses',
    'Restaurant',
    'Sorties',
    'Essence',
    'Shopping',
    'Autre'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      subcategory: showCustomSubcategory ? formData.customSubcategory : formData.subcategory,
      amount: parseFloat(formData.amount)
    });
  };

  const handleSubcategoryChange = (value) => {
    if (value === 'Autre') {
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
          <h3 className="text-lg font-semibold text-obsidian-text">Ajouter une dépense</h3>
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
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field w-full"
                placeholder="Ex: Courses Carrefour"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
                Montant (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="input-field w-full"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
                Catégorie
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value), subcategory: '' })}
                className="input-field w-full"
              >
                <option value={1}>Fixe</option>
                <option value={2}>Variable</option>
                <option value={3}>Remboursement</option>
              </select>
            </div>

            {(formData.category_id === 1 || formData.category_id === 2) && (
              <div>
                <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
                  Sous-catégorie
                </label>
                <select
                  value={formData.subcategory}
                  onChange={(e) => handleSubcategoryChange(e.target.value)}
                  className="input-field w-full"
                >
                  <option value="">-- Choisir --</option>
                  {(formData.category_id === 1 ? fixedSubcategories : variableSubcategories).map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            )}

            {showCustomSubcategory && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
                  Nom de la sous-catégorie
                </label>
                <input
                  type="text"
                  value={formData.customSubcategory}
                  onChange={(e) => setFormData({ ...formData, customSubcategory: e.target.value })}
                  className="input-field w-full"
                  placeholder="Ex: Cadeaux"
                  required
                />
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
            <span className="text-sm text-obsidian-text">Déjà déduit de la banque</span>
          </label>

          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex-1">
              Ajouter
            </button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}