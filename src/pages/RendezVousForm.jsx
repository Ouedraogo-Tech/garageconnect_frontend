import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const ANNEE_MIN = new Date().getFullYear();
const ANNEE_MAX = 2999;
const ANNEES = Array.from({ length: ANNEE_MAX - ANNEE_MIN + 1 }, (_, i) => ANNEE_MIN + i);
const MOIS = Array.from({ length: 12 }, (_, i) => i + 1);

function joursDansMois(mois, annee) {
  return new Date(annee, mois, 0).getDate();
}

function RendezVousForm() {
  const [vehicules, setVehicules] = useState([]);
  const [form, setForm] = useState({ vehicule_id: '', heure_rdv: '', motif: '' });
  const [jour, setJour] = useState('');
  const [mois, setMois] = useState('');
  const [annee, setAnnee] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.getVehiculesAll().then(setVehicules).catch(() => {});
  }, []);

  const nbJours = mois && annee ? joursDansMois(Number(mois), Number(annee)) : 31;
  const JOURS = Array.from({ length: nbJours }, (_, i) => i + 1);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur('');

    if (!jour || !mois || !annee) {
      setErreur('Veuillez choisir une date complète.');
      return;
    }

    if (!form.vehicule_id) {
      setErreur('Veuillez sélectionner le véhicule concerné.');
      return;
    }

    const jj = String(jour).padStart(2, '0');
    const mm = String(mois).padStart(2, '0');
    const date_rdv = `${annee}-${mm}-${jj}`;

    setChargement(true);
    try {
      await api.createRendezVous({
        ...form,
        date_rdv,
      });
      navigate('/client');
    } catch (err) {
      setErreur(err?.message || 'Impossible de créer le rendez-vous.');
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="container mt-4" style={{ maxWidth: '500px' }}>
      <h1>Prendre un rendez-vous</h1>

      {vehicules.length === 0 && (
        <div className="alert alert-warning">
          Vous devez d'abord ajouter un véhicule depuis votre espace client avant de pouvoir
          prendre un rendez-vous.
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-4">
        <div className="mb-3">
          <label className="form-label">Véhicule concerné</label>
          <select className="form-select" name="vehicule_id" value={form.vehicule_id} onChange={handleChange} required>
            <option value="">-- Sélectionner --</option>
            {vehicules.map((v) => (
              <option key={v.id} value={v.id}>{v.marque} {v.modele} — {v.immatriculation}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Date souhaitée</label>
          <div className="d-flex gap-2">
            <select className="form-select" value={jour} onChange={(e) => setJour(e.target.value)} required>
              <option value="">Jour</option>
              {JOURS.map((j) => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
            <select className="form-select" value={mois} onChange={(e) => setMois(e.target.value)} required>
              <option value="">Mois</option>
              {MOIS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select className="form-select" value={annee} onChange={(e) => setAnnee(e.target.value)} required>
              <option value="">Année</option>
              {ANNEES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Heure souhaitée</label>
          <input type="time" className="form-control" name="heure_rdv" value={form.heure_rdv} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Motif</label>
          <input className="form-control" name="motif" value={form.motif} onChange={handleChange} placeholder="Ex : Vidange, contrôle technique..." required />
        </div>
        {erreur && <p className="text-danger">{erreur}</p>}
        <button type="submit" className="btn btn-primary" disabled={chargement || vehicules.length === 0}>
          {chargement ? 'Envoi...' : 'Demander le rendez-vous'}
        </button>
      </form>
    </div>
  );
}

export default RendezVousForm;