const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('qe_access_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Falha na comunicação com o servidor.');
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
  decideApplication: (id, status) => request(`/applications/${id}/decision`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  attendance: (applicationId) => request(`/attendance/${applicationId}`),
  saveAttendance: (applicationId, data) => request(`/attendance/${applicationId}`, { method: 'POST', body: JSON.stringify(data) }),
  myProgress: () => request('/attendance/progress/mine')
};
