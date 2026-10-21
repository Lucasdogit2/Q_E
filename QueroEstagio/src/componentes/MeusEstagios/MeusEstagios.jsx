import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MeusEstagios.css';

export default function MeusEstagios() {
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();

  // Simulação dos dados da tabela de pedidos
  const pedidos = [
    { id: 1, nome: 'Estágio em Programação', status: 'Aprovado', classeStatus: 'status-approved' },
    { id: 2, nome: 'Estágio em Design Gráfico', status: 'Esperando', classeStatus: 'status-pending' },
    { id: 3, nome: 'Estágio em Marketing Digital', status: 'Reprovado', classeStatus: 'status-rejected' }
  ];

  // Altere essa função dentro do seu MeusEstagios.jsx
  const handleAcessarEstagioAprovado = () => {
    navigate('/meu-estagio-ativo'); // Redireciona o usuário para a página de progresso do estágio!
  };

  return (
    <div className="meus-estagios-body">
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
      <main>
        <h2>Meus Pedidos de Estágio</h2>

        <table className="status-table">
          <thead>
            <tr>
              <th>Estágio</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.nome}</td>
                <td className={pedido.classeStatus}>{pedido.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Bloco de Destaque para o Estágio Aprovado */}
        <div className="approved-stage">
          <h3>Estágio Aprovado: Estágio em Programação</h3>
          <button onClick={handleAcessarEstagioAprovado}>Acessar Meu Estágio</button>
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