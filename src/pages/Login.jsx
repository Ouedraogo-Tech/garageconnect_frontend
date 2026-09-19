import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur('');
    setChargement(true);

    try {
      const data = await api.login(email, password);
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('role', data.role);
      sessionStorage.setItem('name', data.name);
      onLogin(data.role);
      navigate('/vehicules');
    } catch {
      setErreur('Identifiants invalides.');
    } finally {
      setChargement(false);
    }

    const data = await api.login(email, password);
sessionStorage.setItem('token', data.token);
sessionStorage.setItem('role', data.role);
sessionStorage.setItem('name', data.name);
sessionStorage.setItem('technicienId', data.technicien_id ?? '');
onLogin(data.role);
navigate('/vehicules');
  }

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h1 className="text-center mb-4">GarageConnect</h1>
      <form onSubmit={handleSubmit} className="card p-4">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Mot de passe</label>
          <input
            id="password"
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {erreur && <p className="text-danger">{erreur}</p>}
        <button type="submit" className="btn btn-primary w-100" disabled={chargement}>
          {chargement ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}

export default Login;