import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './PedidosEstagio.css';

export default function PedidosEstagio() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [busyId, setBusyId] = useState(null);
  const navigate = useNavigate();

  const carregar = () => api.pendingApplications()
    .then(r => setPedidos(r.applications || []))
    .catch(e => setErro(e.message))
    .finally(() => setLoading(false));

  useEffect(() => { carregar(); }, []);

  const responder = async (id, status) => {
    setBusyId(id);
    try {
      await api.decideApplication(id, status);
      setPedidos(old => old.filter(p => p.id !== id));
    } catch (e) { alert(e.message); }
    finally { setBusyId(null); }
  };

  return <div className="login-wrapper pedidos-ofertante-root">
    <header className="topbar"><div className="brand"><div className="logo-square">Q.E</div><div>Q.E. – Pedidos de Estágio</div></div>
      <button className="menu-btn" onClick={() => setMenuAberto(!menuAberto)}>☰ Menu</button></header>
    {menuAberto && <nav className="menu-panel"><a href="/painel-ofertante">Painel</a><a href="/vagas-ofertadas">Voltar</a><a href="/ofertante">Sair</a></nav>}
    <main className="container"><h1 className="title">Candidatos Interessados</h1>
      {loading && <p>Carregando solicitações...</p>}{erro && <p role="alert">{erro}</p>}
      {!loading && !erro && pedidos.length === 0 && <p>Não há pedidos pendentes para suas vagas.</p>}
      <div className="list-pedidos">{pedidos.map(p => <div key={p.id} className="pedido-card">
        <div className="pedido-info"><strong>{p.student?.profile?.full_name || 'Estudante'}</strong>
          <p>{p.student?.course || 'Curso não informado'} · Matrícula: {p.student?.registration || '—'}</p>
          <p>Vaga: {p.internship_id} · Enviado em {p.applied_at ? new Date(p.applied_at).toLocaleDateString('pt-BR') : '—'}</p>
          {p.message && <p>Mensagem: {p.message}</p>}
        </div><div className="pedido-actions">
          <button className="btn-approve" disabled={busyId === p.id} onClick={() => responder(p.id, 'approved')}>Aprovar</button>
          <button className="btn-reject" disabled={busyId === p.id} onClick={() => responder(p.id, 'rejected')}>Recusar</button>
        </div>
      </div>)}</div>
    </main><footer className="bottombar">Q.E. – Quero Estágio | IFAP</footer>
  </div>;
}