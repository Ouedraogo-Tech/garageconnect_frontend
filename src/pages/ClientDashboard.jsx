import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const VEHICULE_VIDE = {
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

function ClientDashboard() {
  const [vehicules, setVehicules] = useState([]);
  const [rendezVous, setRendezVous] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  const [afficherFormVehicule, setAfficherFormVehicule] = useState(false);
  const [nouveauVehicule, setNouveauVehicule] = useState(VEHICULE_VIDE);
  const [erreurVehicule, setErreurVehicule] = useState('');
  const [envoiVehicule, setEnvoiVehicule] = useState(false);

  const charger = useCallback(() => {
    setChargement(true);
    Promise.all([api.getVehiculesAll(), api.getRendezVous()])
      .then(([vehiculesData, rdvData]) => {
        setVehicules(vehiculesData);
        setRendezVous(rdvData.data);
      })
      .catch(() => setErreur('Impossible de charger vos informations.'))
      .finally(() => setChargement(false));
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  async function annuler(id) {
    if (!confirm('Annuler ce rendez-vous ?')) return;
    try {
      await api.deleteRendezVous(id);
      charger();
    } catch {
      alert('Impossible d\'annuler ce rendez-vous.');
    }
  }

  function handleChangeVehicule(e) {
    setNouveauVehicule({ ...nouveauVehicule, [e.target.name]: e.target.value });
  }

  async function handleSubmitVehicule(e) {
    e.preventDefault();
    setErreurVehicule('');
    setEnvoiVehicule(true);
    try {
      await api.createVehicule(nouveauVehicule);
      setNouveauVehicule(VEHICULE_VIDE);
      setAfficherFormVehicule(false);
      charger();
    } catch {
      setErreurVehicule('Impossible d\'ajouter ce véhicule (vérifiez les champs, notamment l\'immatriculation).');
    } finally {
      setEnvoiVehicule(false);
    }
  }

  function badgeStatut(r) {
    if (r.statut === 'confirme' && r.reparation?.date_fin_reelle) {
      return <span className="badge bg-success">Véhicule prêt</span>;
    }

    const classes = {
      en_attente: 'bg-warning text-dark',
      confirme: 'bg-primary',
      refuse: 'bg-danger',
    };
    const labels = {
      en_attente: 'En attente',
      confirme: 'Confirmé — en réparation',
      refuse: 'Refusé',
    };
    return <span className={`badge ${classes[r.statut]}`}>{labels[r.statut]}</span>;
  }

  if (chargement) return <div className="container mt-4"><p>Chargement...</p></div>;
  if (erreur) return <div className="container mt-4"><p className="text-danger">{erreur}</p></div>;

  return (
    <div className="container mt-4">
      <h1>Mon espace client</h1>

      <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
        <h2 className="mb-0">Mes véhicules</h2>
        <button className="btn btn-primary" onClick={() => setAfficherFormVehicule((v) => !v)}>
          {afficherFormVehicule ? 'Annuler' : 'Ajouter un véhicule'}
        </button>
      </div>

      {afficherFormVehicule && (
        <form onSubmit={handleSubmitVehicule} className="card p-4 mb-4">
          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label">Immatriculation</label>
              <input className="form-control" name="immatriculation" value={nouveauVehicule.immatriculation} onChange={handleChangeVehicule} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Marque</label>
              <input className="form-control" name="marque" value={nouveauVehicule.marque} onChange={handleChangeVehicule} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Modèle</label>
              <input className="form-control" name="modele" value={nouveauVehicule.modele} onChange={handleChangeVehicule} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Couleur</label>
              <input className="form-control" name="couleur" value={nouveauVehicule.couleur} onChange={handleChangeVehicule} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Année</label>
              <input type="number" min="1950" max={new Date().getFullYear()} className="form-control" name="annee" value={nouveauVehicule.annee} onChange={handleChangeVehicule} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Kilométrage</label>
              <input type="number" min="0" className="form-control" name="kilometrage" value={nouveauVehicule.kilometrage} onChange={handleChangeVehicule} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Carrosserie</label>
              <input className="form-control" name="carrosserie" value={nouveauVehicule.carrosserie} onChange={handleChangeVehicule} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Énergie</label>
              <input className="form-control" name="energie" value={nouveauVehicule.energie} onChange={handleChangeVehicule} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Boîte</label>
              <input className="form-control" name="boite" value={nouveauVehicule.boite} onChange={handleChangeVehicule} required />
            </div>
          </div>
          {erreurVehicule && <p className="text-danger mt-2 mb-0">{erreurVehicule}</p>}
          <button type="submit" className="btn btn-success mt-3" disabled={envoiVehicule}>
            {envoiVehicule ? 'Enregistrement...' : 'Enregistrer mon véhicule'}
          </button>
        </form>
      )}

      {vehicules.length === 0 && <p>Aucun véhicule enregistré à votre nom pour le moment.</p>}
      <ul className="list-group mb-4">
        {vehicules.map((v) => (
          <li key={v.id} className="list-group-item">
            {v.marque} {v.modele} — {v.immatriculation}
          </li>
        ))}
      </ul>

      <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
        <h2 className="mb-0">Mes rendez-vous</h2>
        <Link to="/client/rendez-vous/nouveau" className="btn btn-primary">Prendre un rendez-vous</Link>
      </div>
      {rendezVous.length === 0 && <p>Aucun rendez-vous pour le moment.</p>}
      <ul className="list-group">
        {rendezVous.map((r) => (
          <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{r.date_rdv}</strong> à {r.heure_rdv.slice(0, 5)} — {r.motif}
              {r.vehicule && <span> ({r.vehicule.marque} {r.vehicule.modele})</span>}
              {r.commentaire_admin && <p className="mb-0 text-muted small">Note du garage : {r.commentaire_admin}</p>}
            </div>
            <div className="d-flex align-items-center gap-2">
              {badgeStatut(r)}
              {r.statut === 'en_attente' && (
                <button className="btn btn-sm btn-outline-danger" onClick={() => annuler(r.id)}>Annuler</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClientDashboard;