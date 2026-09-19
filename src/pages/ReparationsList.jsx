import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

function ReparationsList({ role }) {
  const [reparations, setReparations] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const technicienId = Number(sessionStorage.getItem('technicienId'));

  function charger(termeRecherche = '') {
    api
      .getReparations(termeRecherche)
      .then((data) => setReparations(data))
      .catch(() => setErreur('Impossible de charger les réparations.'))
      .finally(() => setChargement(false));
  }

  useEffect(() => {
    charger();
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    setChargement(true);
    charger(recherche);
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer cette réparation ?')) return;
    await api.deleteReparation(id);
    charger(recherche);
  }

  if (erreur) return <div className="container mt-4"><p className="text-danger">{erreur}</p></div>;

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

      {chargement ? (
        <p>Chargement...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Objet</th>
                <th>Date</th>
                <th>Véhicule</th>
                <th>Techniciens</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reparations.map((r) => (
                <tr key={r.id}>
                  <td>{r.objet_reparation}</td>
                  <td>{r.date}</td>
                  <td>{r.vehicule.marque} {r.vehicule.modele} ({r.vehicule.immatriculation})</td>
                  <td>{r.techniciens.map((t) => `${t.prenom} ${t.nom}`).join(', ')}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <Link to={`/reparations/${r.id}`} className="btn btn-primary btn-sm">
                        Voir
                      </Link>
                      {(role === 'admin' || r.techniciens.some((t) => t.id === technicienId)) && (
                        <Link to={`/reparations/${r.id}/modifier`} className="btn btn-warning btn-sm">
                          Modifier
                        </Link>
                      )}
                      {role === 'admin' && (
                        <button onClick={() => handleDelete(r.id)} className="btn btn-danger btn-sm">
                          Supprimer
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ReparationsList;