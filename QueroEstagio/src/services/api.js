const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Falha na comunicação com o servidor.');
  return payload;
}

export const api = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (student) => request('/auth/register', { method: 'POST', body: JSON.stringify(student) }),
  me: (token) => request('/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
  health: () => request('/health')
};
