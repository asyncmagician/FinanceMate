import { useState } from 'react';

export default function ShareExpenseModal({ expense, onSave, onClose }) {
  const [shareData, setShareData] = useState({
    share_type: expense?.share_type || 'none',
    share_value: expense?.share_value || '',
    share_with: expense?.share_with || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate based on share type
    if (shareData.share_type === 'percentage') {
      const value = parseFloat(shareData.share_value);
      if (isNaN(value) || value <= 0 || value > 100) {
        alert('Le pourcentage doit être entre 0 et 100');
        return;
      }
    } else if (shareData.share_type === 'amount') {
      const value = parseFloat(shareData.share_value);
      if (isNaN(value) || value <= 0 || value > expense.amount) {
        alert('Le montant doit être valide et inférieur au montant total');
        return;
      }
    }
    
    onSave(shareData);
  };

  const calculateReimbursement = () => {
    if (!expense) return 0;
    const amount = parseFloat(expense.amount);
    
    if (shareData.share_type === 'equal') {
      return amount / 2;
    } else if (shareData.share_type === 'percentage' && shareData.share_value) {
      return amount * (parseFloat(shareData.share_value) / 100);
    } else if (shareData.share_type === 'amount' && shareData.share_value) {
      return parseFloat(shareData.share_value);
    }
    return 0;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-obsidian-bg-secondary rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-obsidian-text mb-4">
          Partager la dépense
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-obsidian-text-muted mb-2">
              Type de partage
            </label>
            <select
              value={shareData.share_type}
              onChange={(e) => setShareData({ ...shareData, share_type: e.target.value, share_value: '' })}
              className="input-field w-full"
            >
              <option value="none">Pas de partage</option>
              <option value="equal">50/50 (partage égal)</option>
              <option value="percentage">Pourcentage</option>
              <option value="amount">Montant fixe</option>
            </select>
          </div>

          {shareData.share_type === 'percentage' && (
            <div>
              <label className="block text-sm font-medium text-obsidian-text-muted mb-2">
                Pourcentage remboursé (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={shareData.share_value}
                onChange={(e) => setShareData({ ...shareData, share_value: e.target.value })}
                className="input-field w-full"
                required
              />
            </div>
          )}

          {shareData.share_type === 'amount' && (
            <div>
              <label className="block text-sm font-medium text-obsidian-text-muted mb-2">
                Montant remboursé (€)
              </label>
              <input
                type="number"
                min="0"
                max={expense?.amount || 999999}
                step="0.01"
                value={shareData.share_value}
                onChange={(e) => setShareData({ ...shareData, share_value: e.target.value })}
                className="input-field w-full"
                required
              />
            </div>
          )}

          {shareData.share_type !== 'none' && (
            <>
              <div>
                <label className="block text-sm font-medium text-obsidian-text-muted mb-2">
                  Partagé avec (optionnel)
                </label>
                <input
                  type="text"
                  value={shareData.share_with}
                  onChange={(e) => setShareData({ ...shareData, share_with: e.target.value })}
                  className="input-field w-full"
                  placeholder="Nom de la personne"
                />
              </div>

              <div className="bg-obsidian-bg rounded p-3">
                <p className="text-sm text-obsidian-text-muted">
                  Montant total: <span className="text-obsidian-text font-semibold">{expense?.amount} €</span>
                </p>
                <p className="text-sm text-obsidian-text-muted">
                  Remboursement prévu: <span className="text-green-400 font-semibold">{calculateReimbursement().toFixed(2)} €</span>
                </p>
                <p className="text-sm text-obsidian-text-muted">
                  Reste à charge: <span className="text-obsidian-text font-semibold">{(expense?.amount - calculateReimbursement()).toFixed(2)} €</span>
                </p>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="btn-primary flex-1"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}