import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './BuscarEstagios.css';

export default function BuscarEstagios() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [vagas, setVagas] = useState([]);
  const [busca, setBusca] = useState('');
  const [tipo, setTipo] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let ativo = true;
    api.internships()
      .then(result => { if (ativo) setVagas(result.internships || []); })
      .catch(error => { if (ativo) setErro(error.message); })
      .finally(() => { if (ativo) setLoading(false); });
    return () => { ativo = false; };
  }, []);

  const filtradas = useMemo(() => vagas.filter(vaga => {
    const texto = [vaga.title, vaga.area, vaga.location, vaga.description].join(' ').toLowerCase();
    const correspondeTexto = texto.includes(busca.toLowerCase());
    const correspondeTipo = tipo === 'todos' || String(vaga.type || 'interno').toLowerCase() === tipo;
    return correspondeTexto && correspondeTipo;
  }), [vagas, busca, tipo]);

  const sair = () => {
    api.logout();
    navigate('/');
  };

  return (
    <div className="buscar-body">
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
          <a href="/painel" onClick={e => { e.preventDefault(); navigate('/painel'); }}>Painel Inicial</a>
          <a href="/meus-estagios" onClick={e => { e.preventDefault(); navigate('/meus-estagios'); }}>Meus Estágios</a>
          <a href="/" onClick={e => { e.preventDefault(); sair(); }}>Sair</a>
        </nav>
      )}

      <main>
        <h2 style={{ textAlign: 'center', color: 'var(--azul-petroleo)', marginBottom: '30px' }}>
          Buscar Estágios
        </h2>

        <div className="filters">
          <select className="tipo" value={tipo} onChange={e => setTipo(e.target.value)}>
            <option value="todos">Todos os tipos</option>
            <option value="interno">Interno</option>
            <option value="externo">Externo</option>
          </select>
          <input type="search" placeholder="Nome do estágio, área ou local" value={busca} onChange={e => setBusca(e.target.value)} />
          <button type="button" onClick={() => { setBusca(''); setTipo('todos'); }}>Limpar filtros</button>
        </div>

        {loading && <p>Carregando oportunidades...</p>}
        {erro && <p role="alert">{erro}</p>}
        {!loading && !erro && filtradas.length === 0 && <p>Nenhuma vaga aberta encontrada.</p>}

        <div className="cards">
          {filtradas.map(vaga => (
            <div className="card" key={vaga.id}>
              <div className="card-content">
                <div>
                  <h3>{vaga.title}</h3>
                  <p>{vaga.description}</p>
                  <p><strong>Área:</strong> {vaga.area} · <strong>Local:</strong> {vaga.location}</p>
                  <p><strong>Carga horária:</strong> {vaga.required_hours}h · <strong>Vagas:</strong> {vaga.vacancies}</p>
                  <p>{vaga.start_date} até {vaga.end_date}</p>
                </div>
                <button type="button" onClick={() => navigate('/detalhes', { state: { internship: vaga } })}>
                  Acessar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer>
        Plataforma Q.E. – Quero Estágio | Vinculada ao Instituto Federal do Amapá – Campus Laranjal do Jari
        <small>© 2026 – Todos os direitos reservados</small>
        <div className="mascot">🐢</div>
      </footer>
    </div>
  );
}