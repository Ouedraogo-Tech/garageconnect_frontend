import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import Chargement from '../components/Chargement';
import MessageErreur from '../components/MessageErreur';

function ReparationsList({ role }) {
  const [reparations, setReparations] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [statut, setStatut] = useState('');
  const [technicienId, setTechnicienId] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [techniciens, setTechniciens] = useState([]);
  const [page, setPage] = useState(1);
  const [dernierPage, setDernierPage] = useState(1);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const technicienConnecteId = Number(sessionStorage.getItem('technicienId'));

  function charger(termeRecherche = recherche, numeroPage = 1) {
    setChargement(true);
    api
      .getReparations(termeRecherche, numeroPage, {
        statut,
        technicien_id: technicienId,
        date_debut: dateDebut,
        date_fin: dateFin,
      })
      .then((data) => {
        setReparations(data.data);
        setPage(data.current_page);
        setDernierPage(data.last_page);
      })
      .catch(() => setErreur('Impossible de charger les réparations.'))
      .finally(() => setChargement(false));
  }

  useEffect(() => {
    charger(recherche, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statut, technicienId, dateDebut, dateFin]);

  useEffect(() => {
    if (role === 'admin') {
      api.getTechniciensAll().then(setTechniciens).catch(() => {});
    }
  }, [role]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    charger(recherche, 1);
  }

  function reinitialiserFiltres() {
    setStatut('');
    setTechnicienId('');
    setDateDebut('');
    setDateFin('');
  }

  function pagePrecedente() {
    if (page > 1) charger(recherche, page - 1);
  }

  function pageSuivante() {
    if (page < dernierPage) charger(recherche, page + 1);
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer cette réparation ?')) return;
    await api.deleteReparation(id);
    charger(recherche, page);
  }

  async function handleSignaler(r) {
    if (!confirm('Signaler ce travail comme terminé auprès de l\'administrateur ?')) return;
    try {
      await api.signalerReparationTerminee(r.id);
      charger(recherche, page);
    } catch {
      alert('Impossible de signaler cette réparation comme terminée.');
    }
  }

  async function handleTerminer(r) {
    if (!confirm('Marquer cette réparation comme terminée ? Le client recevra une notification.')) return;
    try {
      await api.updateReparation(r.id, {
        vehicule_id: r.vehicule.id,
        date: r.date,
        date_fin_prevue: r.date_fin_prevue,
        date_fin_reelle: new Date().toISOString().split('T')[0],
        duree_main_oeuvre: r.duree_main_oeuvre,
        objet_reparation: r.objet_reparation,
      });
      charger(recherche, page);
    } catch {
      alert('Impossible de marquer cette réparation comme terminée.');
    }
  }

  function badgeStatut(r) {
    if (r.date_fin_reelle) {
      return <span className="badge bg-success">Terminée</span>;
    }
    if (r.signalee_terminee_le) {
      return <span className="badge bg-info text-dark">Signalée par le technicien</span>;
    }
    return <span className="badge bg-warning text-dark">En cours</span>;
  }

  if (erreur) return <div className="container mt-4"><MessageErreur message={erreur} /></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Liste des réparations</h1>
        {role === 'admin' && (
          <Link to="/reparations/nouvelle" className="btn btn-success">
            + Nouvelle réparation
          </Link>
        )}
      </div>

      <form onSubmit={handleSearchSubmit} className="d-flex mb-3" style={{ maxWidth: '500px' }}>
        <input
          type="text"
          className="form-control me-2"
          placeholder="Rechercher par objet de la réparation"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Rechercher</button>
      </form>

      <div className="row g-2 mb-3 align-items-end">
        <div className="col-auto">
          <label className="form-label mb-0 small">Statut</label>
          <select className="form-select" value={statut} onChange={(e) => setStatut(e.target.value)}>
            <option value="">Tous</option>
            <option value="en_cours">En cours</option>
            <option value="signalee">Signalée</option>
            <option value="terminee">Terminée</option>
          </select>
        </div>

        {role === 'admin' && (
          <div className="col-auto">
            <label className="form-label mb-0 small">Technicien</label>
            <select className="form-select" value={technicienId} onChange={(e) => setTechnicienId(e.target.value)}>
              <option value="">Tous</option>
              {techniciens.map((t) => (
                <option key={t.id} value={t.id}>{t.prenom} {t.nom}</option>
              ))}
            </select>
          </div>
        )}

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

      {chargement ? (
        <Chargement />
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Objet</th>
                  <th>Date</th>
                  <th>Véhicule</th>
                  <th>Techniciens</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reparations.map((r) => {
                  const estAssigne = r.techniciens.some((t) => t.id === technicienConnecteId);
                  return (
                    <tr key={r.id}>
                      <td>{r.objet_reparation}</td>
                      <td>{r.date}</td>
                      <td>{r.vehicule.marque} {r.vehicule.modele} ({r.vehicule.immatriculation})</td>
                      <td>{r.techniciens.map((t) => `${t.prenom} ${t.nom}`).join(', ')}</td>
                      <td>{badgeStatut(r)}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <Link to={`/reparations/${r.id}`} className="btn btn-primary btn-sm">Voir</Link>
                          {(role === 'admin' || estAssigne) && (
                            <Link to={`/reparations/${r.id}/modifier`} className="btn btn-warning btn-sm">Modifier</Link>
                          )}

                          {role === 'technicien' && estAssigne && !r.signalee_terminee_le && !r.date_fin_reelle && (
                            <button onClick={() => handleSignaler(r)} className="btn btn-info btn-sm">
                              Signaler terminé
                            </button>
                          )}

                          {!r.date_fin_reelle && role === 'admin' && (
                            <button onClick={() => handleTerminer(r)} className="btn btn-success btn-sm">
                              Marquer terminée
                            </button>
                          )}

                          {role === 'admin' && (
                            <button onClick={() => handleDelete(r.id)} className="btn btn-danger btn-sm">Supprimer</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <button className="btn btn-outline-secondary" onClick={pagePrecedente} disabled={page <= 1}>
              ← Précédent
            </button>
            <span>Page {page} / {dernierPage}</span>
            <button className="btn btn-outline-secondary" onClick={pageSuivante} disabled={page >= dernierPage}>
              Suivant →
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ReparationsList;