import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

function TechnicienDetail() {
  const { id } = useParams();
  const [technicien, setTechnicien] = useState(null);
  const [reparations, setReparations] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    Promise.all([api.getTechnicien(id), api.getReparations()])
      .then(([technicienData, reparationsData]) => {
        setTechnicien(technicienData);
        setReparations(
          reparationsData.filter((r) =>
            r.techniciens.some((t) => t.id === Number(id))
          )
        );
      })
      .catch(() => setErreur('Impossible de charger ce technicien.'))
      .finally(() => setChargement(false));
  }, [id]);

  if (chargement) return <div className="container mt-4"><p>Chargement...</p></div>;
  if (erreur) return <div className="container mt-4"><p className="text-danger">{erreur}</p></div>;
  if (!technicien) return <div className="container mt-4"><p>Technicien introuvable.</p></div>;

  return (
    <div className="container mt-4">
      <h1>{technicien.nom} {technicien.prenom}</h1>
      <p className="text-muted">Spécialité : {technicien.specialite}</p>

      <h2>Véhicules concernés par ses réparations</h2>
      {reparations.length === 0 ? (
        <p>Aucune réparation assignée.</p>
      ) : (
        <table className="table table-striped table-hover mb-4">
          <thead>
            <tr>
              <th>Véhicule</th>
              <th>Immatriculation</th>
              <th>Objet de la réparation</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {reparations.map((r) => (
              <tr key={r.id}>
                <td>
                  <Link to={`/vehicules/${r.vehicule.id}`}>
                    {r.vehicule.marque} {r.vehicule.modele}
                  </Link>
                </td>
                <td>{r.vehicule.immatriculation}</td>
                <td>{r.objet_reparation}</td>
                <td>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link to="/techniciens" className="btn btn-secondary">Retour à la liste</Link>
    </div>
  );
}

export default TechnicienDetail;