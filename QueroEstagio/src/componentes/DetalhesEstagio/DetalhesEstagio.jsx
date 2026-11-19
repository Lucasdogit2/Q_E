import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './DetalhesEstagio.css';

export default function DetalhesEstagio() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [message, setMessage] = useState('');
  const [student, setStudent] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const internship = location.state?.internship;

  useEffect(() => {
    api.me()
      .then(result => {
        setProfile(result.user || null);
        setStudent(result.student || null);
      })
      .catch(error => alert(error.message))
      .finally(() => setLoadingProfile(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!internship?.id) {
      alert('Selecione uma vaga na página Buscar Estágios antes de se candidatar.');
      navigate('/buscar');
      return;
    }
    setLoading(true);
    try {
      await api.apply(internship.id, message);
      alert('Sua candidatura foi enviada com sucesso!');
      navigate('/meus-estagios');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const sair = () => {
    api.logout();
    navigate('/');
  };

  return (
    <div className="detalhes-body">
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
          <a href="/" onClick={e => { e.preventDefault(); sair(); }}>Sair</a>
        </nav>
      )}

      <main className="detalhes-container">
        <h2>Enviar Pedido de Estágio</h2>
        {internship ? (
          <section>
            <h3>{internship.title}</h3>
            <p>{internship.description}</p>
            <p><strong>Área:</strong> {internship.area} · <strong>Local:</strong> {internship.location}</p>
            <p><strong>Carga horária:</strong> {internship.required_hours}h</p>
            <p><strong>Período:</strong> {internship.start_date} até {internship.end_date}</p>
          </section>
        ) : <p>Vaga não selecionada. Volte à busca de estágios.</p>}

        <form onSubmit={handleSubmit}>
          <h3>Dados do estudante</h3>
          {loadingProfile ? <p>Carregando seus dados...</p> : (
            <>
              <label htmlFor="nome">Nome</label>
              <input id="nome" type="text" value={profile?.full_name || ''} disabled />

              <label htmlFor="email">E-mail</label>
              <input id="email" type="email" value={profile?.email || ''} disabled />

              <label htmlFor="matricula">Matrícula</label>
              <input id="matricula" type="text" value={student?.registration || ''} disabled />

              <label htmlFor="curso">Curso</label>
              <input id="curso" type="text" value={student?.course || ''} disabled />

              <label htmlFor="competencias">Competências</label>
              <textarea id="competencias" value={student?.competencies || 'Não informado no perfil'} disabled />

              <label htmlFor="message">Mensagem para o servidor (opcional)</label>
              <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} placeholder="Escreva uma mensagem, se desejar." />
            </>
          )}

          <button type="submit" disabled={loading || loadingProfile || !internship}>
            {loading ? 'Enviando...' : 'Enviar Pedido'}
          </button>
        </form>
      </main>

      <footer>
        Plataforma Q.E. – Quero Estágio | Vinculada ao Instituto Federal do Amapá – Campus Laranjal do Jari
        <small>© 2026 – Todos os direitos reservados</small>
        <div className="mascot">🐢</div>
      </footer>
    </div>
  );
}