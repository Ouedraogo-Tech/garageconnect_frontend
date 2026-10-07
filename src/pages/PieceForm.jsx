import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

const VIDE = { nom: '', reference: '', quantite_stock: 0, seuil_alerte: 5, prix_unitaire: '' };

function PieceForm() {
  const { id } = useParams();
  const estEdition = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState(VIDE);
  const [chargement, setChargement] = useState(estEdition);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    if (estEdition) {
      api
        .getPiece(id)
        .then((data) => setForm(data))
        .catch(() => setErreur('Impossible de charger cette pièce.'))
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
        await api.updatePiece(id, form);
      } else {
        await api.createPiece(form);
      }
      navigate('/pieces');
    } catch {
      setErreur('Impossible d\'enregistrer cette pièce (vérifiez les champs, la référence doit être unique).');
    }
  }

  if (chargement) return <div className="container mt-4"><p>Chargement...</p></div>;

  return (
    <div className="container mt-4" style={{ maxWidth: '600px' }}>
      <h1>{estEdition ? 'Modifier la pièce' : 'Nouvelle pièce'}</h1>
      <form onSubmit={handleSubmit} className="card p-4">
        <div className="mb-3">
          <label className="form-label">Nom</label>
          <input className="form-control" name="nom" value={form.nom} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Référence</label>
          <input className="form-control" name="reference" value={form.reference} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Quantité en stock</label>
          <input type="number" min="0" className="form-control" name="quantite_stock" value={form.quantite_stock} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Seuil d'alerte</label>
          <input type="number" min="0" className="form-control" name="seuil_alerte" value={form.seuil_alerte} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Prix unitaire (FCFA)</label>
          <input type="number" min="0" step="0.01" className="form-control" name="prix_unitaire" value={form.prix_unitaire} onChange={handleChange} required />
        </div>
        {erreur && <p className="text-danger">{erreur}</p>}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">{estEdition ? 'Enregistrer' : 'Créer'}</button>
          <Link to="/pieces" className="btn btn-secondary">Annuler</Link>
        </div>
      </form>
    </div>
  );
}

export default PieceForm;