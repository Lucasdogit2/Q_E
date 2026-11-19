import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './DetalhesEstagioOfertante.css';

function getLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function DetalhesEstagioOfertante() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [applications, setApplications] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [date, setDate] = useState(getLocalDate());
  const [status, setStatus] = useState('present');
  const [hours, setHours] = useState('4');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.approvedApplications()
      .then(result => {
        const list = result.applications || [];
        setApplications(list);
        if (list.length) setSelectedId(String(list[0].id));
      })
      .catch(error => setErro(error.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    api.attendance(selectedId)
      .then(result => setAttendance(result.attendance || []))
      .catch(error => setErro(error.message));
  }, [selectedId]);

  const selected = applications.find(item => String(item.id) === selectedId);

  const salvar = async e => {
    e.preventDefault();
    if (!selectedId) return;
    setSaving(true);
    try {
      const result = await api.saveAttendance(selectedId, {
        attendance_date: date,
        status,
        hours_worked: status === 'absent' ? 0 : Number(hours),
        notes
      });
      setAttendance(previous => [result.attendance, ...previous.filter(item => item.attendance_date !== date)]);
      alert('Frequência registrada com sucesso!');
      setNotes('');
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
    <div className="login-wrapper detalhes-ofertante-root">
      <header className="topbar">
        <div className="brand">
          <div className="logo-square">Q.E</div>
          <div>
            <div style={{ fontSize: '0.95rem' }}>Q.E. – Quero Estágio</div>
            <div className="ifap-text">Instituto Federal do Amapá — Campus Laranjal do Jari</div>
          </div>
        </div>
        <button className="menu-btn" onClick={() => setMenuAberto(!menuAberto)} aria-expanded={menuAberto}>☰ Menu</button>
      </header>

      {menuAberto && (
        <nav className="menu-panel">
          <a href="/painel-ofertante" onClick={e => { e.preventDefault(); navigate('/painel-ofertante'); }}>Painel</a>
          <a href="/vagas-ofertadas" onClick={e => { e.preventDefault(); navigate('/vagas-ofertadas'); }}>Voltar</a>
          <a href="/ofertante" onClick={e => { e.preventDefault(); sair(); }} style={{ color: '#FF7F50', fontWeight: 'bold' }}>Sair</a>
        </nav>
      )}

      <main className="container">
        <div className="header-info">
          <h1>Frequência dos Estagiários</h1>
          <span className="badge">Aprovados</span>
        </div>

        {loading && <p>Carregando estagiários...</p>}
        {erro && <p role="alert">{erro}</p>}
        {!loading && applications.length === 0 && <p>Não há estudantes com inscrição aprovada nas suas vagas.</p>}

        {applications.length > 0 && (
          <>
            <section className="interns-card">
              <h2>Lista de Estagiários</h2>
              <div className="field">
                <label htmlFor="student">Selecione o estagiário</label>
                <select id="student" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
                  {applications.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.student?.profile?.full_name || 'Estudante'} — {item.student?.course || 'Curso'} (matrícula {item.student?.registration || '—'})
                    </option>
                  ))}
                </select>
              </div>

              {selected && (
                <div className="table-wrapper">
                  <p><strong>Estudante:</strong> {selected.student?.profile?.full_name || 'Estudante'}</p>
                  <p><strong>Curso:</strong> {selected.student?.course || '—'} · <strong>Matrícula:</strong> {selected.student?.registration || '—'}</p>
                  <p><strong>Estágio:</strong> {selected.internship?.title || 'Estágio aprovado'}</p>
                </div>
              )}
            </section>

            <section className="interns-card">
              <h2>Registrar frequência</h2>
              <form onSubmit={salvar}>
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="attendanceDate">Data</label>
                    <input id="attendanceDate" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                  </div>
                  <div className="field">
                    <label htmlFor="attendanceStatus">Situação</label>
                    <select id="attendanceStatus" value={status} onChange={e => setStatus(e.target.value)}>
                      <option value="present">Presente</option>
                      <option value="absent">Ausente</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="hoursWorked">Horas trabalhadas</label>
                    <input id="hoursWorked" type="number" min="0" step="0.25" value={status === 'absent' ? 0 : hours} disabled={status === 'absent'} onChange={e => setHours(e.target.value)} required />
                  </div>
                  <div className="field">
                    <label htmlFor="attendanceNotes">Observações</label>
                    <textarea id="attendanceNotes" value={notes} onChange={e => setNotes(e.target.value)} />
                  </div>
                </div>
                <div className="action-footer">
                  <button className="btn-finish" type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar frequência'}</button>
                </div>
              </form>
            </section>

            <section className="interns-card">
              <h2>Histórico de Frequência</h2>
              <div className="table-wrapper">
                {attendance.length === 0 ? <p>Nenhum registro para este estudante.</p> : (
                  <table className="interns-table">
                    <thead><tr><th>Data</th><th>Presença</th><th>Horas</th><th>Observações</th></tr></thead>
                    <tbody>
                      {attendance.map(item => (
                        <tr key={item.id}>
                          <td>{item.attendance_date}</td>
                          <td>{item.status === 'present' ? 'Presente' : 'Ausente'}</td>
                          <td>{item.hours_worked}</td>
                          <td>{item.notes || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="bottombar">
        Plataforma Q.E. – Quero Estágio | IFAP – Campus Laranjal do Jari
        <small>© 2026 – Todos os direitos reservados</small>
      </footer>
    </div>
  );
}