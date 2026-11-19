const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');

function getToken() {
  return localStorage.getItem('qe_access_token');
}

async function request(path, options = {}) {
  let response;

  try {
    const token = getToken();
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
      }
    });
  } catch {
    throw new Error('Não foi possível conectar à API Q.E. Verifique se o backend está em execução e se VITE_API_URL está correto.');
  }

  const responseText = await response.text();
  let payload = {};
  if (responseText) {
    try {
      payload = JSON.parse(responseText);
    } catch {
      payload = {};
    }
  }

  if (!response.ok) {
    throw new Error(payload.error || payload.detalhe || `Falha na comunicação com o servidor (HTTP ${response.status}).`);
  }

  return payload;
}

export const api = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (student) => request('/auth/register', { method: 'POST', body: JSON.stringify(student) }),
  me: () => request('/auth/me'),
  health: () => request('/health'),
  internships: () => request('/internships'),
  myInternships: () => request('/internships/mine'),
  createInternship: (data) => request('/internships', { method: 'POST', body: JSON.stringify(data) }),
  apply: (id, message = '') => request(`/internships/${id}/applications`, { method: 'POST', body: JSON.stringify({ message }) }),
  myApplications: () => request('/applications/mine'),
  pendingApplications: () => request('/applications/pending'),
  approvedApplications: () => request('/applications/approved'),
  decideApplication: (id, status) => request(`/applications/${id}/decision`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  attendance: (applicationId) => request(`/attendance/${applicationId}`),
  saveAttendance: (applicationId, data) => request(`/attendance/${applicationId}`, { method: 'POST', body: JSON.stringify(data) }),
  myProgress: () => request('/attendance/progress/mine'),
  logout: () => {
    localStorage.removeItem('qe_access_token');
    localStorage.removeItem('qe_user');
  }
};
