import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './DetalhesEstagio.css';

export default function DetalhesEstagio() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const internship = location.state?.internship;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!internship?.id) {
      alert('Selecione uma vaga na página Buscar Estágios antes de se candidatar.');
      navigate('/buscar');
      return;
    }
    setLoading(true);
    try {
      await api.apply(internship.id, message);
      alert('Sua candidatura foi enviada!');
      navigate('/meus-estagios');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return <div className="detalhes-body">
    <header><div className="brand" onClick={() => navigate('/painel')} style={{ cursor: 'pointer' }}><div className="logo-square">Q.E</div><div>Q.E. – Quero Estágio<div style={{ fontSize: '0.78rem' }}>Instituto Federal do Amapá — Campus Laranjal do Jari</div></div></div>
      <button className="menu-btn" onClick={() => setMenuAberto(!menuAberto)}>☰ Menu</button></header>
    {menuAberto && <nav className="menu-panel"><a href="/painel">Painel Inicial</a><a href="/buscar">Buscar Estágios</a><a href="/" onClick={api.logout}>Sair</a></nav>}
    <main className="detalhes-container">
      <h2>Enviar Pedido de Estágio</h2>
      {internship ? <section><h3>{internship.title}</h3><p>{internship.description}</p><p><strong>Área:</strong> {internship.area} · <strong>Local:</strong> {internship.location}</p><p><strong>Carga horária:</strong> {internship.required_hours}h</p></section> : <p>Vaga não selecionada. Volte à busca de estágios.</p>}
      <form onSubmit={handleSubmit}><label htmlFor="message">Mensagem para o servidor (opcional)</label><textarea id="message" value={message} onChange={e => setMessage(e.target.value)} /><button type="submit" disabled={loading || !internship}>{loading ? 'Enviando...' : 'Enviar candidatura'}</button></form>
    </main>
    <footer>Plataforma Q.E. – Quero Estágio | IFAP – Campus Laranjal do Jari</footer>
  </div>;
}