import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './VagasOfertadas.css';

const emptyForm = {
  title: '', description: '', area: '', location: '',
  required_hours: '', start_date: '', end_date: '', vacancies: ''
};

export default function VagasOfertadas() {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const [vagas, setVagas] = useState([]);
  const [estagioSelecionado, setEstagioSelecionado] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.myInternships()
      .then(result => setVagas(result.internships || []))
      .catch(error => setErro(error.message))
      .finally(() => setLoading(false));
  }, []);

  const abrirInformacoes = vaga => {
    setEstagioSelecionado(vaga);
    setForm({
      title: vaga.title || '',
      description: vaga.description || '',
      area: vaga.area || '',
      location: vaga.location || '',
      required_hours: String(vaga.required_hours ?? ''),
      start_date: vaga.start_date || '',
      end_date: vaga.end_date || '',
      vacancies: String(vaga.vacancies ?? '')
    });
    setModoEdicao(false);
  };

  const fecharInformacoes = () => {
    setEstagioSelecionado(null);
    setModoEdicao(false);
  };

  const atualizarCampo = (campo, valor) => setForm(previous => ({ ...previous, [campo]: valor }));

  const salvarEstagio = async e => {
    e.preventDefault();
    if (!estagioSelecionado) return;
    setSaving(true);
    try {
      const result = await api.updateInternship(estagioSelecionado.id, {
        ...form,
        required_hours: Number(form.required_hours),
        vacancies: Number(form.vacancies)
      });
      const updated = result.internship;
      setVagas(previous => previous.map(vaga => vaga.id === updated.id ? updated : vaga));
      setEstagioSelecionado(updated);
      setModoEdicao(false);
      alert('Alterações salvas com sucesso!');
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const alterarStatus = async status => {
    if (!estagioSelecionado) return;
    const confirmacao = status === 'closed'
      ? 'Deseja encerrar esta vaga? Ela deixará de receber novas candidaturas.'
      : 'Deseja cancelar esta vaga? O histórico das candidaturas será preservado.';
    if (!window.confirm(confirmacao)) return;
    setSaving(true);
    try {
      const result = await api.updateInternship(estagioSelecionado.id, {
        title: form.title,
        description: form.description,
        area: form.area,
        location: form.location,
        required_hours: Number(form.required_hours),
        start_date: form.start_date,
        end_date: form.end_date,
        vacancies: Number(form.vacancies),
        status
      });
      const updated = result.internship;
      setVagas(previous => previous.map(vaga => vaga.id === updated.id ? updated : vaga));
      setEstagioSelecionado(updated);
      alert(status === 'closed' ? 'Vaga encerrada.' : 'Vaga cancelada.');
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const sair = () => {
    api.logout();
    navigate('/ofertante');
  };

  return (
    <div className="login-wrapper vagas-ofertadas-root">
      <header className="topbar">
        <div className="brand">
          <div className="logo-square">Q.E</div>
          <div>
            <div style={{ fontSize: '0.95rem' }}>Q.E. – Quero Estágio</div>
            <div className="ifap-text">Instituto Federal do Amapá — Campus Laranjal do Jari</div>
          </div>
        </div>
        <button type="button" className="menu-btn" onClick={() => setMenuAberto(!menuAberto)} aria-expanded={menuAberto}>☰ Menu</button>
      </header>

      {menuAberto && (
        <nav className="menu-panel">
          <a href="/painel-ofertante" onClick={e => { e.preventDefault(); navigate('/painel-ofertante'); }}>Painel Principal</a>
          <a href="/ofertar-vaga" onClick={e => { e.preventDefault(); navigate('/ofertar-vaga'); }}>Ofertar Nova Vaga</a>
          <a href="/ofertante" onClick={e => { e.preventDefault(); sair(); }} style={{ color: '#FF7F50', fontWeight: 'bold' }}>Sair</a>
        </nav>
      )}

      <main className="container">
        <h1 className="page-title">Seus Estágios Ofertados</h1>
        <p className="page-subtitle">Gerencie os estágios e os estudantes vinculados aos seus projetos.</p>

        {loading && <p>Carregando vagas...</p>}
        {erro && <p role="alert">{erro}</p>}
        {!loading && !erro && vagas.length === 0 && <p>Você ainda não cadastrou vagas.</p>}

        <div className="cards-container">
          {vagas.map(vaga => (
            <div className="stage-card" key={vaga.id}>
              <div className="card-header">
                <h2>{vaga.title}</h2>
                <span className={`badge ${vaga.status === 'open' ? 'interno' : ''}`}>
                  {vaga.status === 'open' ? 'Aberta' : vaga.status === 'closed' ? 'Encerrada' : 'Cancelada'}
                </span>
              </div>
              <p>{vaga.description}</p>
              <p><strong>Área:</strong> {vaga.area} · <strong>Local:</strong> {vaga.location}</p>
              <p><strong>Carga horária:</strong> {vaga.required_hours} horas · <strong>Vagas:</strong> {vaga.vacancies}</p>
              <p><strong>Período:</strong> {vaga.start_date} até {vaga.end_date}</p>
              <div className="card-actions">
                <button type="button" className="btn-action btn-access" onClick={() => navigate('/pedidos-ofertante')}>Solicitações</button>
                <button type="button" className="btn-action btn-orders" onClick={() => navigate('/detalhes-ofertante')}>Lista de Estagiários</button>
                <button type="button" className="btn-action btn-orders" onClick={() => abrirInformacoes(vaga)}>Informações gerais</button>
              </div>
            </div>
          ))}
        </div>

        {estagioSelecionado && (
          <div className="modal-overlay" onClick={fecharInformacoes}>
            <section className="modal-informacoes" role="dialog" aria-modal="true" aria-labelledby="titulo-modal" onClick={e => e.stopPropagation()}>
              <button type="button" className="btn-fechar" onClick={fecharInformacoes} aria-label="Fechar">×</button>
              <h2 id="titulo-modal">{modoEdicao ? 'Editar estágio' : 'Informações do Estágio'}</h2>

              {!modoEdicao ? (
                <>
                  <h3>{estagioSelecionado.title}</h3>
                  <p>{estagioSelecionado.description}</p>
                  <p><strong>Área:</strong> {estagioSelecionado.area}</p>
                  <p><strong>Local:</strong> {estagioSelecionado.location}</p>
                  <p><strong>Número de vagas:</strong> {estagioSelecionado.vacancies}</p>
                  <p><strong>Carga horária:</strong> {estagioSelecionado.required_hours} horas</p>
                  <p><strong>Data de início:</strong> {estagioSelecionado.start_date}</p>
                  <p><strong>Data de término:</strong> {estagioSelecionado.end_date}</p>
                  <p><strong>Status:</strong> {estagioSelecionado.status === 'open' ? 'Aberta' : estagioSelecionado.status === 'closed' ? 'Encerrada' : 'Cancelada'}</p>

                  <div className="modal-acoes">
                    <button type="button" className="btn-action btn-orders" onClick={() => setModoEdicao(true)} disabled={estagioSelecionado.status !== 'open'}>Editar estágio</button>
                    {estagioSelecionado.status === 'open' && <>
                      <button type="button" className="btn-action btn-cancelar" onClick={() => alterarStatus('closed')} disabled={saving}>Encerrar vaga</button>
                      <button type="button" className="btn-action btn-cancelar" onClick={() => alterarStatus('cancelled')} disabled={saving}>Cancelar vaga</button>
                    </>}
                    <button type="button" className="btn-action btn-cancelar" onClick={fecharInformacoes}>Fechar</button>
                  </div>
                </>
              ) : (
                <form className="form-edicao" onSubmit={salvarEstagio}>
                  <label htmlFor="titulo-estagio">Nome do estágio</label>
                  <input id="titulo-estagio" type="text" value={form.title} onChange={e => atualizarCampo('title', e.target.value)} required />
                  <label htmlFor="area-estagio">Área ou setor</label>
                  <input id="area-estagio" type="text" value={form.area} onChange={e => atualizarCampo('area', e.target.value)} required />
                  <label htmlFor="local-estagio">Local</label>
                  <input id="local-estagio" type="text" value={form.location} onChange={e => atualizarCampo('location', e.target.value)} required />
                  <label htmlFor="descricao-estagio">Descrição</label>
                  <textarea id="descricao-estagio" value={form.description} onChange={e => atualizarCampo('description', e.target.value)} required />
                  <label htmlFor="quantidade-vagas">Número de vagas</label>
                  <input id="quantidade-vagas" type="number" min="1" value={form.vacancies} onChange={e => atualizarCampo('vacancies', e.target.value)} required />
                  <label htmlFor="horas-estagio">Carga horária total</label>
                  <input id="horas-estagio" type="number" min="1" value={form.required_hours} onChange={e => atualizarCampo('required_hours', e.target.value)} required />
                  <label htmlFor="data-inicio">Data de início</label>
                  <input id="data-inicio" type="date" value={form.start_date} onChange={e => atualizarCampo('start_date', e.target.value)} required />
                  <label htmlFor="data-termino">Data de término</label>
                  <input id="data-termino" type="date" value={form.end_date} onChange={e => atualizarCampo('end_date', e.target.value)} required />
                  <div className="modal-acoes">
                    <button type="submit" className="btn-action btn-orders" disabled={saving}>{saving ? 'Salvando...' : 'Salvar alterações'}</button>
                    <button type="button" className="btn-action btn-cancelar" onClick={() => setModoEdicao(false)} disabled={saving}>Cancelar</button>
                  </div>
                </form>
              )}
            </section>
          </div>
        )}
      </main>

      <footer className="bottombar">
        Plataforma Q.E. – Quero Estágio | IFAP – Campus Laranjal do Jari
        <small>© 2026 – Todos os direitos reservados</small>
      </footer>
    </div>
  );
}