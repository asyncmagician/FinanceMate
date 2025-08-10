import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import api from '../../services/api';

export default function BudgetSettings({ year, month, onUpdate }) {
  const { t } = useLanguage();
  const [budgetLimit, setBudgetLimit] = useState('');
  const [alertThreshold, setAlertThreshold] = useState(80);
  const [budgetStatus, setBudgetStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadBudgetStatus();
  }, [year, month]);

  const loadBudgetStatus = async () => {
    setLoading(true);
    try {
      const status = await api.getBudgetStatus(year, month);
      setBudgetStatus(status);
      if (status.hasBudget) {
        setBudgetLimit(status.budgetLimit.toString());
        setAlertThreshold(status.alertThreshold);
      }
    } catch (error) {
      console.error('Error loading budget status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const limit = budgetLimit ? parseFloat(budgetLimit) : null;
      await api.setBudgetLimit(year, month, limit, alertThreshold);
      await loadBudgetStatus();
      setShowSettings(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error saving budget:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse bg-obsidian-bg-secondary h-20 rounded"></div>
      </div>
    );
  }

  const percentageUsed = budgetStatus?.percentageUsed || 0;
  const getStatusColor = () => {
    if (percentageUsed >= 95) return 'text-red-400';
    if (percentageUsed >= 80) return 'text-orange-400';
    if (percentageUsed >= 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-obsidian-text">
          {t('budget.title')}
        </h3>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-obsidian-accent hover:text-obsidian-accent-hover transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {budgetStatus?.hasBudget ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-obsidian-text-muted">{t('budget.limit')}</span>
            <span className="text-obsidian-text font-medium">
              {budgetStatus.budgetLimit.toFixed(2)} €
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-obsidian-text-muted">{t('budget.spent')}</span>
            <span className={`font-medium ${getStatusColor()}`}>
              {budgetStatus.spent.toFixed(2)} €
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-obsidian-text-muted">{t('budget.remaining')}</span>
            <span className={`font-medium ${budgetStatus.remaining < 0 ? 'text-red-400' : 'text-obsidian-text'}`}>
              {budgetStatus.remaining.toFixed(2)} €
            </span>
          </div>

          <div className="pt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-obsidian-text-muted">{t('budget.usage')}</span>
              <span className={`text-xs font-medium ${getStatusColor()}`}>
                {percentageUsed.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-obsidian-bg-secondary rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  percentageUsed >= 95 ? 'bg-red-500' :
                  percentageUsed >= 80 ? 'bg-orange-500' :
                  percentageUsed >= 60 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(percentageUsed, 100)}%` }}
              />
            </div>
          </div>

          {percentageUsed >= alertThreshold && (
            <div className="p-3 bg-orange-900/20 border border-orange-500 rounded-lg">
              <p className="text-orange-400 text-sm">
                {t('budget.alertTriggered', { threshold: alertThreshold })}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-obsidian-text-muted mb-3">
            {t('budget.noBudgetSet')}
          </p>
          <button
            onClick={() => setShowSettings(true)}
            className="btn-secondary text-sm"
          >
            {t('budget.setBudget')}
          </button>
        </div>
      )}

      {showSettings && (
        <div className="mt-4 pt-4 border-t border-obsidian-border space-y-3">
          <div>
            <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
              {t('budget.monthlyLimit')}
            </label>
            <input
              type="number"
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(e.target.value)}
              placeholder={t('budget.limitPlaceholder')}
              className="input-field w-full"
              min="0"
              step="100"
            />
            <p className="text-xs text-obsidian-text-muted mt-1">
              {t('budget.limitHint')}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
              {t('budget.alertThreshold')} ({alertThreshold}%)
            </label>
            <input
              type="range"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(parseInt(e.target.value))}
              min="50"
              max="95"
              step="5"
              className="w-full"
            />
            <p className="text-xs text-obsidian-text-muted mt-1">
              {t('budget.thresholdHint', { threshold: alertThreshold })}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary disabled:opacity-50"
            >
              {saving ? t('saving') : t('save')}
            </button>
            <button
              onClick={() => {
                setShowSettings(false);
                setBudgetLimit(budgetStatus?.budgetLimit?.toString() || '');
                setAlertThreshold(budgetStatus?.alertThreshold || 80);
              }}
              className="btn-secondary"
            >
              {t('cancel')}
            </button>
            {budgetStatus?.hasBudget && (
              <button
                onClick={async () => {
                  setSaving(true);
                  try {
                    await api.setBudgetLimit(year, month, null, 80);
                    await loadBudgetStatus();
                    setShowSettings(false);
                    setBudgetLimit('');
                    setAlertThreshold(80);
                    if (onUpdate) onUpdate();
                  } catch (error) {
                    console.error('Error removing budget:', error);
                  } finally {
                    setSaving(false);
                  }
                }}
                className="text-red-400 hover:text-red-300 transition-colors ml-auto"
              >
                {t('budget.removeBudget')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}