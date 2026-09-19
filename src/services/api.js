const API_BASE_URL = import.meta.env.VITE_API_URL;

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

    getVehicules: (recherche = '') =>
    request(`/vehicules${recherche ? `?recherche=${encodeURIComponent(recherche)}` : ''}`),
  getVehicule: (id) => request(`/vehicules/${id}`),
    createVehicule: (data) =>
    request('/vehicules', { method: 'POST', body: JSON.stringify(data) }),
  updateVehicule: (id, data) =>
    request(`/vehicules/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteVehicule: (id) => request(`/vehicules/${id}`, { method: 'DELETE' }),

      getReparations: (recherche = '') =>
    request(`/reparations${recherche ? `?recherche=${encodeURIComponent(recherche)}` : ''}`),
    getReparation: (id) => request(`/reparations/${id}`),
      createReparation: (data) =>
    request('/reparations', { method: 'POST', body: JSON.stringify(data) }),
  updateReparation: (id, data) =>
    request(`/reparations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteReparation: (id) => request(`/reparations/${id}`, { method: 'DELETE' }),

      getTechniciens: (recherche = '') =>
    request(`/techniciens${recherche ? `?recherche=${encodeURIComponent(recherche)}` : ''}`),
  getTechnicien: (id) => request(`/techniciens/${id}`),
    createTechnicien: (data) =>
    request('/techniciens', { method: 'POST', body: JSON.stringify(data) }),
  updateTechnicien: (id, data) =>
    request(`/techniciens/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTechnicien: (id) => request(`/techniciens/${id}`, { method: 'DELETE' }),
  
  getUsers: () => request('/users'),
  createUser: (data) =>
    request('/users', { method: 'POST', body: JSON.stringify(data) }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),
};