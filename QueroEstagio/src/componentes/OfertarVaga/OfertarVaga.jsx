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
        title, description, area, location,
        required_hours: Number(requiredHours),
        start_date: startDate, end_date: endDate,
        vacancies: Number(vacancies)
      });
      alert('Vaga cadastrada com sucesso!');
      navigate('/vagas-ofertadas');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper ofertar-vaga-root">
      <header className="topbar" role="banner">
        <div className="brand"><div className="logo-square">Q.E</div><div><div>Q.E. – Quero Estágio</div><div>Instituto Federal do Amapá — Campus Laranjal do Jari</div></div></div>
        <button className="menu-btn" onClick={() => setMenuAberto(!menuAberto)} aria-expanded={menuAberto}>☰ Menu</button>
      </header>
      {menuAberto && <nav className="menu-panel"><a href="/painel-ofertante">Painel</a><a href="/vagas-ofertadas">Estágios Ofertados</a><a href="/ofertante" onClick={api.logout}>Sair</a></nav>}
      <main className="container">
        <section className="form-card">
          <h1 className="form-title">Cadastrar Estágio</h1>
          <form id="offerForm" onSubmit={handleCadastrar} style={{ width: '100%' }}>
            <div className="form-grid">
              <div className="field"><label htmlFor="title">Título da vaga</label><input id="title" value={title} onChange={e => setTitle(e.target.value)} required /></div>
              <div className="field"><label htmlFor="area">Área</label><input id="area" value={area} onChange={e => setArea(e.target.value)} required /></div>
              <div className="field"><label htmlFor="location">Local/setor</label><input id="location" value={location} onChange={e => setLocation(e.target.value)} required /></div>
              <div className="field"><label htmlFor="requiredHours">Carga horária total</label><input id="requiredHours" type="number" min="1" value={requiredHours} onChange={e => setRequiredHours(e.target.value)} required /></div>
              <div className="field"><label htmlFor="startDate">Data de início</label><input id="startDate" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required /></div>
              <div className="field"><label htmlFor="endDate">Data de término</label><input id="endDate" type="date" min={startDate || undefined} value={endDate} onChange={e => setEndDate(e.target.value)} required /></div>
              <div className="field"><label htmlFor="vacancies">Número de vagas</label><input id="vacancies" type="number" min="1" value={vacancies} onChange={e => setVacancies(e.target.value)} required /></div>
            </div>
            <div className="field"><label htmlFor="description">Descrição e requisitos</label><textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required /></div>
            <button type="submit" className="btn-submit" disabled={loading}>{loading ? 'Salvando...' : 'Cadastrar'}</button>
          </form>
        </section>
      </main>
      <footer className="bottombar">Plataforma Q.E. – Quero Estágio | IFAP – Campus Laranjal do Jari</footer>
    </div>
  );
}