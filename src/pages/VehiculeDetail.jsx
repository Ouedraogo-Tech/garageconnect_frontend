import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

function VehiculeDetail() {
  const { id } = useParams();
  const [vehicule, setVehicule] = useState(null);
  const [reparations, setReparations] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    Promise.all([api.getVehicule(id), api.getReparations()])
      .then(([vehiculeData, reparationsData]) => {
        setVehicule(vehiculeData);
        setReparations(reparationsData.filter((r) => r.vehicule_id === Number(id)));
      })
      .catch(() => setErreur('Impossible de charger ce véhicule.'))
      .finally(() => setChargement(false));
  }, [id]);

  if (chargement) return <div className="container mt-4"><p>Chargement...</p></div>;
  if (erreur) return <div className="container mt-4"><p className="text-danger">{erreur}</p></div>;
  if (!vehicule) return <div className="container mt-4"><p>Véhicule introuvable.</p></div>;

  return (
    <div className="container mt-4">
      <h1>{vehicule.marque} {vehicule.modele}</h1>
      <div className="card mb-4">
        <div className="card-body">
          <p className="mb-1"><strong>Immatriculation :</strong> {vehicule.immatriculation}</p>
          <p className="mb-1">{vehicule.couleur} — {vehicule.annee} — {vehicule.kilometrage} km</p>
          <p className="mb-0">{vehicule.carrosserie} · {vehicule.energie} · {vehicule.boite}</p>
        </div>
      </div>

      <h2>Réparations</h2>
      {reparations.length === 0 && <p>Aucune réparation enregistrée.</p>}
      <ul className="list-group mb-4">
        {reparations.map((r) => (
          <li key={r.id} className="list-group-item">
            {r.objet_reparation} — {r.date} ({r.duree_main_oeuvre} h)
          </li>
        ))}
      </ul>

      <Link to="/vehicules" className="btn btn-secondary">Retour à la liste</Link>
    </div>
  );
}

export default VehiculeDetail;