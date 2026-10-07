import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Chargement from '../components/Chargement';
import MessageErreur from '../components/MessageErreur';

function RendezVousAdmin() {
  const [rendezVous, setRendezVous] = useState([]);
  const [filtre, setFiltre] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [confirmationEnCours, setConfirmationEnCours] = useState(null);
  const [dateFinPrevue, setDateFinPrevue] = useState('');

  function charger() {
    setChargement(true);
    api
      .getRendezVous({ statut: filtre, date_debut: dateDebut, date_fin: dateFin })
      .then((data) => setRendezVous(data.data))
      .catch(() => setErreur('Impossible de charger les rendez-vous.'))
      .finally(() => setChargement(false));
  }

  useEffect(() => {
    charger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtre, dateDebut, dateFin]);

  function reinitialiserFiltres() {
    setFiltre('');
    setDateDebut('');
    setDateFin('');
  }

  function ouvrirConfirmation(id) {
    setConfirmationEnCours(id);
    setDateFinPrevue('');
  }

  function annulerConfirmation() {
    setConfirmationEnCours(null);
    setDateFinPrevue('');
  }

  async function validerConfirmation(id) {
    try {
      await api.updateRendezVous(id, {
        statut: 'confirme',
        date_fin_prevue: dateFinPrevue || null,
      });
      setConfirmationEnCours(null);
      setDateFinPrevue('');
      charger();
    } catch (err) {
      alert(err?.message || 'Impossible de confirmer ce rendez-vous.');
    }
  }

  async function refuser(id) {
    const commentaire = prompt('Motif du refus (optionnel) :') || '';
    try {
      await api.updateRendezVous(id, { statut: 'refuse', commentaire_admin: commentaire });
      charger();
    } catch {
      alert('Impossible de refuser ce rendez-vous.');
    }
  }

  function badgeStatut(statut) {
    const classes = {
      en_attente: 'bg-warning text-dark',
      confirme: 'bg-success',
      refuse: 'bg-danger',
    };
    const labels = {
      en_attente: 'En attente',
      confirme: 'Confirmé',
      refuse: 'Refusé',
    };
    return <span className={`badge ${classes[statut]}`}>{labels[statut]}</span>;
  }

  if (chargement) return <div className="container mt-4"><Chargement /></div>;
  if (erreur) return <div className="container mt-4"><MessageErreur message={erreur} /></div>;

  return (
    <div className="container mt-4">
      <h1>Demandes de rendez-vous</h1>

      <div className="row g-2 mb-3 align-items-end">
        <div className="col-auto">
          <label className="form-label mb-0 small">Statut</label>
          <select className="form-select" value={filtre} onChange={(e) => setFiltre(e.target.value)}>
            <option value="">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="confirme">Confirmé</option>
            <option value="refuse">Refusé</option>
          </select>
        </div>
        <div className="col-auto">
          <label className="form-label mb-0 small">Du</label>
          <input type="date" className="form-control" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} />
        </div>
        <div className="col-auto">
          <label className="form-label mb-0 small">Au</label>
          <input type="date" className="form-control" value={dateFin} onChange={(e) => setDateFin(e.target.value)} />
        </div>
        <div className="col-auto">
          <button className="btn btn-outline-secondary" onClick={reinitialiserFiltres}>
            Réinitialiser
          </button>
        </div>
      </div>

      {rendezVous.length === 0 && <p>Aucun rendez-vous.</p>}

      <ul className="list-group">
        {rendezVous.map((r) => (
          <li key={r.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <strong>{r.client.prenom} {r.client.nom}</strong>
                {r.client.telephone && <span className="text-muted"> — {r.client.telephone}</span>}
                <br />
                <strong>{r.date_rdv}</strong> à {r.heure_rdv.slice(0, 5)} — {r.motif}
                {r.vehicule && <span> ({r.vehicule.marque} {r.vehicule.modele} — {r.vehicule.immatriculation})</span>}
                {r.commentaire_admin && <p className="mb-0 text-muted small">Commentaire : {r.commentaire_admin}</p>}
                
              </div>
              <div className="d-flex flex-column align-items-end gap-2">
                {badgeStatut(r.statut)}
                {r.statut === 'en_attente' && confirmationEnCours !== r.id && (
                  <div className="d-flex gap-1">
                    <button className="btn btn-sm btn-success" onClick={() => ouvrirConfirmation(r.id)}>Confirmer</button>
                    <button className="btn btn-sm btn-danger" onClick={() => refuser(r.id)}>Refuser</button>
                  </div>
                )}
                {confirmationEnCours === r.id && (
                  <div className="d-flex flex-column align-items-end gap-1" style={{ minWidth: '220px' }}>
                    <label className="form-label mb-0 small">Date de fin prévue (optionnelle)</label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      value={dateFinPrevue}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setDateFinPrevue(e.target.value)}
                    />
                    <div className="d-flex gap-1 mt-1">
                      <button className="btn btn-sm btn-success" onClick={() => validerConfirmation(r.id)}>Valider</button>
                      <button className="btn btn-sm btn-outline-secondary" onClick={annulerConfirmation}>Annuler</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RendezVousAdmin;