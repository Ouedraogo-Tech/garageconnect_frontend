import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import logoAtelio from '../assets/atelio-wordmark-navbar.png';

function Header({ role, onLogout }) {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await api.logout();
    } catch {
      // Même si l'appel échoue, on déconnecte localement
    }
    sessionStorage.clear();
    onLogout();
    navigate('/login');
  }

  const labels = { admin: 'Administrateur', technicien: 'Technicien', client: 'Client' };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand text-nowrap" to={role === 'client' ? '/client' : '/vehicules'}>
  <img src={logoAtelio} alt="Atelio" style={{ height: '32px' }} />
</Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navAtelio"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navAtelio">
        <div className="navbar-nav me-auto flex-wrap">
          {role === 'client' ? (
            <>
              <Link className="nav-link text-nowrap" to="/client">Mon espace</Link>
              <Link className="nav-link text-nowrap" to="/client/rendez-vous/nouveau">Prendre RDV</Link>
            </>
          ) : (
            <>
              <Link className="nav-link text-nowrap" to="/vehicules">Véhicules</Link>
              <Link className="nav-link text-nowrap" to="/techniciens">Techniciens</Link>
              <Link className="nav-link text-nowrap" to="/reparations">Réparations</Link>
              <Link className="nav-link text-nowrap" to="/pieces">Pièces</Link>
              <Link className="nav-link text-nowrap" to="/factures">Factures</Link>
              {role === 'admin' && <Link className="nav-link text-nowrap" to="/statistiques">Stats</Link>}
              {role === 'admin' && <Link className="nav-link text-nowrap" to="/rendez-vous">RDV</Link>}
              {role === 'admin' && <Link className="nav-link text-nowrap" to="/utilisateurs">Comptes</Link>}
            </>
          )}
        </div>
        <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
          <span className="badge bg-secondary text-nowrap">{labels[role] || role}</span>
          <button className="btn btn-outline-light btn-sm text-nowrap" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Header;