import { useState, useEffect } from 'react';

export default function ConfirmModal({ isOpen, onConfirm, onCancel, title, message, confirmText = 'Confirmer', cancelText = 'Annuler', confirmStyle = 'danger' }) {
  if (!isOpen) return null;

  const confirmButtonClass = confirmStyle === 'danger' 
    ? 'bg-red-600 hover:bg-red-700 text-white' 
    : 'btn-primary';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md">
        <h3 className="text-lg font-semibold text-obsidian-text mb-2">
          {title || 'Confirmation'}
        </h3>
        
        <p className="text-obsidian-text-muted mb-6">
          {message || 'Êtes-vous sûr de vouloir continuer ?'}
        </p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="btn-secondary"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel(); // Close modal after confirm
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}