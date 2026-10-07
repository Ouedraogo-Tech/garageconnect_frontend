import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Chargement from '../components/Chargement';
import MessageErreur from '../components/MessageErreur';

function carte(titre, valeur, couleur = 'primary') {
  return (
    <div className="col-md-4 col-lg-3 mb-3">
      <div className={`card stat-card accent-${couleur}`}>
        <div className="card-body text-center">
          <h6 className="text-muted mb-1">{titre}</h6>
          <h3 className={`text-${couleur} mb-0`}>{valeur}</h3>
        </div>
      </div>
    </div>
  );
}

function BarreRepartition({ repartition }) {
  const total = repartition.en_cours + repartition.signalee + repartition.terminee;
  if (total === 0) return <p className="text-muted">Aucune réparation.</p>;

  const pct = (n) => (n / total) * 100;

  return (
    <div style={{ maxWidth: '600px' }}>
      <div className="progress mb-2" style={{ height: '24px' }}>
        <div className="progress-bar bg-warning" style={{ width: `${pct(repartition.en_cours)}%` }}>
          {repartition.en_cours > 0 && repartition.en_cours}
        </div>
        <div className="progress-bar bg-info" style={{ width: `${pct(repartition.signalee)}%` }}>
          {repartition.signalee > 0 && repartition.signalee}
        </div>
        <div className="progress-bar bg-success" style={{ width: `${pct(repartition.terminee)}%` }}>
          {repartition.terminee > 0 && repartition.terminee}
        </div>
      </div>
      <div className="d-flex gap-3 small">
        <span><span className="badge bg-warning">&nbsp;</span> En cours ({repartition.en_cours})</span>
        <span><span className="badge bg-info">&nbsp;</span> Signalée ({repartition.signalee})</span>
        <span><span className="badge bg-success">&nbsp;</span> Terminée ({repartition.terminee})</span>
      </div>
    </div>
  );
}

function GraphiqueCA({ donnees }) {
  const max = Math.max(...donnees.map((d) => d.montant), 1);

  return (
    <div className="d-flex align-items-end gap-3" style={{ height: '160px', maxWidth: '600px' }}>
      {donnees.map((d) => (
        <div key={d.mois} className="d-flex flex-column align-items-center flex-fill">
          <div
            className="bg-primary rounded-top w-100"
            style={{ height: `${Math.max((d.montant / max) * 120, 2)}px` }}
            title={`${Number(d.montant).toLocaleString('fr-FR')} FCFA`}
          />
          <small className="text-muted mt-1">{d.mois}</small>
        </div>
      ))}
    </div>
  );
}

function Statistiques() {
  const [stats, setStats] = useState(null);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    api.getStatistiques().then(setStats).catch(() => setErreur('Impossible de charger les statistiques.'));
  }, []);

  if (erreur) return <div className="container mt-4"><MessageErreur message={erreur} /></div>;
  if (!stats) return <div className="container mt-4"><Chargement /></div>;

  const formatFCFA = (n) => `${Number(n).toLocaleString('fr-FR')} FCFA`;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Statistiques</h1>

      <h2 className="h5">Vue d'ensemble</h2>
      <div className="row">
        {carte('Véhicules', stats.vehicules_total)}
        {carte('Clients', stats.clients_total)}
        {carte('Techniciens', stats.techniciens_total)}
        {carte('Réparations (total)', stats.reparations_total)}
        {carte('Réparations ce mois-ci', stats.reparations_mois, 'info')}
        {carte('Pièces en alerte stock', stats.pieces_en_alerte, stats.pieces_en_alerte > 0 ? 'danger' : 'success')}
        {carte('Délai moyen de réparation', stats.delai_moyen_jours !== null ? `${stats.delai_moyen_jours} j` : 'N/A', 'secondary')}
      </div>

      <h2 className="h5 mt-4">Facturation</h2>
      <div className="row">
        {carte('Chiffre d\'affaires encaissé', formatFCFA(stats.chiffre_affaires), 'success')}
        {carte('CA ce mois-ci', formatFCFA(stats.chiffre_affaires_mois), 'success')}
        {carte('Factures impayées', stats.factures_impayees_nombre, 'warning')}
        {carte('Montant impayé', formatFCFA(stats.factures_impayees_montant), 'warning')}
        {carte('Total factures émises', stats.factures_total)}
      </div>

      <h2 className="h5 mt-4">Évolution du chiffre d'affaires (6 derniers mois)</h2>
      <GraphiqueCA donnees={stats.ca_par_mois} />

      <h2 className="h5 mt-4">Rendez-vous</h2>
      <div className="row">
        {carte('En attente', stats.rdv_en_attente, 'warning')}
        {carte('Confirmés', stats.rdv_confirmes, 'success')}
        {carte('Taux de confirmation', stats.taux_confirmation_rdv !== null ? `${stats.taux_confirmation_rdv}%` : 'N/A', 'primary')}
      </div>

      <h2 className="h5 mt-4">Répartition des réparations en cours</h2>
      <BarreRepartition repartition={stats.repartition_reparations} />

      <h2 className="h5 mt-4">Techniciens les plus sollicités</h2>
      <ul className="list-group" style={{ maxWidth: '500px' }}>
        {stats.top_techniciens.map((t) => (
          <li key={t.id} className="list-group-item d-flex justify-content-between">
            <span>{t.prenom} {t.nom}</span>
            <span className="badge bg-primary rounded-pill">{t.reparations_count} réparation(s)</span>
          </li>
        ))}
        {stats.top_techniciens.length === 0 && <li className="list-group-item">Aucune donnée.</li>}
      </ul>
    </div>
  );
}

export default Statistiques;