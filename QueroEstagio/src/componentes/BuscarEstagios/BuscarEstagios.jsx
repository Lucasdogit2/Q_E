import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BuscarEstagios.css'; // Importação corrigida aqui!

export default function BuscarEstagios() {
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();

  const estagios = [
    { id: 1, titulo: 'Estágio em Programação', habilidades: 'Java, Python, Git' },
    { id: 2, titulo: 'Estágio em Design Gráfico', habilidades: 'Photoshop, Illustrator, Criatividade' },
    { id: 3, titulo: 'Estágio em Marketing Digital', habilidades: 'SEO, Redes Sociais, Copywriting' },
    { id: 4, titulo: 'Estágio em Engenharia', habilidades: 'AutoCAD, SolidWorks, Análise Técnica' }
  ];

  // Altere essa função dentro do BuscarEstagios.jsx
  const handleAcessarVaga = (id) => {
    navigate('/detalhes'); // Agora o botão "Acessar" leva para o formulário!
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
        <button 
          className="menu-btn" 
          onClick={() => setMenuAberto(!menuAberto)}
          aria-expanded={menuAberto}
        >
          ☰ Menu
        </button>
      </header>

      {menuAberto && (
        <nav className="menu-panel">
          <a href="#" onClick={() => { setMenuAberto(false); navigate('/painel'); }}>Painel Inicial</a>
          <a href="#" onClick={() => setMenuAberto(false)}>Meus Estágios</a>
          <a href="#" onClick={() => navigate('/')}>Sair</a>
        </nav>
      )}

      <main>
        <h2 style={{ textAlign: 'center', color: 'var(--azul-petroleo)', marginBottom: '30px' }}>
          Buscar Estágios
        </h2>

        <div className="filters">
          <select className="tipo">
            <option value="interno">Interno</option>
            <option value="externo">Externo</option>
          </select>
          <input type="text" placeholder="Nome do estágio" />
          <input type="text" placeholder="Habilidades" />
          <input type="text" placeholder="Local" />
          <button onClick={() => alert('Filtrando oportunidades...')}>Filtrar</button>
        </div>

        <div className="cards">
          {estagios.map((vaga) => (
            <div className="card" key={vaga.id} onClick={() => handleAcessarVaga(vaga.id)}>
              <img src="https://via.placeholder.com/300x150" alt={vaga.titulo} />
              <div className="card-content">
                <div>
                  <h3>{vaga.titulo}</h3>
                  <p>Habilidades necessárias: {vaga.habilidades}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleAcessarVaga(vaga.id); }}>
                  Acessar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer>
        Plataforma Q.E. – Quero Estágio | Vinculada ao Instituto Federal do Amapá – Campus Laranjal do Jari
        <small>©️ 2025 – Todos os direitos reservados</small>
        <div className="mascot">🐢</div>
      </footer>
    </div>
  );
}