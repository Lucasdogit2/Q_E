import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PainelOfertante.css';


export default function PainelOfertante() {
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();

  const handleSair = () => {
    navigate('/ofertante'); // Redireciona de volta para o login do Ofertante
  };

  return (
    <div className="login-wrapper painel-ofertante-root">
      {/* Topbar */}
      <header className="topbar" role="banner">
        <div className="brand">
          <div className="logo-square" aria-hidden="true">Q.E</div>
          <div>
            <div style={{ fontSize: '0.95rem' }}>Q.E. – Quero Estágio</div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.9)' }}>
              Instituto Federal do Amapá — Campus Laranjal do Jari
            </div>
          </div>
        </div>

        <div>
          <button 
            className="menu-btn" 
            onClick={() => setMenuAberto(!menuAberto)} 
            aria-expanded={menuAberto}
          >
            ☰ Menu
          </button>
        </div>
      </header>

      {/* Menu lateral condicional */}
      {menuAberto && (
        <nav className="menu-panel">
          <a href="#" onClick={handleSair} style={{ color: '#FF7F50', fontWeight: 'bold' }}>Sair</a>
        </nav>
      )}

      {/* Conteúdo Principal */}
      <main className="container">
        <div className="card" onClick={() => navigate('/ofertar-vaga')}>
          <div className="card-title">Ofertar Estágios</div>
          <div className="card-sub">Cadastre novas vagas de estágio para seus estudantes.</div>
          <button className="btn-action">Acessar</button>
        </div>

        <div className="card" onClick={() => navigate('/vagas-ofertadas')}>
          <div className="card-title">Estágios Ofertados</div>
          <div className="card-sub">Visualize e gerencie os estágios que você já cadastrou.</div>
          <button className="btn-action">Acessar</button>
        </div>

        <div className="card">
         <div className="card-title">
             Aprovação de estágio
         </div>
         <div className="card-sub">
    Aprove os estágios dos discentes de maneira prática e fácil.
         </div>

         <button
         className="btn-action"
         onClick={() => navigate("/aprovacao-estagio")}
        >
         Acessar
        </button>

</div>

        <div className="quem-somos">
          <h2>Quem Somos</h2>
          <p>
            Somos a plataforma Q.E. – Quero Estágio, dedicada a conectar estudantes e oportunidades de forma eficiente, prática e segura. Nosso objetivo é tornar a experiência de estágio mais organizada e transparente, beneficiando tanto os estudantes quanto os coordenadores.
          </p>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="bottombar">
        Plataforma Q.E. – Quero Estágio | Vinculada ao Instituto Federal do Amapá – Campus Laranjal do Jari
        <small>©️ 2025 – Todos os direitos reservados</small>
      </footer>
    </div>
  );
}