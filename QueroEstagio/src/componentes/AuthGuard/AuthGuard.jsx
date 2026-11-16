import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { api } from '../../services/api';

export default function AuthGuard({ allowedRoles }) {
  const [state, setState] = useState({ loading: true, user: null });

  useEffect(() => {
    let active = true;
    api.me()
      .then(result => { if (active) setState({ loading: false, user: result.user }); })
      .catch(() => {
        localStorage.removeItem('qe_access_token');
        localStorage.removeItem('qe_user');
        if (active) setState({ loading: false, user: null });
      });
    return () => { active = false; };
  }, []);

  if (state.loading) return <main style={{ padding: 32 }}>Verificando sessão...</main>;
  if (!state.user) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(state.user.role)) {
    return <Navigate to={state.user.role === 'staff' ? '/painel-ofertante' : '/painel'} replace />;
  }
  return <Outlet />;
}
