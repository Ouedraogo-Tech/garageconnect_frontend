import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

function VehiculesList({ role }) {
  const [vehicules, setVehicules] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  function charger(termeRecherche = '') {
    api
      .getVehicules(termeRecherche)
      .then((data) => setVehicules(data))
      .catch(() => setErreur('Impossible de charger les véhicules.'))
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
    if (!confirm('Supprimer ce véhicule ?')) return;
    await api.deleteVehicule(id);
    charger(recherche);
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
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Immatriculation</th>
              <th>Marque</th>
              <th>Modèle</th>
              <th>Kilométrage</th>
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
                  <div className="d-flex gap-1">
                    <Link to={`/vehicules/${v.id}`} className="btn btn-primary btn-sm">
                      Voir
                    </Link>
                    {role === 'admin' && (
                      <>
                        <Link to={`/vehicules/${v.id}/modifier`} className="btn btn-warning btn-sm">
                          Modifier
                        </Link>
                        <button onClick={() => handleDelete(v.id)} className="btn btn-danger btn-sm">
                          Supprimer
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default VehiculesList;