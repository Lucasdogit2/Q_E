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
    api.myApplications().then(r => setApplications(r.applications || []))
      .catch(e => setErro(e.message)).finally(() => setLoading(false));
  }, []);

  const statusLabel = { pending: 'Em análise', approved: 'Aprovado', rejected: 'Não aprovado' };
  const statusClass = { pending: 'status-pending', approved: 'status-approved', rejected: 'status-rejected' };

  return <div className="meus-estagios-body">
    <header><div className="brand" onClick={() => navigate('/painel')} style={{ cursor: 'pointer' }}><div className="logo-square">Q.E</div><div>Q.E. – Quero Estágio<div style={{ fontSize: '0.78rem' }}>Instituto Federal do Amapá — Campus Laranjal do Jari</div></div></div>
      <button className="menu-btn" onClick={() => setMenuAberto(!menuAberto)} aria-expanded={menuAberto}>☰ Menu</button></header>
    {menuAberto && <nav className="menu-panel"><a href="/painel">Painel Inicial</a><a href="/buscar">Buscar Estágios</a><a href="/" onClick={api.logout}>Sair</a></nav>}
    <main><h2>Meus Pedidos de Estágio</h2>
      {loading && <p>Carregando suas candidaturas...</p>}
      {erro && <p role="alert">{erro}</p>}
      {!loading && !erro && applications.length === 0 && <p>Você ainda não se candidatou a nenhuma vaga.</p>}
      <table className="status-table"><thead><tr><th>Estágio</th><th>Data</th><th>Status</th><th>Ação</th></tr></thead>
        <tbody>{applications.map(app => <tr key={app.id}>
          <td>{app.internship?.title || 'Estágio'}</td><td>{app.applied_at ? new Date(app.applied_at).toLocaleDateString('pt-BR') : '—'}</td>
          <td className={statusClass[app.status]}>{statusLabel[app.status] || app.status}</td>
          <td>{app.status === 'approved' && <button onClick={() => navigate('/meu-estagio-ativo')}>Acompanhar</button>}</td>
        </tr>)}</tbody></table>
    </main>
    <footer>Plataforma Q.E. – Quero Estágio | IFAP – Campus Laranjal do Jari</footer>
  </div>;
}