import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './LoginOfertante.css';

export default function LoginOfertante() {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api.login({ email, password: senha });
      if (result.user.role !== 'staff') {
        throw new Error('Esta conta não possui permissão de servidor ofertante.');
      }
      localStorage.setItem('qe_access_token', result.access_token);
      localStorage.setItem('qe_user', JSON.stringify(result.user));
      navigate('/painel-ofertante');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper tela-ofertante">
      <header className="topbar" role="banner">
        <div className="brand"><div className="logo-square">Q.E</div><div><div>Q.E. – Quero Estágio</div><div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.9)' }}>Instituto Federal do Amapá — Campus Laranjal do Jari</div></div></div>
        <button type="button" className="menu-btn" onClick={() => setMenuAberto(!menuAberto)} aria-expanded={menuAberto}>☰ Menu</button>
      </header>
      {menuAberto && <nav className="menu-panel"><a href="#sobre" onClick={() => setMenuAberto(false)}>Sobre</a><a href="#ajuda" onClick={() => setMenuAberto(false)}>Ajuda</a><a href="#contato" onClick={() => setMenuAberto(false)}>Contato</a></nav>}
      <main className="container">
        <section className="login-card">
          <h1 className="login-title">Área do Servidor Ofertante</h1>
          <p className="login-sub">Acesse com seu e-mail institucional e senha cadastrados.</p>
          <form onSubmit={handleLogin}>
            <div className="field"><label htmlFor="emailServidor">E-mail institucional</label><input id="emailServidor" type="email" placeholder="servidor@ifap.edu.br" value={email} onChange={e => setEmail(e.target.value)} autoComplete="username" required /></div>
            <div className="field"><label htmlFor="senhaServidor">Senha</label><input id="senhaServidor" type="password" placeholder="Digite sua senha" value={senha} onChange={e => setSenha(e.target.value)} autoComplete="current-password" required /></div>
            <div className="actions"><button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button><button type="button" className="btn-link" onClick={() => navigate('/')}>Entrar como estudante</button></div>
            <p className="cadastro-pergunta">O acesso de servidor é criado e liberado pela administração da plataforma.</p>
            <p className="alt-note">Se você é servidor do IFAP e ainda não possui acesso, solicite à coordenação responsável o provisionamento da sua conta.</p>
          </form>
        </section>
      </main>
      <footer className="bottombar"><span>Plataforma Q.E. – Quero Estágio | Instituto Federal do Amapá – Campus Laranjal do Jari</span><small>© 2026 – Todos os direitos reservados</small></footer>
    </div>
  );
}
