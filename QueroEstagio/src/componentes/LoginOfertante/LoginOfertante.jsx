
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginOfertante.css';

export default function LoginOfertante() {
  const navigate = useNavigate();

  // Controla o menu
  const [menuAberto, setMenuAberto] = useState(false);

  // Alterna entre login e cadastro
  const [modoCadastro, setModoCadastro] = useState(false);

  // Campos do login
  const [identificador, setIdentificador] = useState('');
  const [senha, setSenha] = useState('');

  // Campos do cadastro
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Voltar para a tela de estudante
  const handleEstudanteClick = () => {
    navigate('/');
  };

  // Login do ofertante
  const handleLogin = (e) => {
    e.preventDefault();

    if (
      identificador.trim() === '' ||
      senha === ''
    ) {
      alert('Preencha o e-mail e a senha!');
      return;
    }

    // Recupera os ofertantes cadastrados
    const ofertantes = JSON.parse(
      localStorage.getItem('ofertantes') || '[]'
    );

    // Procura uma conta com o e-mail e a senha informados
    const ofertanteEncontrado = ofertantes.find(
      (ofertante) =>
        ofertante.email.toLowerCase() ===
          identificador.trim().toLowerCase() &&
        ofertante.senha === senha
    );

    if (!ofertanteEncontrado) {
      alert('E-mail ou senha incorretos. Verifique seus dados.');
      return;
    }

    // Guarda o ofertante que entrou
    localStorage.setItem(
      'ofertanteLogado',
      JSON.stringify({
        nome: ofertanteEncontrado.nome,
        email: ofertanteEncontrado.email
      })
    );

    navigate('/painel-ofertante');
  };

  // Cadastro do ofertante
  const handleCadastro = (e) => {
    e.preventDefault();

    if (
      nome.trim() === '' ||
      email.trim() === '' ||
      novaSenha === '' ||
      confirmarSenha === ''
    ) {
      alert('Preencha todos os campos!');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    const emailNormalizado = email.trim().toLowerCase();

    // Recupera a lista existente
    const ofertantes = JSON.parse(
      localStorage.getItem('ofertantes') || '[]'
    );

    // Impede cadastrar o mesmo e-mail duas vezes
    const emailExiste = ofertantes.some(
      (ofertante) =>
        ofertante.email.toLowerCase() === emailNormalizado
    );

    if (emailExiste) {
      alert('Já existe um cadastro com esse e-mail!');
      return;
    }

    // Monta o novo cadastro
    const novoOfertante = {
      id: Date.now(),
      nome: nome.trim(),
      email: emailNormalizado,
      senha: novaSenha
    };

    // Adiciona à lista sem apagar os outros cadastros
    ofertantes.push(novoOfertante);

    localStorage.setItem(
      'ofertantes',
      JSON.stringify(ofertantes)
    );

    alert('Cadastro realizado com sucesso! Agora faça seu login.');

    // Preenche o e-mail no login e limpa os outros campos
    setIdentificador(emailNormalizado);
    setSenha('');
    setNome('');
    setEmail('');
    setNovaSenha('');
    setConfirmarSenha('');

    // Volta para o login
    setModoCadastro(false);
  };

  return (
    <div className="login-wrapper tela-ofertante">

      {/* CABEÇALHO */}
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

        <button
          type="button"
          className="menu-btn"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-expanded={menuAberto}
        >
          ☰ Menu
        </button>
      </header>

      {/* MENU */}
      {menuAberto && (
        <nav className="menu-panel">
          <a
            href="#sobre"
            onClick={() => setMenuAberto(false)}
          >
            Sobre
          </a>

          <a
            href="#ajuda"
            onClick={() => setMenuAberto(false)}
          >
            Ajuda
          </a>

          <a
            href="#contato"
            onClick={() => setMenuAberto(false)}
          >
            Contato
          </a>
        </nav>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <main className="container">
        <section className="login-card">

          {!modoCadastro ? (
            <>
              {/* TELA DE LOGIN */}
              <h1 className="login-title">
                Área do Ofertante
              </h1>

              <p className="login-sub">
                Entre com sua conta corporativa para gerenciar e ofertar vagas.
              </p>

              <form onSubmit={handleLogin}>
                <div className="field">
                  <label htmlFor="identificador">
                    E-mail corporativo
                  </label>

                  <input
                    id="identificador"
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={identificador}
                    onChange={(e) =>
                      setIdentificador(e.target.value)
                    }
                    autoComplete="username"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="senha">
                    Senha
                  </label>

                  <input
                    id="senha"
                    type="password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) =>
                      setSenha(e.target.value)
                    }
                    autoComplete="current-password"
                    required
                  />
                </div>

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
                    onClick={handleEstudanteClick}
                  >
                    Entrar como estudante (SUAP)
                  </button>
                </div>

                <p className="cadastro-pergunta">
                  Sua empresa ou setor ainda não possui cadastro?
                </p>

                <button
                  type="button"
                  className="btn-cadastrarr"
                  onClick={() => setModoCadastro(true)}
                >
                  Cadastrar ofertante
                </button>

                <p className="alt-note">
                  Cadastre sua empresa ou setor para acessar a área
                  de gerenciamento de estágios.
                </p>
              </form>
            </>
          ) : (
            <>
              {/* TELA DE CADASTRO */}
              <h1 className="login-title">
                Cadastrar ofertante
              </h1>

              <p className="login-sub">
                Preencha os dados da empresa ou setor.
              </p>

              <form onSubmit={handleCadastro}>
                <div className="field">
                  <label htmlFor="nome">
                    Nome da empresa ou setor
                  </label>

                  <input
                    id="nome"
                    type="text"
                    placeholder="Digite o nome da empresa ou setor"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    autoComplete="organization"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="email">
                    E-mail corporativo
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="Digite o e-mail corporativo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>

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
                    autoComplete="new-password"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="confirmarSenha">
                    Confirmar senha
                  </label>

                  <input
                    id="confirmarSenha"
                    type="password"
                    placeholder="Digite a senha novamente"
                    value={confirmarSenha}
                    onChange={(e) =>
                      setConfirmarSenha(e.target.value)
                    }
                    autoComplete="new-password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary btn-cadastro-final"
                >
                  Cadastrar
                </button>

                <button
                  type="button"
                  className="btn-voltarr-login"
                  onClick={() => setModoCadastro(false)}
                >
                  Já possui cadastro? Voltar para o login
                </button>
              </form>
            </>
          )}

        </section>
      </main>

      {/* RODAPÉ */}
      <footer className="bottombar">
        <span>
          Plataforma Q.E. – Quero Estágio | Vinculada ao Instituto
          Federal do Amapá – Campus Laranjal do Jari
        </span>

        <small>
          © 2026 – Todos os direitos reservados
        </small>
      </footer>

    </div>
  );
}

  
