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
    api.myProgress().then(r => setProgress(r.progress || []))
      .catch(e => setErro(e.message)).finally(() => setLoading(false));
  }, []);

  return <div className="estagio-ativo-body">
    <header><div className="brand" onClick={() => navigate('/painel')} style={{ cursor: 'pointer' }}><div className="logo-square">Q.E</div><div>Q.E. – Quero Estágio<div style={{ fontSize: '0.78rem' }}>Instituto Federal do Amapá — Campus Laranjal do Jari</div></div></div>
      <button className="menu-btn" onClick={() => setMenuAberto(!menuAberto)}>☰ Menu</button></header>
    {menuAberto && <nav className="menu-panel"><a href="/painel">Painel Inicial</a><a href="/meus-estagios">Meus Estágios</a><a href="/" onClick={api.logout}>Sair</a></nav>}
    <main className="estagio-ativo-main"><h2>Progresso dos Estágios Aprovados</h2>
      {loading && <p>Carregando progresso...</p>}{erro && <p role="alert">{erro}</p>}
      {!loading && !erro && progress.length === 0 && <p>Você ainda não possui estágio aprovado com progresso registrado.</p>}
      {progress.map(item => {
        const done = Number(item.completed_hours || 0);
        const required = Number(item.required_hours || 0);
        const pct = required > 0 ? Math.min(100, Math.round(done / required * 100)) : 0;
        return <section className="frequencia" key={item.application_id}>
          <h3>Estágio #{item.internship_id}</h3>
          <p>Horas cumpridas: {done}h</p><p>Horas exigidas: {required}h</p><p>Horas restantes: {Math.max(0, required - done)}h</p>
          <p>Conclusão: {pct}%</p><div className="frequencia-bar"><div className="frequencia-bar-inner" style={{ width: pct + '%' }}>{pct}%</div></div>
        </section>;
      })}
    </main>
    <footer>Plataforma Q.E. – Quero Estágio | IFAP – Campus Laranjal do Jari</footer>
  </div>;
}