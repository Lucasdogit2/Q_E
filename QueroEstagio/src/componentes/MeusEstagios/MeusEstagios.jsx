import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './MeusEstagios.css';

export default function MeusEstagios() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.myApplications()
      .then(result => setApplications(result.applications || []))
      .catch(error => setErro(error.message))
      .finally(() => setLoading(false));
  }, []);

  const statusInfo = {
    pending: { label: 'Em análise', className: 'status-pending' },
    approved: { label: 'Aprovado', className: 'status-approved' },
    rejected: { label: 'Não aprovado', className: 'status-rejected' }
  };

  const sair = () => {
    api.logout();
    navigate('/');
  };

  return (
    <div className="meus-estagios-body">
      <header>
        <div className="brand" onClick={() => navigate('/painel')} style={{ cursor: 'pointer' }}>
          <div className="logo-square">Q.E</div>
          <div>
            <div>Q.E. – Quero Estágio</div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.9)' }}>
              Instituto Federal do Amapá — Campus Laranjal do Jari
            </div>
          </div>
        </div>
        <button className="menu-btn" onClick={() => setMenuAberto(!menuAberto)} aria-expanded={menuAberto}>☰ Menu</button>
      </header>

      {menuAberto && (
        <nav className="menu-panel">
          <a href="/painel" onClick={e => { e.preventDefault(); setMenuAberto(false); navigate('/painel'); }}>Painel Inicial</a>
          <a href="/buscar" onClick={e => { e.preventDefault(); setMenuAberto(false); navigate('/buscar'); }}>Buscar Estágios</a>
          <a href="/" onClick={e => { e.preventDefault(); sair(); }}>Sair</a>
        </nav>
      )}

      <main>
        <h2>Meus Pedidos de Estágio</h2>
        {loading && <p>Carregando suas candidaturas...</p>}
        {erro && <p role="alert">{erro}</p>}
        {!loading && !erro && applications.length === 0 && <p>Você ainda não se candidatou a nenhuma vaga.</p>}

        <table className="status-table">
          <thead>
            <tr><th>Estágio</th><th>Data da solicitação</th><th>Status</th><th>Ação</th></tr>
          </thead>
          <tbody>
            {applications.map(app => {
              const status = statusInfo[app.status] || { label: app.status, className: '' };
              return (
                <tr key={app.id}>
                  <td>{app.internship?.title || 'Estágio'}</td>
                  <td>{app.applied_at ? new Date(app.applied_at).toLocaleDateString('pt-BR') : '—'}</td>
                  <td className={status.className}>{status.label}</td>
                  <td>{app.status === 'approved' && <button onClick={() => navigate('/meu-estagio-ativo')}>Acessar Meu Estágio</button>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {applications.some(app => app.status === 'approved') && (
          <div className="approved-stage">
            <h3>Você possui estágio aprovado</h3>
            <p>Acompanhe suas horas e o progresso do estágio.</p>
            <button onClick={() => navigate('/meu-estagio-ativo')}>Acompanhar estágio</button>
          </div>
        )}
      </main>

      <footer>
        Plataforma Q.E. – Quero Estágio | Vinculada ao Instituto Federal do Amapá – Campus Laranjal do Jari
        <small>© 2026 – Todos os direitos reservados</small>
        <div className="mascot">🐢</div>
      </footer>
    </div>
  );
}