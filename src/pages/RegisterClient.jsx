import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

const VIDE = { nom: '', prenom: '', telephone: '', adresse: '', email: '', password: '' };

function RegisterClient({ onLogin }) {
  const [form, setForm] = useState(VIDE);
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur('');
    setChargement(true);
    try {
      const data = await api.register(form);
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('role', data.role);
      sessionStorage.setItem('name', data.name);
      sessionStorage.setItem('clientId', data.client_id ?? '');
      onLogin(data.role);
      navigate('/client');
    } catch (err) {
      setErreur(err?.message || 'Impossible de créer le compte (email déjà utilisé ?).');
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="container mt-5" style={{ maxWidth: '450px' }}>
      <h1 className="text-center mb-4">Créer un compte client</h1>
      <form onSubmit={handleSubmit} className="card p-4">
        <div className="mb-3">
          <label className="form-label">Nom</label>
          <input className="form-control" name="nom" value={form.nom} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Prénom</label>
          <input className="form-control" name="prenom" value={form.prenom} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Téléphone</label>
          <input className="form-control" name="telephone" value={form.telephone} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Adresse</label>
          <input className="form-control" name="adresse" value={form.adresse} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Mot de passe</label>
          <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required minLength={6} />
        </div>
        {erreur && <p className="text-danger">{erreur}</p>}
        <button type="submit" className="btn btn-primary w-100" disabled={chargement}>
          {chargement ? 'Création...' : 'Créer mon compte'}
        </button>
        <p className="text-center mt-3 mb-0">
          Déjà un compte ? <Link to="/login">Connectez-vous</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterClient;