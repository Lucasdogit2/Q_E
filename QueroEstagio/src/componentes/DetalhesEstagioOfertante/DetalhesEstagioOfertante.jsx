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
      .then(r => {
        const list = r.applications || [];
        setApplications(list);
        if (list.length) setSelectedId(String(list[0].id));
      })
      .catch(e => setErro(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedId) { setAttendance([]); return; }
    api.attendance(selectedId)
      .then(r => setAttendance(r.attendance || []))
      .catch(e => setErro(e.message));
  }, [selectedId]);

  const selected = applications.find(a => String(a.id) === selectedId);

  const salvar = async (e) => {
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
      setAttendance(old => [result.attendance, ...old.filter(x => x.attendance_date !== date)]);
      alert('Frequência registrada com sucesso!');
      setNotes('');
    } catch (error) { alert(error.message); }
    finally { setSaving(false); }
  };

  return <div className="login-wrapper detalhes-ofertante-root">
    <header className="topbar"><div className="brand"><div className="logo-square">Q.E</div><div><div>Q.E. – Quero Estágio</div><div className="ifap-text">Instituto Federal do Amapá — Campus Laranjal do Jari</div></div></div>
      <button className="menu-btn" onClick={() => setMenuAberto(!menuAberto)}>☰ Menu</button></header>
    {menuAberto && <nav className="menu-panel"><a href="/painel-ofertante">Painel</a><a href="/vagas-ofertadas">Voltar</a><a href="/ofertante" onClick={api.logout}>Sair</a></nav>}
    <main className="container">
      <h1>Frequência dos Estagiários</h1>
      {loading && <p>Carregando estagiários...</p>}
      {erro && <p role="alert">{erro}</p>}
      {!loading && applications.length === 0 && <p>Não há estudantes com inscrição aprovada nas suas vagas.</p>}
      {applications.length > 0 && <>
        <div className="field"><label htmlFor="student">Selecione o estagiário</label>
          <select id="student" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
            {applications.map(a => <option key={a.id} value={a.id}>{a.student?.profile?.full_name || 'Estudante'} — {a.student?.course || 'Curso'} (matrícula {a.student?.registration || '—'})</option>)}
          </select>
        </div>
        {selected && <section className="interns-card">
          <h2>Registrar frequência</h2>
          <form onSubmit={salvar}>
            <div className="field"><label htmlFor="attendanceDate">Data</label><input id="attendanceDate" type="date" value={date} onChange={e => setDate(e.target.value)} required /></div>
            <div className="field"><label htmlFor="attendanceStatus">Situação</label><select id="attendanceStatus" value={status} onChange={e => setStatus(e.target.value)}><option value="present">Presente</option><option value="absent">Ausente</option></select></div>
            <div className="field"><label htmlFor="hoursWorked">Horas trabalhadas</label><input id="hoursWorked" type="number" min="0" step="0.25" required value={status === 'absent' ? 0 : hours} disabled={status === 'absent'} onChange={e => setHours(e.target.value)} /></div>
            <div className="field"><label htmlFor="attendanceNotes">Observações</label><textarea id="attendanceNotes" value={notes} onChange={e => setNotes(e.target.value)} /></div>
            <button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar frequência'}</button>
          </form>
          <h2>Registros anteriores</h2>
          {attendance.length === 0 ? <p>Nenhum registro para este estudante.</p> : <table className="interns-table"><thead><tr><th>Data</th><th>Situação</th><th>Horas</th><th>Observações</th></tr></thead><tbody>
            {attendance.map(a => <tr key={a.id}><td>{a.attendance_date}</td><td>{a.status === 'present' ? 'Presente' : 'Ausente'}</td><td>{a.hours_worked}</td><td>{a.notes || '—'}</td></tr>)}
          </tbody></table>}
        </section>}
      </>}
    </main>
    <footer className="bottombar">Plataforma Q.E. – Quero Estágio | IFAP – Campus Laranjal do Jari</footer>
  </div>;
}
