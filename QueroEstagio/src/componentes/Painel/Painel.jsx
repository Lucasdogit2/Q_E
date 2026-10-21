import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Painel.css';

export default function Painel() {

  const [menuAberto, setMenuAberto] = useState(false);

  const navigate = useNavigate();

  // Buscar estágios
  const handleBuscarEstagios = () => {
    navigate('/buscar');
  };

  // Meus estágios
  const handleMeusEstagios = () => {
    navigate('/meus-estagios');
  };

  // Sair
  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="painel-body">

      {/* ================= HEADER ================= */}

      <header>

        <div
          className="brand"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/painel')}
        >

          <div className="logo-square">
            Q.E
          </div>

          <div>

            <div>
              Q.E. – Quero Estágio
            </div>

            <div
              style={{
                fontSize: '0.78rem',
                color: 'rgba(255,255,255,0.9)'
              }}
            >
              Instituto Federal do Amapá — Campus Laranjal do Jari
            </div>

          </div>

        </div>


        {/* BOTÃO MENU */}

        <button
          className="menu-btn"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-expanded={menuAberto}
        >
          ☰ Menu
        </button>

      </header>


      {/* ================= MENU ================= */}

      {menuAberto && (

        <nav className="menu-panel">

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
          >
            Sair
          </a>

        </nav>

      )}


      <section className="version1" id="v1">

        <h2>
          Bem-vindo ao Painel do Estudante
        </h2>


        <div className="cards">



          <div
            className="card"
            onClick={handleBuscarEstagios}
          >

  

            <h3>
              Buscar Estágios
            </h3>

            <p>
              Encontre oportunidades de estágio disponíveis
              para estudantes.
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBuscarEstagios();
              }}
            >
              Acessar
            </button>

          </div>


          {/* ================= CARD MEUS ESTÁGIOS ================= */}

          <div
            className="card"
            onClick={handleMeusEstagios}
          >

          

            <h3>
              Meus Estágios
            </h3>

            <p>
              Visualize e acompanhe os estágios que você
              já solicitou.
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMeusEstagios();
              }}
            >
              Acessar
            </button>

          </div>

        </div>


        {/* ================= QUEM SOMOS ================= */}

        <div className="about">

          <h2>
            Quem Somos
          </h2>

          <p>
            Somos a plataforma Q.E., dedicada a conectar
            estudantes a oportunidades de estágio de maneira
            eficiente, segura e transparente. Nossa missão é
            facilitar o caminho do estudante ao mercado de trabalho.
          </p>

        </div>

      </section>


      <hr />


      {/* ================= FOOTER ================= */}

      <footer>

        Plataforma Q.E. – Quero Estágio |
        Vinculada ao Instituto Federal do Amapá –
        Campus Laranjal do Jari

        <small>
          ©️ 2025 – Todos os direitos reservados
        </small>

        <div className="mascot">
          🐢
        </div>

      </footer>

    </div>
  );
}