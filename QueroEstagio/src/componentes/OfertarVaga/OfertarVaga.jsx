import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './OfertarVaga.css';

export default function OfertarVaga() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [area, setArea] = useState('');
  const [location, setLocation] = useState('');
  const [requiredHours, setRequiredHours] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [vacancies, setVacancies] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCadastrar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createInternship({
        title: title.trim(),
        description: description.trim(),
        area: area.trim(),
        location: location.trim(),
        required_hours: Number(requiredHours),
        start_date: startDate,
        end_date: endDate,
        vacancies: Number(vacancies)
      });
      alert('Estágio cadastrado com sucesso!');
      navigate('/vagas-ofertadas');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const sair = () => {
    api.logout();
    navigate('/ofertante');
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
        <button className="menu-btn" onClick={() => setMenuAberto(!menuAberto)} aria-expanded={menuAberto}>☰ Menu</button>
      </header>

      {menuAberto && (
        <nav className="menu-panel" style={{ display: 'block', position: 'absolute' }}>
          <a href="/painel-ofertante" onClick={e => { e.preventDefault(); navigate('/painel-ofertante'); }}>Painel</a>
          <a href="/vagas-ofertadas" onClick={e => { e.preventDefault(); navigate('/vagas-ofertadas'); }}>Estágios Ofertados</a>
          <a href="/ofertante" onClick={e => { e.preventDefault(); sair(); }} style={{ color: '#FF7F50', fontWeight: 'bold' }}>Sair</a>
        </nav>
      )}

      <main className="container">
        <section className="form-card">
          <h1 className="form-title">Cadastrar Estágio</h1>
          <form id="offerForm" onSubmit={handleCadastrar} style={{ width: '100%' }}>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="titulo">Nome do estágio</label>
                <input id="titulo" type="text" placeholder="Ex.: Apoio ao setor de Enfermaria" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div className="field">
                <label htmlFor="area">Área ou setor</label>
                <input id="area" type="text" placeholder="Ex.: Enfermaria" value={area} onChange={e => setArea(e.target.value)} required />
              </div>
              <div className="field">
                <label htmlFor="local">Local de realização</label>
                <input id="local" type="text" placeholder="Ex.: Campus Laranjal do Jari" value={location} onChange={e => setLocation(e.target.value)} required />
              </div>
              <div className="field">
                <label htmlFor="horas">Carga horária total</label>
                <input id="horas" type="number" min="1" placeholder="Ex.: 120" value={requiredHours} onChange={e => setRequiredHours(e.target.value)} required />
              </div>
              <div className="field">
                <label htmlFor="inicio">Data de início</label>
                <input id="inicio" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
              </div>
              <div className="field">
                <label htmlFor="termino">Data de término</label>
                <input id="termino" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
              </div>
              <div className="field">
                <label htmlFor="quantidade">Número de vagas</label>
                <input id="quantidade" type="number" min="1" placeholder="Ex.: 5" value={vacancies} onChange={e => setVacancies(e.target.value)} required />
              </div>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="descricao">Descrição e atividades</label>
                <textarea id="descricao" rows="4" placeholder="Descreva as atividades e os requisitos do estágio." value={description} onChange={e => setDescription(e.target.value)} required />
              </div>
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>
        </section>
      </main>

      <footer className="bottombar">
        Plataforma Q.E. – Quero Estágio | Vinculada ao Instituto Federal do Amapá – Campus Laranjal do Jari
        <small>© 2026 – Todos os direitos reservados</small>
      </footer>
    </div>
  );
}