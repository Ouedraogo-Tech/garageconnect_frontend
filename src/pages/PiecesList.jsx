import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

function PiecesList({ role }) {
  const [pieces, setPieces] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [page, setPage] = useState(1);
  const [dernierPage, setDernierPage] = useState(1);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  function charger(termeRecherche = '', numeroPage = 1) {
    setChargement(true);
    api
      .getPieces(termeRecherche, numeroPage)
      .then((data) => {
        setPieces(data.data);
        setPage(data.current_page);
        setDernierPage(data.last_page);
      })
      .catch(() => setErreur('Impossible de charger les pièces.'))
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
    if (!confirm('Supprimer cette pièce ?')) return;
    await api.deletePiece(id);
    charger(recherche, page);
  }

  if (erreur) return <div className="container mt-4"><p className="text-danger">{erreur}</p></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Stock de pièces</h1>
        {role === 'admin' && (
          <Link to="/pieces/nouvelle" className="btn btn-success">
            + Ajouter une pièce
          </Link>
        )}
      </div>

      <form onSubmit={handleSearchSubmit} className="d-flex mb-3" style={{ maxWidth: '500px' }}>
        <input
          type="text"
          className="form-control me-2"
          placeholder="Rechercher par nom ou référence"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Rechercher</button>
      </form>

      {chargement ? (
        <p>Chargement...</p>
      ) : (
        <>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Nom</th>
                <th>Stock</th>
                <th>Prix unitaire</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pieces.map((p) => (
                <tr key={p.id}>
                  <td>{p.reference}</td>
                  <td>{p.nom}</td>
                  <td>{p.quantite_stock}</td>
                  <td>{Number(p.prix_unitaire).toLocaleString()} FCFA</td>
                  <td>
                    {p.en_alerte ? (
                      <span className="badge bg-danger">Stock bas</span>
                    ) : (
                      <span className="badge bg-success">OK</span>
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Link to={`/pieces/${p.id}`} className="btn btn-primary btn-sm">Voir</Link>
                      {role === 'admin' && (
                        <>
                          <Link to={`/pieces/${p.id}/modifier`} className="btn btn-warning btn-sm">Modifier</Link>
                          <button onClick={() => handleDelete(p.id)} className="btn btn-danger btn-sm">Supprimer</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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

export default PiecesList;