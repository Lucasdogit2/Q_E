import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AprovacaoEstagio.css";

function AprovacaoEstagio() {

  const navigate = useNavigate();

  // Controla se o menu está aberto
  const [menuAberto, setMenuAberto] = useState(false);

  // Guarda o status de cada pedido
  const [status, setStatus] = useState({
    1: "Pendente",
    2: "Pendente",
    3: "Pendente"
  });

  // Função para alterar o status
  const alterarStatus = (id, novoStatus) => {
    setStatus({
      ...status,
      [id]: novoStatus
    });
  };

  return (

    <div className="aprovacao-page">

      {/* Cabeçalho */}
      <header className="aprovacao-header">

        <div className="aprovacao-brand">

          <div className="aprovacao-logo">
            Q.E
          </div>

          <div className="aprovacao-brand-text">
            <strong>Q.E. – Quero Estágio</strong>

            <span>
              Instituto Federal do Amapá — Campus Laranjal do Jari
            </span>
          </div>

        </div>


        {/* Botão do Menu */}
        <button
          className="menu-btn"
          onClick={() => setMenuAberto(!menuAberto)}
        >
          ☰ Menu
        </button>

      </header>


      {/* Menu */}
      {menuAberto && (

        <nav className="menu-panel">

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/ofertar-vaga");
            }}
          >
            Ofertar Estágios
          </a>


          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/vagas-ofertadas");
            }}
          >
            Estágios Ofertados
          </a>


          <a
            href="#"
            className="sair"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login-ofertante");
            }}
          >
            Sair
          </a>

        </nav>

      )}


      {/* Conteúdo */}
      <main className="aprovacao-main">

        <div className="aprovacao-titulo">

          <h1>Aprovação de estágio</h1>

          <p>
            Analise os pedidos de estágio dos estudantes e escolha
            se deseja aprovar ou recusar cada solicitação.
          </p>

        </div>


        {/* PEDIDO 1 */}
        <section className="pedido-card">

          <div className="pedido-topo">

            <h2>Pedido de estágio</h2>

            <span
              className={
                status[1] === "Aprovado"
                  ? "status-aprovado"
                  : status[1] === "Recusado"
                  ? "status-recusado"
                  : "status-pendente"
              }
            >
              {status[1]}
            </span>

          </div>


          <div className="pedido-informacoes">

            <div className="informacao">
              <span>Aluno</span>
              <strong>Ana Silva</strong>
            </div>

            <div className="informacao">
              <span>Estágio escolhido</span>
              <strong>Informática</strong>
            </div>

            <div className="informacao">
              <span>Curso</span>
              <strong>Técnico em Informática</strong>
            </div>

            <div className="informacao">
              <span>Data da solicitação</span>
              <strong>04/10/2026</strong>
            </div>

          </div>


          <div className="pedido-acoes">

            <button
              className="btn-recusar"
              onClick={() => alterarStatus(1, "Recusado")}
            >
              Recusar
            </button>

            <button
              className="btn-aprovar"
              onClick={() => alterarStatus(1, "Aprovado")}
            >
              Aprovar
            </button>

          </div>

        </section>


        {/* PEDIDO 2 */}
        <section className="pedido-card">

          <div className="pedido-topo">

            <h2>Pedido de estágio</h2>

            <span
              className={
                status[2] === "Aprovado"
                  ? "status-aprovado"
                  : status[2] === "Recusado"
                  ? "status-recusado"
                  : "status-pendente"
              }
            >
              {status[2]}
            </span>

          </div>


          <div className="pedido-informacoes">

            <div className="informacao">
              <span>Aluno</span>
              <strong>Lucas Oliveira</strong>
            </div>

            <div className="informacao">
              <span>Estágio escolhido</span>
              <strong>Desenvolvimento Web</strong>
            </div>

            <div className="informacao">
              <span>Curso</span>
              <strong>Técnico em Informática</strong>
            </div>

            <div className="informacao">
              <span>Data da solicitação</span>
              <strong>03/10/2026</strong>
            </div>

          </div>


          <div className="pedido-acoes">

            <button
              className="btn-recusar"
              onClick={() => alterarStatus(2, "Recusado")}
            >
              Recusar
            </button>

            <button
              className="btn-aprovar"
              onClick={() => alterarStatus(2, "Aprovado")}
            >
              Aprovar
            </button>

          </div>

        </section>


        {/* PEDIDO 3 */}
        <section className="pedido-card">

          <div className="pedido-topo">

            <h2>Pedido de estágio</h2>

            <span
              className={
                status[3] === "Aprovado"
                  ? "status-aprovado"
                  : status[3] === "Recusado"
                  ? "status-recusado"
                  : "status-pendente"
              }
            >
              {status[3]}
            </span>

          </div>


          <div className="pedido-informacoes">

            <div className="informacao">
              <span>Aluno</span>
              <strong>Mariana Santos</strong>
            </div>

            <div className="informacao">
              <span>Estágio escolhido</span>
              <strong>Suporte Técnico</strong>
            </div>

            <div className="informacao">
              <span>Curso</span>
              <strong>Técnico em Informática</strong>
            </div>

            <div className="informacao">
              <span>Data da solicitação</span>
              <strong>02/10/2026</strong>
            </div>

          </div>


          <div className="pedido-acoes">

            <button
              className="btn-recusar"
              onClick={() => alterarStatus(3, "Recusado")}
            >
              Recusar
            </button>

            <button
              className="btn-aprovar"
              onClick={() => alterarStatus(3, "Aprovado")}
            >
              Aprovar
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AprovacaoEstagio;
