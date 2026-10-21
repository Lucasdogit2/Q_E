import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OfertarVaga.css';

export default function OfertarVaga() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [tipo, setTipo] = useState('');
  const [horas, setHoras] = useState('');
  const [inicio, setInicio] = useState('');
  const [termino, setTermino] = useState('');
  const [quantidade, setQuantidade] = useState('');

  const navigate = useNavigate();

  const handleCadastrar = (e) => {
    e.preventDefault();
    alert('Estágio cadastrado com sucesso!');
    navigate('/painel-ofertante');
  };

  return (
    <div className="login-wrapper ofertar-vaga-root">
      <header className="topbar" role="banner">
        <div className="brand">
          <div className="logo-square" aria-hidden="true">Q.E</div>
          <div>
            <div style={{ fontSize: '0.95rem' }}>Q.E. – Quero Estágio</div>
            <div>Instituto Federal do Amapá — Campus Laranjal do Jari</div>
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

      {menuAberto && (
        <nav className="menu-panel" style={{ display: 'block', position: 'absolute' }}>
          <a href="#" onClick={() => { setMenuAberto(false); navigate('/painel-ofertante'); }}>Painel</a>
          <a href="#" onClick={() => { setMenuAberto(false); navigate('/vagas-ofertadas'); }}>Estágios Ofertados</a>
          <a href="#" onClick={() => navigate('/ofertante')} style={{ color: '#FF7F50', fontWeight: 'bold' }}>Sair</a>
        </nav>
      )}

      <main className="container">
        <section className="form-card">
          <h1 className="form-title">Cadastrar Estágio</h1>
          
          <form id="offerForm" onSubmit={handleCadastrar} style={{ width: '100%' }}>
            
            <div className="radio-group">
              <input 
                type="radio" 
                id="interno" 
                name="tipo" 
                value="interno" 
                checked={tipo === 'interno'}
                onChange={(e) => setTipo(e.target.value)}
                required 
              />
              <label htmlFor="interno">Interno</label>
              
              <input 
                type="radio" 
                id="externo" 
                name="tipo" 
                value="externo" 
                checked={tipo === 'externo'}
                onChange={(e) => setTipo(e.target.value)}
                required 
              />
              <label htmlFor="externo">Externo</label>
            </div>

            {/* Grid envelopadora responsiva */}
            <div className="form-grid">
              <div className="field">
                <label htmlFor="horas">Quantidade de horas</label>
                <input 
                  type="number" 
                  id="horas" 
                  placeholder="Ex: 120" 
                  value={horas}
                  onChange={(e) => setHoras(e.target.value)}
                  required 
                />
              </div>

              <div className="field">
                <label htmlFor="inicio">Data de início</label>
                <input 
                  type="date" 
                  id="inicio" 
                  value={inicio}
                  onChange={(e) => setInicio(e.target.value)}
                  required 
                />
              </div>

              <div className="field">
                <label htmlFor="termino">Data de término</label>
                <input 
                  type="date" 
                  id="termino" 
                  value={termino}
                  onChange={(e) => setTermino(e.target.value)}
                  required 
                />
              </div>

              <div className="field">
                <label htmlFor="quantidade">Número de vagas</label>
                <input 
                  type="number" 
                  id="quantidade" 
                  placeholder="Ex: 5" 
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  required 
                />
              </div>
            </div>

            <button type="submit" className="btn-submit">Cadastrar</button>
          </form>
        </section>
      </main>

      <footer className="bottombar">
        Plataforma Q.E. – Quero Estágio | Vinculada ao Instituto Federal do Amapá – Campus Laranjal do Jari
        <small>©️ 2025 – Todos os direitos reservados</small>
      </footer>
    </div>
  );
}