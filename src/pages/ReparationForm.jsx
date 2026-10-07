import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

const VIDE = {
  vehicule_id: '',
  date: '',
  date_fin_prevue: '',
  date_fin_reelle: '',
  duree_main_oeuvre: '',
  objet_reparation: '',
  techniciens: [],
  pieces: [],
};

function ReparationForm() {
  const { id } = useParams();
  const estEdition = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState(VIDE);
  const [vehicules, setVehicules] = useState([]);
  const [techniciens, setTechniciens] = useState([]);
  const [pieces, setPieces] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const promesses = [api.getVehiculesAll(), api.getTechniciensAll(), api.getPiecesAll()];
    if (estEdition) promesses.push(api.getReparation(id));

    Promise.all(promesses)
      .then(([vehiculesData, techniciensData, piecesData, reparationData]) => {
        setVehicules(vehiculesData);
        setTechniciens(techniciensData);
        setPieces(piecesData);
        if (reparationData) {
          setForm({
            vehicule_id: reparationData.vehicule.id,
            date: reparationData.date,
            date_fin_prevue: reparationData.date_fin_prevue || '',
            date_fin_reelle: reparationData.date_fin_reelle || '',
            duree_main_oeuvre: reparationData.duree_main_oeuvre,
            objet_reparation: reparationData.objet_reparation,
            techniciens: reparationData.techniciens.map((t) => t.id),
            pieces: reparationData.pieces.map((p) => ({ piece_id: p.id, quantite: p.pivot.quantite_utilisee })),
          });
        }
      })
      .catch(() => setErreur('Impossible de charger les données.'))
      .finally(() => setChargement(false));
  }, [id, estEdition]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function toggleTechnicien(technicienId) {
    setForm((prev) => {
      const dejaCoche = prev.techniciens.includes(technicienId);
      return {
        ...prev,
        techniciens: dejaCoche
          ? prev.techniciens.filter((tid) => tid !== technicienId)
          : [...prev.techniciens, technicienId],
      };
    });
  }

  function togglePiece(pieceId) {
    setForm((prev) => {
      const existe = prev.pieces.find((p) => p.piece_id === pieceId);
      if (existe) {
        return { ...prev, pieces: prev.pieces.filter((p) => p.piece_id !== pieceId) };
      }
      return { ...prev, pieces: [...prev.pieces, { piece_id: pieceId, quantite: 1 }] };
    });
  }

  function changerQuantitePiece(pieceId, quantite) {
    setForm((prev) => ({
      ...prev,
      pieces: prev.pieces.map((p) => (p.piece_id === pieceId ? { ...p, quantite: Number(quantite) } : p)),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur('');
    try {
      if (estEdition) {
        await api.updateReparation(id, form);
      } else {
        await api.createReparation(form);
      }
      navigate('/reparations');
    } catch {
      setErreur('Impossible d\'enregistrer cette réparation (vérifiez les champs).');
    }
  }

  if (chargement) return <div className="container mt-4"><p>Chargement...</p></div>;

  return (
    <div className="container mt-4" style={{ maxWidth: '600px' }}>
      <h1>{estEdition ? 'Modifier la réparation' : 'Nouvelle réparation'}</h1>
      <form onSubmit={handleSubmit} className="card p-4">
        <div className="mb-3">
          <label className="form-label">Véhicule</label>
          <select className="form-select" name="vehicule_id" value={form.vehicule_id} onChange={handleChange} required>
            <option value="">-- Sélectionner --</option>
            {vehicules.map((v) => (
              <option key={v.id} value={v.id}>{v.marque} {v.modele} ({v.immatriculation})</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Date de prise en charge</label>
          <input type="date" className="form-control" name="date" value={form.date} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Date de fin prévue</label>
          <input type="date" className="form-control" name="date_fin_prevue" value={form.date_fin_prevue} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Date de fin réelle (véhicule prêt)</label>
          <input type="date" className="form-control" name="date_fin_reelle" value={form.date_fin_reelle} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Durée main d'œuvre (h)</label>
          <input type="number" step="0.5" min="0" max="24" className="form-control" name="duree_main_oeuvre" value={form.duree_main_oeuvre} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Objet de la réparation</label>
          <input className="form-control" name="objet_reparation" value={form.objet_reparation} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Techniciens</label>
          {techniciens.map((t) => (
            <div className="form-check" key={t.id}>
              <input className="form-check-input" type="checkbox" id={`tech-${t.id}`}
                checked={form.techniciens.includes(t.id)} onChange={() => toggleTechnicien(t.id)} />
              <label className="form-check-label" htmlFor={`tech-${t.id}`}>{t.prenom} {t.nom}</label>
            </div>
          ))}
        </div>

        <div className="mb-3">
          <label className="form-label">Pièces utilisées</label>
          {pieces.map((p) => {
            const selectionnee = form.pieces.find((fp) => fp.piece_id === p.id);
            return (
              <div className="d-flex align-items-center gap-2 mb-1" key={p.id}>
                <div className="form-check flex-grow-1">
                  <input className="form-check-input" type="checkbox" id={`piece-${p.id}`}
                    checked={!!selectionnee} onChange={() => togglePiece(p.id)} />
                  <label className="form-check-label" htmlFor={`piece-${p.id}`}>
                    {p.nom} ({p.reference}) — {Number(p.prix_unitaire).toLocaleString()} FCFA
                  </label>
                </div>
                {selectionnee && (
                  <input type="number" min="1" className="form-control" style={{ width: '80px' }}
                    value={selectionnee.quantite}
                    onChange={(e) => changerQuantitePiece(p.id, e.target.value)} />
                )}
              </div>
            );
          })}
        </div>

        {erreur && <p className="text-danger">{erreur}</p>}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">{estEdition ? 'Enregistrer' : 'Créer'}</button>
          <Link to="/reparations" className="btn btn-secondary">Annuler</Link>
        </div>
      </form>
    </div>
  );
}

export default ReparationForm;