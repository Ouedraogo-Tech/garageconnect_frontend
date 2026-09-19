import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

function TechniciensList({ role }) {
  const [techniciens, setTechniciens] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  function charger(termeRecherche = '') {
    api
      .getTechniciens(termeRecherche)
      .then((data) => setTechniciens(data))
      .catch(() => setErreur('Impossible de charger les techniciens.'))
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
    if (!confirm('Supprimer ce technicien ?')) return;
    await api.deleteTechnicien(id);
    charger(recherche);
  }

  if (erreur) return <div className="container mt-4"><p className="text-danger">{erreur}</p></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Liste des techniciens</h1>
        {role === 'admin' && (
          <Link to="/techniciens/nouveau" className="btn btn-success">
            + Ajouter un technicien
          </Link>
        )}
      </div>

      <form onSubmit={handleSearchSubmit} className="d-flex mb-3" style={{ maxWidth: '500px' }}>
        <input
          type="text"
          className="form-control me-2"
          placeholder="Rechercher par nom, prénom ou spécialité"
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
              <th>Nom</th>
              <th>Prénom</th>
              <th>Spécialité</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {techniciens.map((t) => (
              <tr key={t.id}>
                <td>{t.nom}</td>
                <td>{t.prenom}</td>
                <td>{t.specialite}</td>
                <td>
                  <div className="d-flex gap-1">
                    <Link to={`/techniciens/${t.id}`} className="btn btn-primary btn-sm">
                      Voir
                    </Link>
                    {role === 'admin' && (
                      <>
                        <Link to={`/techniciens/${t.id}/modifier`} className="btn btn-warning btn-sm">
                          Modifier
                        </Link>
                        <button onClick={() => handleDelete(t.id)} className="btn btn-danger btn-sm">
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

export default TechniciensList;