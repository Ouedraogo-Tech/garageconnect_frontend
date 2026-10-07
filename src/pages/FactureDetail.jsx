import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

function FactureDetail({ role }) {
  const { id } = useParams();
  const [facture, setFacture] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  function charger() {
    api
      .getFacture(id)
      .then((data) => setFacture(data))
      .catch(() => setErreur('Impossible de charger cette facture.'))
      .finally(() => setChargement(false));
  }

  useEffect(() => {
    charger();
  }, [id]);

  async function togglePaiement() {
    const nouveauStatut = facture.statut === 'payee' ? 'impayee' : 'payee';
    await api.updateFacture(id, nouveauStatut);
    charger();
  }

  if (chargement) return <div className="container mt-4"><p>Chargement...</p></div>;
  if (erreur) return <div className="container mt-4"><p className="text-danger">{erreur}</p></div>;
  if (!facture) return <div className="container mt-4"><p>Facture introuvable.</p></div>;

  const rep = facture.reparation;

  return (
    <div className="container mt-4" style={{ maxWidth: '700px' }}>
      <h1>Facture {facture.numero}</h1>
      <div className="card mb-4">
        <div className="card-body">
          <p className="mb-1"><strong>Date d'émission :</strong> {facture.date_emission}</p>
          <p className="mb-1">
            <strong>Véhicule :</strong>{' '}
            <Link to={`/vehicules/${rep.vehicule.id}`}>
              {rep.vehicule.marque} {rep.vehicule.modele} ({rep.vehicule.immatriculation})
            </Link>
          </p>
          <p className="mb-1"><strong>Objet :</strong> {rep.objet_reparation}</p>
          <p className="mb-3"><strong>Techniciens :</strong> {rep.techniciens.map((t) => `${t.prenom} ${t.nom}`).join(', ') || '—'}</p>

          <table className="table table-sm">
            <thead>
              <tr><th>Détail</th><th className="text-end">Montant</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Main d'œuvre ({rep.duree_main_oeuvre} h)</td>
                <td className="text-end">{Number(facture.montant_main_oeuvre).toLocaleString()} FCFA</td>
              </tr>
              <tr>
                <td>
                  Pièces
                  {rep.pieces.length > 0 && (
                    <ul className="mb-0 small text-muted">
                      {rep.pieces.map((p) => (
                        <li key={p.id}>{p.nom} × {p.pivot.quantite_utilisee}</li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="text-end">{Number(facture.montant_pieces).toLocaleString()} FCFA</td>
              </tr>
              <tr className="fw-bold">
                <td>Total</td>
                <td className="text-end">{Number(facture.montant_total).toLocaleString()} FCFA</td>
              </tr>
            </tbody>
          </table>

          <p>
            Statut :{' '}
            {facture.statut === 'payee' ? (
              <span className="badge bg-success">Payée</span>
            ) : (
              <span className="badge bg-danger">Impayée</span>
            )}
          </p>

          {role === 'admin' && (
            <button className="btn btn-outline-primary btn-sm" onClick={togglePaiement}>
              Marquer comme {facture.statut === 'payee' ? 'impayée' : 'payée'}
            </button>
          )}
        </div>
      </div>
      <Link to="/factures" className="btn btn-secondary">Retour à la liste</Link>
    </div>
  );
}

export default FactureDetail;