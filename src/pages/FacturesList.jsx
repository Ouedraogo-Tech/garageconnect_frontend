import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import Chargement from '../components/Chargement';
import MessageErreur from '../components/MessageErreur';

function FacturesList() {
  const [factures, setFactures] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [page, setPage] = useState(1);
  const [dernierPage, setDernierPage] = useState(1);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  function charger(termeRecherche = '', numeroPage = 1) {
    setChargement(true);
    api
      .getFactures(termeRecherche, numeroPage)
      .then((data) => {
        setFactures(data.data);
        setPage(data.current_page);
        setDernierPage(data.last_page);
      })
      .catch(() => setErreur('Impossible de charger les factures.'))
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

  async function telechargerPdf(f) {
    try {
      const blob = await api.getFacturePdf(f.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${f.numero}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Impossible de télécharger le PDF.');
    }
  }

  function pageSuivante() {
    if (page < dernierPage) charger(recherche, page + 1);
  }

  if (erreur) return <div className="container mt-4"><MessageErreur message={erreur} /></div>;

  return (
    <div className="container mt-4">
      <h1 className="mb-3">Factures</h1>

      <form onSubmit={handleSearchSubmit} className="d-flex mb-3" style={{ maxWidth: '500px' }}>
        <input
          type="text"
          className="form-control me-2"
          placeholder="Rechercher par numéro de facture"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Rechercher</button>
      </form>

      {chargement ? (
        <Chargement />
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Numéro</th>
                  <th>Véhicule</th>
                  <th>Date</th>
                  <th>Montant total</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {factures.map((f) => (
                  <tr key={f.id}>
                    <td>{f.numero}</td>
                    <td>{f.reparation.vehicule.marque} {f.reparation.vehicule.modele} ({f.reparation.vehicule.immatriculation})</td>
                    <td>{f.date_emission}</td>
                    <td>{Number(f.montant_total).toLocaleString()} FCFA</td>
                    <td>
                      {f.statut === 'payee' ? (
                        <span className="badge bg-success">Payée</span>
                      ) : (
                        <span className="badge bg-danger">Impayée</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Link to={`/factures/${f.id}`} className="btn btn-primary btn-sm">Voir</Link>
                        <button onClick={() => telechargerPdf(f)} className="btn btn-outline-secondary btn-sm">
                          PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <button className="btn btn-outline-secondary" onClick={pagePrecedente} disabled={page <= 1}>← Précédent</button>
            <span>Page {page} / {dernierPage}</span>
            <button className="btn btn-outline-secondary" onClick={pageSuivante} disabled={page >= dernierPage}>Suivant →</button>
          </div>
        </>
      )}
    </div>
  );
}

export default FacturesList;