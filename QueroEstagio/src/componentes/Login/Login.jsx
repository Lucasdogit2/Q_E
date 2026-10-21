import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

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

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (matricula.trim() !== '' && senha.trim() !== '') {
      navigate('/painel');
    } else {
      alert('Por favor, preencha a matrícula e a senha!');
    }
  };

  const handleOfertanteClick = () => {
    navigate('/ofertante');
  };




  const handleCadastro = (e) => {
    e.preventDefault();

    if (
      nome.trim() === '' ||
      novaMatricula.trim() === '' ||
      email.trim() === '' ||
      novaSenha.trim() === '' ||
      confirmarSenha.trim() === ''
    ) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    const usuario = {
      nome: nome,
      matricula: novaMatricula,
      email: email,
      senha: novaSenha
    };

    localStorage.setItem('usuario', JSON.stringify(usuario));

    alert('Usuário cadastrado com sucesso!');

    // Limpar campos
    setNome('');
    setNovaMatricula('');
    setEmail('');
    setNovaSenha('');
    setConfirmarSenha('');

    // Voltar para login
    setModoCadastro(false);
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
                    Entrar
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
                  Ao entrar, você será redirecionado para autenticação via SUAP.
                  Caso não tenha credenciais, procure a secretaria do seu curso.
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
  Cadastrar
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