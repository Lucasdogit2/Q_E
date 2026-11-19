import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './VagasOfertadas.css';

export default function VagasOfertadas() {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const [vagas, setVagas] = useState([]);
  const [estagioSelecionado, setEstagioSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.myInternships()
      .then(result => setVagas(result.internships || []))
      .catch(error => setErro(error.message))
      .finally(() => setLoading(false));
  }, []);

  const sair = () => {
    api.logout();
    navigate('/ofertante');
  };

  return (
    <div className="login-wrapper vagas-ofertadas-root">
      <header className="topbar">
        <div className="brand">
          <div className="logo-square">Q.E</div>
          <div>
            <div style={{ fontSize: '0.95rem' }}>Q.E. – Quero Estágio</div>
            <div className="ifap-text">Instituto Federal do Amapá — Campus Laranjal do Jari</div>
          </div>
        </div>
        <button type="button" className="menu-btn" onClick={() => setMenuAberto(!menuAberto)} aria-expanded={menuAberto}>☰ Menu</button>
      </header>

      {menuAberto && (
        <nav className="menu-panel">
          <a href="/painel-ofertante" onClick={e => { e.preventDefault(); navigate('/painel-ofertante'); }}>Painel Principal</a>
          <a href="/ofertar-vaga" onClick={e => { e.preventDefault(); navigate('/ofertar-vaga'); }}>Ofertar Nova Vaga</a>
          <a href="/ofertante" onClick={e => { e.preventDefault(); sair(); }} style={{ color: '#FF7F50', fontWeight: 'bold' }}>Sair</a>
        </nav>
      )}

      <main className="container">
        <h1 className="page-title">Seus Estágios Ofertados</h1>
        <p className="page-subtitle">Gerencie os estágios e os estudantes vinculados aos seus projetos.</p>

        {loading && <p>Carregando vagas...</p>}
        {erro && <p role="alert">{erro}</p>}
        {!loading && !erro && vagas.length === 0 && <p>Você ainda não cadastrou vagas.</p>}

        <div className="cards-container">
          {vagas.map(vaga => (
            <div className="stage-card" key={vaga.id}>
              <div className="card-header">
                <h2>{vaga.title}</h2>
                <span className={`badge ${vaga.status === 'open' ? 'interno' : ''}`}>
                  {vaga.status === 'open' ? 'Aberta' : vaga.status === 'closed' ? 'Encerrada' : vaga.status === 'cancelled' ? 'Cancelada' : vaga.status}
                </span>
              </div>
              <p>{vaga.description}</p>
              <p><strong>Área:</strong> {vaga.area} · <strong>Local:</strong> {vaga.location}</p>
              <p><strong>Carga horária:</strong> {vaga.required_hours} horas</p>
              <p><strong>Número de vagas:</strong> {vaga.vacancies}</p>
              <p><strong>Período:</strong> {vaga.start_date} até {vaga.end_date}</p>
              <div className="card-actions">
                <button type="button" className="btn-action btn-access" onClick={() => navigate('/pedidos-ofertante')}>Solicitações</button>
                <button type="button" className="btn-action btn-orders" onClick={() => navigate('/detalhes-ofertante')}>Lista de Estagiários / Frequência</button>
                <button type="button" className="btn-action btn-orders" onClick={() => setEstagioSelecionado(vaga)}>Informações gerais</button>
              </div>
            </div>
          ))}
        </div>

        {estagioSelecionado && (
          <div className="modal-overlay" onClick={() => setEstagioSelecionado(null)}>
            <section className="modal-informacoes" role="dialog" aria-modal="true" aria-labelledby="titulo-modal" onClick={e => e.stopPropagation()}>
              <button type="button" className="btn-fechar" onClick={() => setEstagioSelecionado(null)} aria-label="Fechar">×</button>
              <h2 id="titulo-modal">Informações do Estágio</h2>
              <h3>{estagioSelecionado.title}</h3>
              <p>{estagioSelecionado.description}</p>
              <p><strong>Área:</strong> {estagioSelecionado.area}</p>
              <p><strong>Local:</strong> {estagioSelecionado.location}</p>
              <p><strong>Número de vagas:</strong> {estagioSelecionado.vacancies}</p>
              <p><strong>Carga horária:</strong> {estagioSelecionado.required_hours} horas</p>
              <p><strong>Data de início:</strong> {estagioSelecionado.start_date}</p>
              <p><strong>Data de término:</strong> {estagioSelecionado.end_date}</p>
              <div className="modal-acoes">
                <button type="button" className="btn-action btn-cancelar" onClick={() => setEstagioSelecionado(null)}>Fechar</button>
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="bottombar">
        Plataforma Q.E. – Quero Estágio | IFAP – Campus Laranjal do Jari
        <small>© 2026 – Todos os direitos reservados</small>
      </footer>
    </div>
  );
}