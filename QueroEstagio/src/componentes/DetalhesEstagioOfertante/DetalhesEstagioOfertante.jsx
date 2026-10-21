import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DetalhesEstagioOfertante.css';

export default function DetalhesEstagioOfertante() {
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();

  // Simulação de lista de estagiários
  const [estagiarios, setEstagiarios] = useState([
    { id: 1, nome: "Ana Silva", curso: "Informática", presente: true },
    { id: 2, nome: "João Souza", curso: "Informática", presente: false },
    { id: 3, nome: "Bia Costa", curso: "Informática", presente: true },
  ]);

  const alternarPresenca = (id) => {
    setEstagiarios(estagiarios.map(est => 
      est.id === id ? { ...est, presente: !est.presente } : est
    ));
  };

  const encerrarEstagio = () => {
    if (window.confirm("Deseja realmente encerrar este estágio? Esta ação é irreversível.")) {
      alert("Estágio encerrado com sucesso!");
      navigate('/vagas-ofertadas');
    }
  };

  return (
    <div className="login-wrapper detalhes-ofertante-root">
      <header className="topbar">
        <div className="brand">
          <div className="logo-square">Q.E</div>
          <div>
            <div style={{ fontSize: '0.95rem' }}>Q.E. – Quero Estágio</div>
            <div className="ifap-text">Instituto Federal do Amapá — Campus Laranjal do Jari</div>
          </div>
        </div>
        <button className="menu-btn" onClick={() => setMenuAberto(!menuAberto)}>☰ Menu</button>
      </header>

      {menuAberto && (
        <nav className="menu-panel">
          <a href="#" onClick={() => navigate('/painel-ofertante')}>Painel</a>
          <a href="#" onClick={() => navigate('/vagas-ofertadas')}>Voltar</a>
          <a href="#" onClick={() => navigate('/ofertante')} style={{ color: '#FF7F50', fontWeight: 'bold' }}>Sair</a>
        </nav>
      )}

      <main className="container">
        <div className="header-info">
          <h1>Estágio em Laboratório Avançado</h1>
          <span className="badge">Interno</span>
        </div>

        <section className="interns-card">
          <h2>Lista de Estagiários</h2>
          <div className="table-wrapper">
            <table className="interns-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Curso</th>
                  <th>Presença</th>
                </tr>
              </thead>
              <tbody>
                {estagiarios.map(est => (
                  <tr key={est.id}>
                    <td>{est.nome}</td>
                    <td>{est.curso}</td>
                    <td>
                      <button 
                        className={`btn-presence ${est.presente ? 'is-present' : 'is-absent'}`}
                        onClick={() => alternarPresenca(est.id)}
                      >
                        {est.presente ? "Presente" : "Faltou"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="action-footer">
          <button className="btn-finish" onClick={encerrarEstagio}>Encerrar/Concluir Estágio</button>
        </div>
      </main>

      <footer className="bottombar">
        Plataforma Q.E. – Quero Estágio | IFAP – Campus Laranjal do Jari
        <small>©️ 2025 – Todos os direitos reservados</small>
      </footer>
    </div>
  );
}