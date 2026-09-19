import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

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

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/vehicules">GarageConnect</Link>
      <div className="navbar-nav me-auto">
        <Link className="nav-link" to="/vehicules">Véhicules</Link>
        <Link className="nav-link" to="/techniciens">Techniciens</Link>
        <Link className="nav-link" to="/reparations">Réparations</Link>
        {role === 'admin' && <Link className="nav-link" to="/utilisateurs">Comptes</Link>}
      </div>
      <div className="d-flex align-items-center">
        <span className="badge bg-secondary me-3">
  {role === 'admin' ? 'Administrateur' : 'Technicien'}
</span>
        <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>
    </nav>
  );
}

export default Header;