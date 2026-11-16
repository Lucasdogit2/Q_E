import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './VagasOfertadas.css';

export default function VagasOfertadas() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.myInternships().then(r => setVagas(r.internships || []))
      .catch(e => setErro(e.message)).finally(() => setLoading(false));
  }, []);

  return <div className="login-wrapper vagas-ofertadas-root">
    <header className="topbar"><div className="brand"><div className="logo-square">Q.E</div><div><div>Q.E. – Quero Estágio</div><div className="ifap-text">Instituto Federal do Amapá — Campus Laranjal do Jari</div></div></div>
      <button type="button" className="menu-btn" onClick={() => setMenuAberto(!menuAberto)}>☰ Menu</button></header>
    {menuAberto && <nav className="menu-panel"><a href="/painel-ofertante">Painel Principal</a><a href="/ofertar-vaga">Ofertar Nova Vaga</a><a href="/ofertante">Sair</a></nav>}
    <main className="container"><h1 className="page-title">Seus Estágios Ofertados</h1><p className="page-subtitle">Gerencie as vagas cadastradas por você.</p>
      {loading && <p>Carregando vagas...</p>}{erro && <p role="alert">{erro}</p>}
      {!loading && !erro && vagas.length === 0 && <p>Você ainda não cadastrou vagas.</p>}
      <div className="cards-container">{vagas.map(v => <div className="stage-card" key={v.id}>
        <div className="card-header"><h2>{v.title}</h2><span className="badge">{v.status === 'open' ? 'Aberta' : v.status}</span></div>
        <p>{v.description}</p><p><strong>Área:</strong> {v.area} · <strong>Local:</strong> {v.location}</p>
        <p><strong>Carga:</strong> {v.required_hours}h · <strong>Vagas:</strong> {v.vacancies}</p>
        <p>{v.start_date} até {v.end_date}</p>
        <div className="card-actions"><button className="btn-action btn-access" onClick={() => navigate('/pedidos-ofertante')}>Ver solicitações</button><button className="btn-action btn-orders" onClick={() => navigate('/detalhes-ofertante')}>Registrar frequência</button></div>
      </div>)}</div>
    </main><footer className="bottombar">Plataforma Q.E. – Quero Estágio | IFAP – Campus Laranjal do Jari</footer>
  </div>;
}