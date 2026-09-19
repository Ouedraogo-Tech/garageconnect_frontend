import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

function ReparationDetail() {
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

  if (chargement) return <div className="container mt-4"><p>Chargement...</p></div>;
  if (erreur) return <div className="container mt-4"><p className="text-danger">{erreur}</p></div>;
  if (!reparation) return <div className="container mt-4"><p>Réparation introuvable.</p></div>;

  return (
    <div className="container mt-4">
      <h1>{reparation.objet_reparation}</h1>
      <div className="card mb-4">
        <div className="card-body">
          <p className="mb-1"><strong>Date :</strong> {reparation.date}</p>
          <p className="mb-1"><strong>Durée main d'œuvre :</strong> {reparation.duree_main_oeuvre} h</p>
          <p className="mb-1">
            <strong>Véhicule :</strong>{' '}
            <Link to={`/vehicules/${reparation.vehicule.id}`}>
              {reparation.vehicule.marque} {reparation.vehicule.modele} ({reparation.vehicule.immatriculation})
            </Link>
          </p>
          <p className="mb-0">
            <strong>Techniciens :</strong>{' '}
            {reparation.techniciens.map((t) => `${t.prenom} ${t.nom}`).join(', ')}
          </p>
        </div>
      </div>

      <Link to="/reparations" className="btn btn-secondary">Retour à la liste</Link>
    </div>
  );
}

export default ReparationDetail;