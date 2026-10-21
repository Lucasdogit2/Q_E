import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MeuEstagioAtivo.css';

export default function MeuEstagioAtivo() {
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();

  // Array contendo os detalhes informativos organizados
  const cardsInfo = [
    { icon: '📍', texto: 'Laboratório de Informática' },
    { icon: '👨‍🏫', texto: 'Prof. João Silva' },
    { icon: '👥', texto: '3 Estagiários' },
    { icon: '📅', texto: 'Duração: 200h' },
    { icon: '🕒', texto: 'Seg a Sex, 08:00-12:00' },
    { icon: '🛠️', texto: 'Programação, Lógica, Git' }
  ];

  return (
    <div className="estagio-ativo-body">
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
          <a href="#" onClick={() => { setMenuAberto(false); navigate('/meus-estagios'); }}>Meus Estágios</a>
          <a href="#" onClick={() => navigate('/')}>Sair</a>
        </nav>
      )}

      <div className="extra-mascot">🐢</div>

      {/* Conteúdo Principal */}
      <main className="estagio-ativo-main">
        <h2>Informações do Estágio</h2>

        <div className="info-grid">
          {cardsInfo.map((card, index) => (
            <div className="info-card" key={index}>
              <span className="icon">{card.icon}</span>
              <p>{card.texto}</p>
            </div>
          ))}
        </div>

        {/* Bloco de Frequência / Progresso */}
        <div className="frequencia">
          <h4>Minha Frequência</h4>
          <p>Horas Cumpridas: 120h</p>
          <p>Horas Restantes: 80h</p>
          <p>Status: Em andamento</p>
          <div className="frequencia-bar">
            <div className="frequencia-bar-inner">60%</div>
          </div>
        </div>
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