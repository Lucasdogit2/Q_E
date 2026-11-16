import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './BuscarEstagios.css';

export default function BuscarEstagios() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [vagas, setVagas] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.internships()
      .then(result => setVagas(result.internships || []))
      .catch(error => setErro(error.message))
      .finally(() => setLoading(false));
  }, []);

  const filtradas = vagas.filter(v => [v.title, v.area, v.location, v.description].join(' ').toLowerCase().includes(busca.toLowerCase()));

  return (
    <div className="buscar-body">
      <header>
        <div className="brand" onClick={() => navigate('/painel')} style={{ cursor: 'pointer' }}><div className="logo-square">Q.E</div><div><div>Q.E. – Quero Estágio</div><div style={{ fontSize: '0.78rem' }}>Instituto Federal do Amapá — Campus Laranjal do Jari</div></div></div>
        <button className="menu-btn" onClick={() => setMenuAberto(!menuAberto)} aria-expanded={menuAberto}>☰ Menu</button>
      </header>
      {menuAberto && <nav className="menu-panel"><a href="/painel">Painel Inicial</a><a href="/meus-estagios">Meus Estágios</a><a href="/">Sair</a></nav>}
      <main>
        <h2 style={{ textAlign: 'center', color: 'var(--azul-petroleo)', marginBottom: '30px' }}>Buscar Estágios</h2>
        <div className="filters"><input type="search" placeholder="Buscar por título, área ou local" value={busca} onChange={e => setBusca(e.target.value)} /></div>
        {loading && <p>Carregando oportunidades...</p>}
        {erro && <p role="alert">{erro}</p>}
        {!loading && !erro && filtradas.length === 0 && <p>Nenhuma vaga aberta encontrada.</p>}
        <div className="cards">
          {filtradas.map(vaga => <div className="card" key={vaga.id}>
            <div className="card-content"><div><h3>{vaga.title}</h3><p>{vaga.description}</p><p><strong>Área:</strong> {vaga.area} · <strong>Local:</strong> {vaga.location}</p><p><strong>Carga horária:</strong> {vaga.required_hours}h · <strong>Vagas:</strong> {vaga.vacancies}</p><p>{vaga.start_date} até {vaga.end_date}</p></div>
            <button onClick={() => navigate('/detalhes', { state: { internship: vaga } })}>Candidatar-se</button></div>
          </div>)}
        </div>
      </main>
      <footer>Plataforma Q.E. – Quero Estágio | IFAP – Campus Laranjal do Jari</footer>
    </div>
  );
}