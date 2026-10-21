import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PedidosEstagio.css';

export default function PedidosEstagio() {
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState([
    { id: 101, nome: "Carlos Lima", curso: "Informática", data: "12/05/2025" },
    { id: 102, nome: "Daniela Rocha", curso: "Edificações", data: "13/05/2025" },
  ]);

  const responderPedido = (id, aprovado) => {
    alert(aprovado ? "Pedido aprovado!" : "Pedido recusado.");
    setPedidos(pedidos.filter(p => p.id !== id));
  };

  return (
    <div className="login-wrapper pedidos-ofertante-root">
      <header className="topbar">
        <div className="brand">
          <div className="logo-square">Q.E</div>
          <div style={{ fontSize: '0.95rem' }}>Q.E. – Pedidos de Estágio</div>
        </div>
        <button className="menu-btn" onClick={() => setMenuAberto(!menuAberto)}>☰ Menu</button>
      </header>

      {menuAberto && (
        <nav className="menu-panel">
          <a href="#" onClick={() => navigate('/vagas-ofertadas')}>Voltar</a>
          <a href="#" onClick={() => navigate('/ofertante')}>Sair</a>
        </nav>
      )}

      <main className="container">
        <h1 className="title">Candidatos Interessados</h1>
        
        {pedidos.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '40px' }}>Não há pedidos pendentes para esta vaga.</p>
        ) : (
          <div className="list-pedidos">
            {pedidos.map(p => (
              <div key={p.id} className="pedido-card">
                <div className="pedido-info">
                  <strong>{p.nome}</strong>
                  <p>{p.curso} • Enviado em {p.data}</p>
                </div>
                <div className="pedido-actions">
                  <button className="btn-approve" onClick={() => responderPedido(p.id, true)}>Aprovar</button>
                  <button className="btn-reject" onClick={() => responderPedido(p.id, false)}>Recusar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bottombar">
        Q.E. – Quero Estágio | IFAP
      </footer>
    </div>
  );
}