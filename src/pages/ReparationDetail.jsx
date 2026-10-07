import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function ReparationDetail({ role }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [reparation, setReparation] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    api
      .getReparation(id)
      .then((data) => setReparation(data))
      .catch(() => setErreur('Impossible de charger cette réparation.'))
      .finally(() => setChargement(false));
  }, [id]);

  async function genererFacture() {
    try {
      const facture = await api.createFacture(reparation.id);
      navigate(`/factures/${facture.id}`);
    } catch {
      alert('Impossible de générer la facture (peut-être déjà facturée).');
    }
  }

  if (chargement) return <div className="container mt-4"><p>Chargement...</p></div>;
  if (erreur) return <div className="container mt-4"><p className="text-danger">{erreur}</p></div>;
  if (!reparation) return <div className="container mt-4"><p>Réparation introuvable.</p></div>;

  return (
    <div className="container mt-4">
      <h1>Détail de la réparation</h1>

      <div className="card p-4 mb-3">
        <h2 className="h5">Véhicule</h2>
        <p className="mb-1">
          {reparation.vehicule?.marque} {reparation.vehicule?.modele} — {reparation.vehicule?.immatriculation}
        </p>

        <h2 className="h5 mt-3">Réparation</h2>
        <p className="mb-1"><strong>Objet :</strong> {reparation.objet_reparation}</p>
        <p className="mb-1"><strong>Date de prise en charge :</strong> {reparation.date}</p>
        <p className="mb-1">
          <strong>Date de fin prévue :</strong> {reparation.date_fin_prevue || 'Non définie'}
        </p>
        <p className="mb-1">
          <strong>Date de fin réelle :</strong>{' '}
          {reparation.date_fin_reelle ? (
            <span className="badge bg-success">{reparation.date_fin_reelle} — Véhicule prêt</span>
          ) : (
            <span className="badge bg-secondary">En cours</span>
          )}
        </p>
        <p className="mb-1"><strong>Durée main d'œuvre :</strong> {reparation.duree_main_oeuvre} h</p>

        <h2 className="h5 mt-3">Techniciens assignés</h2>
        {reparation.techniciens?.length ? (
          <ul className="mb-1">
            {reparation.techniciens.map((t) => (
              <li key={t.id}>{t.prenom} {t.nom}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">Aucun technicien assigné.</p>
        )}

        <h2 className="h5 mt-3">Pièces utilisées</h2>
        {reparation.pieces?.length ? (
          <ul className="mb-1">
            {reparation.pieces.map((p) => (
              <li key={p.id}>
                {p.nom} — quantité : {p.pivot?.quantite_utilisee}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">Aucune pièce utilisée.</p>
        )}
      </div>

      {role === 'admin' && (
        <button className="btn btn-success me-2" onClick={genererFacture}>
          Générer la facture
        </button>
      )}
      <Link to="/reparations" className="btn btn-secondary">Retour à la liste</Link>
    </div>
  );
}

export default ReparationDetail;