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

  useEffect(() => {
    api.pendingApplications()
      .then(result => setPedidos(result.applications || []))
      .catch(error => setErro(error.message))
      .finally(() => setLoading(false));
  }, []);

  const responderPedido = async (id, status) => {
    setBusyId(id);
    try {
      await api.decideApplication(id, status);
      setPedidos(anteriores => anteriores.filter(pedido => pedido.id !== id));
      alert(status === 'approved' ? 'Pedido aprovado com sucesso!' : 'Pedido recusado.');
    } catch (error) {
      alert(error.message);
    } finally {
      setBusyId(null);
    }
  };

  const sair = () => {
    api.logout();
    navigate('/ofertante');
  };

  return (
    <div className="login-wrapper pedidos-ofertante-root">
      <header className="topbar">
        <div className="brand">
          <div className="logo-square">Q.E</div>
          <div style={{ fontSize: '0.95rem' }}>Q.E. – Pedidos de Estágio</div>
        </div>
        <button className="menu-btn" onClick={() => setMenuAberto(!menuAberto)} aria-expanded={menuAberto}>☰ Menu</button>
      </header>

      {menuAberto && (
        <nav className="menu-panel">
          <a href="/painel-ofertante" onClick={e => { e.preventDefault(); navigate('/painel-ofertante'); }}>Painel Principal</a>
          <a href="/vagas-ofertadas" onClick={e => { e.preventDefault(); navigate('/vagas-ofertadas'); }}>Voltar</a>
          <a href="/ofertante" onClick={e => { e.preventDefault(); sair(); }}>Sair</a>
        </nav>
      )}

      <main className="container">
        <h1 className="title">Candidatos Interessados</h1>
        {loading && <p>Carregando solicitações...</p>}
        {erro && <p role="alert">{erro}</p>}
        {!loading && !erro && pedidos.length === 0 && <p>Não há pedidos pendentes para suas vagas.</p>}

        <div className="list-pedidos">
          {pedidos.map(p => (
            <section className="pedido-card" key={p.id}>
              <div className="pedido-topo">
                <h2>Pedido de estágio</h2>
                <span className="status-pendente">Pendente</span>
              </div>

              <div className="pedido-informacoes">
                <div className="informacao">
                  <span>Aluno</span>
                  <strong>{p.student?.profile?.full_name || 'Estudante'}</strong>
                </div>
                <div className="informacao">
                  <span>Estágio escolhido</span>
                  <strong>Vaga: {p.internship_id}</strong>
                </div>
                <div className="informacao">
                  <span>Curso</span>
                  <strong>{p.student?.course || 'Não informado'}</strong>
                </div>
                <div className="informacao">
                  <span>Matrícula</span>
                  <strong>{p.student?.registration || '—'}</strong>
                </div>
                <div className="informacao">
                  <span>Data da solicitação</span>
                  <strong>{p.applied_at ? new Date(p.applied_at).toLocaleDateString('pt-BR') : '—'}</strong>
                </div>
              </div>

              {p.message && <p className="pedido-mensagem"><strong>Mensagem do estudante:</strong> {p.message}</p>}

              <div className="pedido-acoes">
                <button type="button" className="btn-recusar" disabled={busyId === p.id} onClick={() => responderPedido(p.id, 'rejected')}>
                  {busyId === p.id ? 'Aguarde...' : 'Recusar'}
                </button>
                <button type="button" className="btn-aprovar" disabled={busyId === p.id} onClick={() => responderPedido(p.id, 'approved')}>
                  {busyId === p.id ? 'Aguarde...' : 'Aprovar'}
                </button>
              </div>
            </section>
          ))}
        </div>
      </main>

      <footer className="bottombar">
        Plataforma Q.E. – Quero Estágio | IFAP – Campus Laranjal do Jari
        <small>© 2026 – Todos os direitos reservados</small>
      </footer>
    </div>
  );
}