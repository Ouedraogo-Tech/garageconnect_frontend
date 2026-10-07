const API_BASE_URL = 'http://127.0.0.1:8000/api';

function getToken() {
  return sessionStorage.getItem('token');
}

async function request(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw { status: response.status, ...error };
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  login: (email, password) =>
    request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () => request('/logout', { method: 'POST' }),

  register: (data) =>
    request('/register', { method: 'POST', body: JSON.stringify(data) }),

  getRendezVous: (filtres = {}) => {
    const params = new URLSearchParams();
    if (filtres.statut) params.append('statut', filtres.statut);
    if (filtres.date_debut) params.append('date_debut', filtres.date_debut);
    if (filtres.date_fin) params.append('date_fin', filtres.date_fin);
    const query = params.toString();
    return request(`/rendez-vous${query ? `?${query}` : ''}`);
  },
  getRendezVousUn: (id) => request(`/rendez-vous/${id}`),
  createRendezVous: (data) =>
    request('/rendez-vous', { method: 'POST', body: JSON.stringify(data) }),
  updateRendezVous: (id, data) =>
    request(`/rendez-vous/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteRendezVous: (id) => request(`/rendez-vous/${id}`, { method: 'DELETE' }),

  getVehicules: (recherche = '', page = 1) =>
    request(`/vehicules?recherche=${encodeURIComponent(recherche)}&page=${page}`),
  getVehicule: (id) => request(`/vehicules/${id}`),
  createVehicule: (data) =>
    request('/vehicules', { method: 'POST', body: JSON.stringify(data) }),
  updateVehicule: (id, data) =>
    request(`/vehicules/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteVehicule: (id) => request(`/vehicules/${id}`, { method: 'DELETE' }),

  getReparations: (recherche = '', page = 1, filtres = {}) => {
    const params = new URLSearchParams();
    params.append('recherche', recherche);
    params.append('page', page);
    if (filtres.statut) params.append('statut', filtres.statut);
    if (filtres.technicien_id) params.append('technicien_id', filtres.technicien_id);
    if (filtres.date_debut) params.append('date_debut', filtres.date_debut);
    if (filtres.date_fin) params.append('date_fin', filtres.date_fin);
    return request(`/reparations?${params.toString()}`);
  },
  getReparation: (id) => request(`/reparations/${id}`),
  createReparation: (data) =>
    request('/reparations', { method: 'POST', body: JSON.stringify(data) }),
  updateReparation: (id, data) =>
    request(`/reparations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteReparation: (id) => request(`/reparations/${id}`, { method: 'DELETE' }),
  signalerReparationTerminee: (id) =>
    request(`/reparations/${id}/signaler-terminee`, { method: 'PUT' }),

  getTechniciens: (recherche = '', page = 1) =>
    request(`/techniciens?recherche=${encodeURIComponent(recherche)}&page=${page}`),
  getTechnicien: (id) => request(`/techniciens/${id}`),
  createTechnicien: (data) =>
    request('/techniciens', { method: 'POST', body: JSON.stringify(data) }),
  updateTechnicien: (id, data) =>
    request(`/techniciens/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTechnicien: (id) => request(`/techniciens/${id}`, { method: 'DELETE' }),

  getPieces: (recherche = '', page = 1) =>
    request(`/pieces?recherche=${encodeURIComponent(recherche)}&page=${page}`),
  getPiece: (id) => request(`/pieces/${id}`),
  createPiece: (data) =>
    request('/pieces', { method: 'POST', body: JSON.stringify(data) }),
  updatePiece: (id, data) =>
    request(`/pieces/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePiece: (id) => request(`/pieces/${id}`, { method: 'DELETE' }),

  getVehiculesAll: () => request('/vehicules?all=1'),
  getTechniciensAll: () => request('/techniciens?all=1'),
  getPiecesAll: () => request('/pieces?all=1'),
  getReparationsAll: () => request('/reparations?all=1'),
  getClientsAll: () => request('/clients'),

  getFactures: (recherche = '', page = 1) =>
    request(`/factures?recherche=${encodeURIComponent(recherche)}&page=${page}`),
  getFacture: (id) => request(`/factures/${id}`),
  createFacture: (reparation_id) =>
    request('/factures', { method: 'POST', body: JSON.stringify({ reparation_id }) }),
  updateFacture: (id, statut) =>
    request(`/factures/${id}`, { method: 'PUT', body: JSON.stringify({ statut }) }),
  deleteFacture: (id) => request(`/factures/${id}`, { method: 'DELETE' }),

  getUsers: () => request('/users'),
  createUser: (data) =>
    request('/users', { method: 'POST', body: JSON.stringify(data) }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),
  getStatistiques: () => request('/statistiques'),

  getFacturePdf: async (id) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/factures/${id}/pdf`, {
    headers: {
      Accept: 'application/pdf',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    throw { status: response.status };
  }
  return response.blob();
},
};