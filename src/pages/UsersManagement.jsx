import { useEffect, useState } from 'react';
import { api } from '../services/api';

function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [techniciens, setTechniciens] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [role, setRole] = useState('technicien');
  const [technicienId, setTechnicienId] = useState('');
  const [erreurForm, setErreurForm] = useState('');

  function chargerUsers() {
    api
      .getUsers()
      .then((data) => setUsers(data))
      .catch(() => setErreur('Impossible de charger les comptes.'))
      .finally(() => setChargement(false));
  }

  useEffect(() => {
    chargerUsers();
    api.getTechniciens().then(setTechniciens).catch(() => {});
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setErreurForm('');
    try {
      await api.createUser({
        name: nom,
        email,
        password: motDePasse,
        role,
        technicien_id: role === 'technicien' ? technicienId : null,
      });
      setNom('');
      setEmail('');
      setMotDePasse('');
      setRole('technicien');
      setTechnicienId('');
      chargerUsers();
    } catch {
      setErreurForm('Impossible de créer ce compte (vérifiez les champs).');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer ce compte ?')) return;
    await api.deleteUser(id);
    chargerUsers();
  }

  if (chargement) return <p>Chargement...</p>;
  if (erreur) return <p className="erreur">{erreur}</p>;

    return (
    <div className="container mt-4">
      <h1>Gestion des comptes utilisateurs</h1>

      <form onSubmit={handleCreate} className="card p-4 mb-4" style={{ maxWidth: '500px' }}>
        <h2 className="h4">Nouveau compte</h2>
        <div className="mb-3">
          <label className="form-label">Nom</label>
          <input className="form-control" value={nom} onChange={(e) => setNom(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Mot de passe</label>
          <input type="password" className="form-control" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Rôle</label>
          <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="technicien">Technicien</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>
        {role === 'technicien' && (
          <div className="mb-3">
            <label className="form-label">Technicien associé</label>
            <select className="form-select" value={technicienId} onChange={(e) => setTechnicienId(e.target.value)} required>
              <option value="">-- Sélectionner --</option>
              {techniciens.map((t) => (
                <option key={t.id} value={t.id}>{t.prenom} {t.nom}</option>
              ))}
            </select>
          </div>
        )}
        {erreurForm && <p className="text-danger">{erreurForm}</p>}
        <button type="submit" className="btn btn-success">Créer le compte</button>
      </form>

      <h2>Comptes existants</h2>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}>Supprimer</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersManagement;