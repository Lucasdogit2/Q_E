import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DetalhesEstagio.css';

export default function DetalhesEstagio() {
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();

  // Estados do Formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [matricula, setMatricula] = useState('');
  const [curso, setCurso] = useState('');
  const [competencias, setCompetencias] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Pedido enviado com sucesso para ${nome}!`);
    navigate('/painel'); // Redireciona de volta ao painel após o envio
  };

  return (
    <div className="detalhes-body">
      {/* Header */}
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
        <button 
          className="menu-btn" 
          onClick={() => setMenuAberto(!menuAberto)}
          aria-expanded={menuAberto}
        >
          ☰ Menu
        </button>
      </header>

      {/* Menu lateral condicional */}
      {menuAberto && (
        <nav className="menu-panel">
          <a href="#" onClick={() => { setMenuAberto(false); navigate('/painel'); }}>Painel Inicial</a>
          <a href="#" onClick={() => { setMenuAberto(false); navigate('/buscar'); }}>Buscar Estágios</a>
          <a href="#" onClick={() => navigate('/')}>Sair</a>
        </nav>
      )}

      {/* Conteúdo Principal */}
      <main className="detalhes-container">
        <h2>Enviar Pedido de Estágio</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="nome">Nome</label>
          <input 
            type="text" 
            id="nome" 
            placeholder="Digite seu nome" 
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            placeholder="seuemail@dominio.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="matricula">Matrícula</label>
          <input 
            type="text" 
            id="matricula" 
            placeholder="Digite sua matrícula" 
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            required
          />

          <label htmlFor="curso">Curso</label>
          <input 
            type="text" 
            id="curso" 
            placeholder="Digite seu curso" 
            value={curso}
            onChange={(e) => setCurso(e.target.value)}
            required
          />

          <label htmlFor="competencias">Competências</label>
          <textarea 
            id="competencias" 
            placeholder="Liste suas competências" 
            value={competencias}
            onChange={(e) => setCompetencias(e.target.value)}
            required
          ></textarea>

          <button type="submit">Enviar Pedido</button>
        </form>
      </main>

      {/* Footer */}
      <footer>
        Plataforma Q.E. – Quero Estágio | Vinculada ao Instituto Federal do Amapá – Campus Laranjal do Jari
        <small>©️ 2025 – Todos os direitos reservados</small>
        <div className="mascot">🐢</div>
      </footer>
    </div>
  );
}