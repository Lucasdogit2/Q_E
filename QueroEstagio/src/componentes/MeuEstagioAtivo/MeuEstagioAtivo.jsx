import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './MeuEstagioAtivo.css';

export default function MeuEstagioAtivo() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.myProgress()
      .then(result => setProgress(result.progress || []))
      .catch(error => setErro(error.message))
      .finally(() => setLoading(false));
  }, []);

  const sair = () => {
    api.logout();
    navigate('/');
  };

  return (
    <div className="estagio-ativo-body">
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
          <a href="/buscar" onClick={e => { e.preventDefault(); navigate('/buscar'); }}>Buscar Estágios</a>
          <a href="/meus-estagios" onClick={e => { e.preventDefault(); navigate('/meus-estagios'); }}>Meus Estágios</a>
          <a href="/" onClick={e => { e.preventDefault(); sair(); }}>Sair</a>
        </nav>
      )}

      <div className="extra-mascot">🐢</div>

      <main className="estagio-ativo-main">
        <h2>Informações do Estágio</h2>
        {loading && <p>Carregando seu progresso...</p>}
        {erro && <p role="alert">{erro}</p>}
        {!loading && !erro && progress.length === 0 && <p>Você ainda não possui estágio aprovado com progresso registrado.</p>}

        {progress.map(item => {
          const completed = Number(item.completed_hours || 0);
          const required = Number(item.required_hours || 0);
          const remaining = Math.max(0, required - completed);
          const percentage = required > 0 ? Math.min(100, Math.round(completed / required * 100)) : 0;

          return (
            <section className="frequencia" key={item.application_id}>
              <h3>Estágio #{item.internship_id}</h3>
              <div className="info-grid">
                <div className="info-card"><span className="icon">📍</span><p>Local do estágio registrado na vaga</p></div>
                <div className="info-card"><span className="icon">📅</span><p>Carga horária total: {required}h</p></div>
                <div className="info-card"><span className="icon">🕒</span><p>Horas cumpridas: {completed}h</p></div>
                <div className="info-card"><span className="icon">⏳</span><p>Horas restantes: {remaining}h</p></div>
              </div>

              <h4>Minha Frequência</h4>
              <p>Status: {remaining === 0 ? 'Carga horária concluída' : 'Em andamento'}</p>
              <p>Conclusão: {percentage}%</p>
              <div className="frequencia-bar">
                <div className="frequencia-bar-inner" style={{ width: percentage + '%' }}>{percentage}%</div>
              </div>
            </section>
          );
        })}
      </main>

      <footer>
        Plataforma Q.E. – Quero Estágio | Vinculada ao Instituto Federal do Amapá – Campus Laranjal do Jari
        <small>© 2026 – Todos os direitos reservados</small>
        <div className="mascot">🐢</div>
      </footer>
    </div>
  );
}