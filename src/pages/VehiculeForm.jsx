import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

const VIDE = {
  immatriculation: '',
  marque: '',
  modele: '',
  couleur: '',
  annee: '',
  kilometrage: '',
  carrosserie: '',
  energie: '',
  boite: '',
};

function VehiculeForm() {
  const { id } = useParams();
  const estEdition = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState(VIDE);
  const [chargement, setChargement] = useState(estEdition);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    if (estEdition) {
      api
        .getVehicule(id)
        .then((data) => setForm(data))
        .catch(() => setErreur('Impossible de charger ce véhicule.'))
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
        await api.updateVehicule(id, form);
      } else {
        await api.createVehicule(form);
      }
      navigate('/vehicules');
    } catch {
      setErreur('Impossible d\'enregistrer ce véhicule (vérifiez les champs).');
    }
  }

  if (chargement) return <p>Chargement...</p>;

    return (
    <div className="container mt-4" style={{ maxWidth: '600px' }}>
      <h1>{estEdition ? 'Modifier le véhicule' : 'Nouveau véhicule'}</h1>
      <form onSubmit={handleSubmit} className="card p-4">
        <div className="mb-3">
          <label className="form-label">Immatriculation</label>
          <input className="form-control" name="immatriculation" value={form.immatriculation} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Marque</label>
          <input className="form-control" name="marque" value={form.marque} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Modèle</label>
          <input className="form-control" name="modele" value={form.modele} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Couleur</label>
          <input className="form-control" name="couleur" value={form.couleur} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Année</label>
          <input
            type="number"
            className="form-control"
            name="annee"
            value={form.annee}
            onChange={handleChange}
            min="1950"
            max={new Date().getFullYear()}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Kilométrage</label>
          <input
            type="number"
            className="form-control"
            name="kilometrage"
            value={form.kilometrage}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Carrosserie</label>
          <input className="form-control" name="carrosserie" value={form.carrosserie} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Énergie</label>
          <input className="form-control" name="energie" value={form.energie} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Boîte</label>
          <input className="form-control" name="boite" value={form.boite} onChange={handleChange} required />
        </div>
        {erreur && <p className="text-danger">{erreur}</p>}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">{estEdition ? 'Enregistrer' : 'Créer'}</button>
          <Link to="/vehicules" className="btn btn-secondary">Annuler</Link>
        </div>
      </form>
    </div>
  );
}

export default VehiculeForm;