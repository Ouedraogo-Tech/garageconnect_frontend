import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

function PieceDetail() {
  const { id } = useParams();
  const [piece, setPiece] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    api
      .getPiece(id)
      .then((data) => setPiece(data))
      .catch(() => setErreur('Impossible de charger cette pièce.'))
      .finally(() => setChargement(false));
  }, [id]);

  if (chargement) return <div className="container mt-4"><p>Chargement...</p></div>;
  if (erreur) return <div className="container mt-4"><p className="text-danger">{erreur}</p></div>;
  if (!piece) return <div className="container mt-4"><p>Pièce introuvable.</p></div>;

  return (
    <div className="container mt-4">
      <h1>{piece.nom}</h1>
      <div className="card mb-4">
        <div className="card-body">
          <p className="mb-1"><strong>Référence :</strong> {piece.reference}</p>
          <p className="mb-1"><strong>Quantité en stock :</strong> {piece.quantite_stock}</p>
          <p className="mb-1"><strong>Seuil d'alerte :</strong> {piece.seuil_alerte}</p>
          <p className="mb-0"><strong>Prix unitaire :</strong> {Number(piece.prix_unitaire).toLocaleString()} FCFA</p>
        </div>
      </div>
      <Link to="/pieces" className="btn btn-secondary">Retour à la liste</Link>
    </div>
  );
}

export default PieceDetail;