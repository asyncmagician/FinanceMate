import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      const response = await api.register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );

      if (response.success) {
        navigate('/login', { 
          state: { message: 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.' }
        });
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian-bg">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold text-obsidian-text mb-6 text-center">
          Créer un compte
        </h2>

        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
              Prénom
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="input-field w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
              Nom
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="input-field w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field w-full"
              required
              minLength="6"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-obsidian-text-muted mb-1">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field w-full"
              required
              minLength="6"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-obsidian-link hover:text-obsidian-link-hover text-sm">
            Déjà un compte ? Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;