import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

function VehiculesList({ role }) {
  const [vehicules, setVehicules] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [page, setPage] = useState(1);
  const [dernierPage, setDernierPage] = useState(1);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  function charger(termeRecherche = '', numeroPage = 1) {
    setChargement(true);
    api
      .getVehicules(termeRecherche, numeroPage)
      .then((data) => {
        setVehicules(data.data);
        setPage(data.current_page);
        setDernierPage(data.last_page);
      })
      .catch(() => setErreur('Impossible de charger les véhicules.'))
      .finally(() => setChargement(false));
  }

  useEffect(() => {
    charger();
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    charger(recherche, 1);
  }

  function pagePrecedente() {
    if (page > 1) charger(recherche, page - 1);
  }

  function pageSuivante() {
    if (page < dernierPage) charger(recherche, page + 1);
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer ce véhicule ?')) return;
    await api.deleteVehicule(id);
    charger(recherche, page);
  }

  if (erreur) return <div className="container mt-4"><p className="text-danger">{erreur}</p></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Liste des véhicules</h1>
        {role === 'admin' && (
          <Link to="/vehicules/nouveau" className="btn btn-success">
            + Ajouter un véhicule
          </Link>
        )}
      </div>

      <form onSubmit={handleSearchSubmit} className="d-flex mb-3" style={{ maxWidth: '500px' }}>
        <input
          type="text"
          className="form-control me-2"
          placeholder="Rechercher par marque ou immatriculation"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Rechercher</button>
      </form>

      {chargement ? (
        <p>Chargement...</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Immatriculation</th>
                  <th>Marque</th>
                  <th>Modèle</th>
                  <th>Kilométrage</th>
                  <th>Propriétaire</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {vehicules.map((v) => (
                  <tr key={v.id}>
                    <td>{v.immatriculation}</td>
                    <td>{v.marque}</td>
                    <td>{v.modele}</td>
                    <td>{v.kilometrage} km</td>
                    <td>
                      {v.client ? (
                        <span className="badge bg-info text-dark">
                          {v.client.prenom} {v.client.nom}
                        </span>
                      ) : (
                        <span className="text-muted small">Non renseigné</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Link to={`/vehicules/${v.id}`} className="btn btn-primary btn-sm">Voir</Link>
                        {role === 'admin' && (
                          <>
                            <Link to={`/vehicules/${v.id}/modifier`} className="btn btn-warning btn-sm">Modifier</Link>
                            <button onClick={() => handleDelete(v.id)} className="btn btn-danger btn-sm">Supprimer</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
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

export default VehiculesList;