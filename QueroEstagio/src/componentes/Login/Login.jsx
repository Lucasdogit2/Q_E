import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { api } from '../../services/api';

export default function Login() {

  const [menuAberto, setMenuAberto] = useState(false);

  // Controla Login / Cadastro
  const [modoCadastro, setModoCadastro] = useState(false);

  // Login
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');

  // Cadastro
  const [nome, setNome] = useState('');
  const [novaMatricula, setNovaMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [curso, setCurso] = useState('');
  const [anoAcademico, setAnoAcademico] = useState('');
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setCarregando(true);
    try {
      const result = await api.login({ email: matricula, password: senha });
      if (result.user.role !== 'student') {
        throw new Error('Esta conta não é de estudante. Use o acesso de servidor.');
      }
      localStorage.setItem('qe_access_token', result.access_token);
      localStorage.setItem('qe_user', JSON.stringify(result.user));
      navigate('/painel');
    } catch (error) {
      alert(error.message);
    } finally {
      setCarregando(false);
    }
  };

  const handleOfertanteClick = () => {
    navigate('/ofertante');
  };




  const handleCadastro = async (e) => {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }
    setCarregando(true);
    try {
      const result = await api.register({
        full_name: nome,
        email,
        password: novaSenha,
        registration: novaMatricula,
        course: curso,
        academic_year: Number(anoAcademico)
      });
      alert(result.message || 'Cadastro realizado com sucesso!');
      setNome('');
      setNovaMatricula('');
      setEmail('');
      setNovaSenha('');
      setConfirmarSenha('');
      setCurso('');
      setAnoAcademico('');
      setModoCadastro(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setCarregando(false);
    }
  };


  return (

    <div className="login-wrapper tela-estudante">
      <header className="topbar" role="banner">

        <div className="brand">

          <div className="logo-square" aria-hidden="true">
            Q.E
          </div>

          <div>

            <div style={{ fontSize: '0.95rem' }}>
              Q.E. – Quero Estágio
            </div>

            <div
              style={{
                fontSize: '0.78rem',
                color: 'rgba(255,255,255,0.9)'
              }}
            >
              Instituto Federal do Amapá — Campus Laranjal do Jari
            </div>

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


      {/* ================= MENU ================= */}

      {menuAberto && (

        <nav className="menu-panel">

          <a
            href="#"
            onClick={() => setMenuAberto(false)}
          >
            Sobre
          </a>

          <a
            href="#"
            onClick={() => setMenuAberto(false)}
          >
            Ajuda
          </a>

          <a
            href="#"
            onClick={() => setMenuAberto(false)}
          >
            Contato
          </a>

        </nav>

      )}


      <main className="container">

        <section className="login-card">



          {!modoCadastro && (

            <>

              <h1 className="login-title">
                Acesse sua conta
              </h1>

              <p className="login-sub">
                Entre com seu login para acessar o painel de estágio.
              </p>


              <form onSubmit={handleLogin}>

                {/* MATRÍCULA */}

                <div className="field">

                  <label htmlFor="matricula">
                     Email
                  </label>

                  <input
                    id="matricula"
                    type="text"
                    placeholder="Digite seu Email"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    required
                  />

                </div>


                {/* SENHA */}

                <div className="field">

                  <label htmlFor="senha">
                    Senha
                  </label>

                  <input
                    id="senha"
                    type="password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />

                </div>


                {/* BOTÕES */}

                <div className="actions">

                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {carregando ? 'Aguarde...' : 'Entrar'}
                  </button>


                  <button
                    type="button"
                    className="btn-link"
                    onClick={handleOfertanteClick}
                  >
                    Entrar como ofertante de estágio
                  </button>

                </div>


                {/* CADASTRO */}

                <p className="cadastro-pergunta">
                  Não possui cadastro?
                </p>


                <button
                  type="button"
                  className="btn-cadastrar"
                  onClick={() => setModoCadastro(true)}
                >
                  Cadastrar usuário
                </button>


                <p className="alt-note">
                  Entre com seu e-mail e senha cadastrados na plataforma Q.E.
                </p>

              </form>

            </>

          )}


          {modoCadastro && (

            <>

              <h1 className="login-title">
                Cadastrar usuário
              </h1>

              <p className="login-sub">
                Preencha os dados abaixo para criar sua conta.
              </p>


              <form onSubmit={handleCadastro}>


                {/* NOME */}

                <div className="field">

                  <label htmlFor="nome">
                    Nome completo
                  </label>

                  <input
                    id="nome"
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />

                </div>


                {/* MATRÍCULA */}

                <div className="field">

                  <label htmlFor="novaMatricula">
                    Matrícula (SUAP)
                  </label>

                  <input
                    id="novaMatricula"
                    type="text"
                    placeholder="Digite sua matrícula"
                    value={novaMatricula}
                    onChange={(e) => setNovaMatricula(e.target.value)}
                    required
                  />

                </div>


                <div className="field">
                  <label htmlFor="curso">Curso</label>
                  <input id="curso" type="text" placeholder="Digite seu curso" value={curso} onChange={(e) => setCurso(e.target.value)} required />
                </div>

                <div className="field">
                  <label htmlFor="anoAcademico">Ano/período acadêmico</label>
                  <input id="anoAcademico" type="number" min="1" placeholder="Ex.: 2026" value={anoAcademico} onChange={(e) => setAnoAcademico(e.target.value)} required />
                </div>

                {/* EMAIL */}

                <div className="field">

                  <label htmlFor="email">
                    E-mail
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                </div>


                {/* SENHA */}

                <div className="field">

                  <label htmlFor="novaSenha">
                    Senha
                  </label>

                  <input
                    id="novaSenha"
                    type="password"
                    placeholder="Crie uma senha"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    required
                  />

                </div>


                {/* CONFIRMAR SENHA */}

                <div className="field">

                  <label htmlFor="confirmarSenha">
                    Confirmar senha
                  </label>

                  <input
                    id="confirmarSenha"
                    type="password"
                    placeholder="Digite a senha novamente"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                  />

                </div>


                {/* CADASTRAR */}

                <button
                  type="submit"
             className="btn-cadastrar-estudante">
  {carregando ? 'Cadastrando...' : 'Cadastrar'}
</button>

                {/* VOLTAR */}

                <button
                  type="button"
                  className="btn-voltar-llogin"
                  onClick={() => setModoCadastro(false)}
                >
                  Já possui uma conta? Voltar para o login
                </button>

              </form>

            </>

          )}

        </section>

      </main>


      {/* ================= RODAPÉ ================= */}

      <footer className="bottombar">

        Plataforma Q.E. – Quero Estágio |
        Vinculada ao Instituto Federal do Amapá –
        Campus Laranjal do Jari

        <small>
          ©️ 2025 – Todos os direitos reservados
        </small>

      </footer>

    </div>
  );
}