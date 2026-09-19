import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

const VIDE = { nom: '', prenom: '', specialite: '' };

function TechnicienForm() {
  const { id } = useParams();
  const estEdition = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState(VIDE);
  const [chargement, setChargement] = useState(estEdition);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    if (estEdition) {
      api
        .getTechnicien(id)
        .then((data) => setForm(data))
        .catch(() => setErreur('Impossible de charger ce technicien.'))
        .finally(() => setChargement(false));
    }
  }, [id, estEdition]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur('');
    try {
      if (estEdition) {
        await api.updateTechnicien(id, form);
      } else {
        await api.createTechnicien(form);
      }
      navigate('/techniciens');
    } catch {
      setErreur('Impossible d\'enregistrer ce technicien (vérifiez les champs).');
    }
  }

  if (chargement) return <p>Chargement...</p>;

   return (
    <div className="container mt-4" style={{ maxWidth: '600px' }}>
      <h1>{estEdition ? 'Modifier le technicien' : 'Nouveau technicien'}</h1>
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
          <label className="form-label">Spécialité</label>
          <input className="form-control" name="specialite" value={form.specialite} onChange={handleChange} required />
        </div>
        {erreur && <p className="text-danger">{erreur}</p>}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">{estEdition ? 'Enregistrer' : 'Créer'}</button>
          <Link to="/techniciens" className="btn btn-secondary">Annuler</Link>
        </div>
      </form>
    </div>
  );
}

export default TechnicienForm;