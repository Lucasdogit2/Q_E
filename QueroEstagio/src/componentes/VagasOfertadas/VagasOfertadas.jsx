
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VagasOfertadas.css';

export default function VagasOfertadas() {
  const navigate = useNavigate();

  const [menuAberto, setMenuAberto] = useState(false);
  const [estagioSelecionado, setEstagioSelecionado] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);

  // Estágios cadastrados
  const [vagas, setVagas] = useState([
    {
      id: 1,
      titulo: 'Estágio em Laboratório Avançado',
      tipo: 'Interno',
      vagas: 3,
      horas: 20,
      inicio: '15/05/2025',
      termino: '15/11/2025',
    },
    {
      id: 2,
      titulo: 'Desenvolvimento de Sistemas Acadêmicos',
      tipo: 'Interno',
      vagas: 2,
      horas: 20,
      inicio: '01/06/2025',
      termino: '01/12/2025',
    },
  ]);

  // Abre somente o estágio selecionado
  function abrirInformacoes(vaga) {
    setEstagioSelecionado({ ...vaga });
    setModoEdicao(false);
  }

  // Fecha a janela de informações
  function fecharInformacoes() {
    setEstagioSelecionado(null);
    setModoEdicao(false);
  }

  // Salva as alterações somente no estágio selecionado
  function salvarEstagio(evento) {
    evento.preventDefault();

    setVagas((anteriores) =>
      anteriores.map((vaga) =>
        vaga.id === estagioSelecionado.id
          ? { ...estagioSelecionado }
          : vaga
      )
    );

    setModoEdicao(false);
  }

  // Atualiza um campo do formulário
  function atualizarCampo(campo, valor) {
    setEstagioSelecionado((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  return (
    <div className="login-wrapper vagas-ofertadas-root">

      {/* TOPO */}
      <header className="topbar">
        <div className="brand">
          <div className="logo-square">Q.E</div>

          <div>
            <div style={{ fontSize: '0.95rem' }}>
              Q.E. – Quero Estágio
            </div>

            <div className="ifap-text">
              Instituto Federal do Amapá — Campus Laranjal do Jari
            </div>
          </div>
        </div>

        <button
          type="button"
          className="menu-btn"
          onClick={() => setMenuAberto(!menuAberto)}
        >
          ☰ Menu
        </button>
      </header>

      {/* MENU */}
      {menuAberto && (
        <nav className="menu-panel">
          <a
            href="/painel-ofertante"
            onClick={(e) => {
              e.preventDefault();
              navigate('/painel-ofertante');
            }}
          >
            Painel Principal
          </a>

          <a
            href="/ofertar-vaga"
            onClick={(e) => {
              e.preventDefault();
              navigate('/ofertar-vaga');
            }}
          >
            Ofertar Nova Vaga
          </a>

          <a
            href="/ofertante"
            onClick={(e) => {
              e.preventDefault();
              navigate('/ofertante');
            }}
            style={{ color: '#FF7F50', fontWeight: 'bold' }}
          >
            Sair
          </a>
        </nav>
      )}

      {/* CONTEÚDO */}
      <main className="container">
        <h1 className="page-title">
          Seus Estágios Ofertados
        </h1>

        <p className="page-subtitle">
          Gerencie os estágios e os estudantes vinculados aos seus projetos.
        </p>

        {/* CARTÕES DOS ESTÁGIOS */}
        <div className="cards-container">
          {vagas.map((vaga) => (
            <div className="stage-card" key={vaga.id}>

              <div className="card-header">
                <h2>{vaga.titulo}</h2>

                <span
                  className={`badge ${vaga.tipo.toLowerCase()}`}
                >
                  {vaga.tipo}
                </span>
              </div>

              <div className="card-actions">
                <button
                  type="button"
                  className="btn-action btn-access"
                  onClick={() => navigate('/detalhes-ofertante')}
                >
                  Lista de Estagiários
                </button>

                <button
                  type="button"
                  className="btn-action btn-orders"
                  onClick={() => abrirInformacoes(vaga)}
                >
                  Informações gerais
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* JANELA DE INFORMAÇÕES E EDIÇÃO */}
        {estagioSelecionado && (
          <div
            className="modal-overlay"
            onClick={fecharInformacoes}
          >
            <section
              className="modal-informacoes"
              role="dialog"
              aria-modal="true"
              aria-labelledby="titulo-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="btn-fechar"
                onClick={fecharInformacoes}
                aria-label="Fechar"
              >
                ×
              </button>

              <h2 id="titulo-modal">
                {modoEdicao
                  ? 'Editar estágio'
                  : 'Informações do Estágio'}
              </h2>

              {!modoEdicao ? (
                <>
                  <h3>{estagioSelecionado.titulo}</h3>

                  <p>
                    <strong>Tipo:</strong>{' '}
                    {estagioSelecionado.tipo}
                  </p>

                  <p>
                    <strong>Número de vagas:</strong>{' '}
                    {estagioSelecionado.vagas}
                  </p>

                  <p>
                    <strong>Carga horária:</strong>{' '}
                    {estagioSelecionado.horas} horas semanais
                  </p>

                  <p>
                    <strong>Data de início:</strong>{' '}
                    {estagioSelecionado.inicio}
                  </p>

                  <p>
                    <strong>Data de término:</strong>{' '}
                    {estagioSelecionado.termino}
                  </p>

                  <div className="modal-acoes">
                    <button
                      type="button"
                      className="btn-action btn-orders"
                      onClick={() => setModoEdicao(true)}
                    >
                      Editar estágio
                    </button>

                    <button
                      type="button"
                      className="btn-action btn-cancelar"
                      onClick={fecharInformacoes}
                    >
                      Fechar
                    </button>
                  </div>
                </>
              ) : (
                <form
                  className="form-edicao"
                  onSubmit={salvarEstagio}
                >
                  <label htmlFor="titulo-estagio">
                    Nome do estágio
                  </label>

                  <input
                    id="titulo-estagio"
                    type="text"
                    value={estagioSelecionado.titulo}
                    onChange={(e) =>
                      atualizarCampo('titulo', e.target.value)
                    }
                    required
                  />

                  <label htmlFor="tipo-estagio">
                    Tipo de estágio
                  </label>

                  <select
                    id="tipo-estagio"
                    value={estagioSelecionado.tipo}
                    onChange={(e) =>
                      atualizarCampo('tipo', e.target.value)
                    }
                    required
                  >
                    <option value="Interno">Interno</option>
                    <option value="Externo">Externo</option>
                  </select>

                  <label htmlFor="quantidade-vagas">
                    Número de vagas
                  </label>

                  <input
                    id="quantidade-vagas"
                    type="number"
                    min="1"
                    value={estagioSelecionado.vagas}
                    onChange={(e) =>
                      atualizarCampo('vagas', Number(e.target.value))
                    }
                    required
                  />

                  <label htmlFor="horas-estagio">
                    Carga horária semanal
                  </label>

                  <input
                    id="horas-estagio"
                    type="number"
                    min="1"
                    value={estagioSelecionado.horas}
                    onChange={(e) =>
                      atualizarCampo('horas', Number(e.target.value))
                    }
                    required
                  />

                  <label htmlFor="data-inicio">
                    Data de início
                  </label>

                  <input
                    id="data-inicio"
                    type="text"
                    placeholder="DD/MM/AAAA"
                    value={estagioSelecionado.inicio}
                    onChange={(e) =>
                      atualizarCampo('inicio', e.target.value)
                    }
                    required
                  />

                  <label htmlFor="data-termino">
                    Data de término
                  </label>

                  <input
                    id="data-termino"
                    type="text"
                    placeholder="DD/MM/AAAA"
                    value={estagioSelecionado.termino}
                    onChange={(e) =>
                      atualizarCampo('termino', e.target.value)
                    }
                    required
                  />

                  <div className="modal-acoes">
                    <button
                      type="submit"
                      className="btn-action btn-orders"
                    >
                      Salvar alterações
                    </button>

                    <button
                      type="button"
                      className="btn-action btn-cancelar"
                      onClick={() => {
                        const original = vagas.find(
                          (vaga) => vaga.id === estagioSelecionado.id
                        );

                        if (original) {
                          setEstagioSelecionado({ ...original });
                        }

                        setModoEdicao(false);
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </section>
          </div>
        )}
      </main>

  
      <footer className="bottombar">
        Plataforma Q.E. – Quero Estágio | IFAP – Campus Laranjal do Jari

        <small>
          © 2025 – Todos os direitos reservados
        </small>
      </footer>
    </div>
  );
}
