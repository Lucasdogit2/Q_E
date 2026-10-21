import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './componentes/Login/Login';
import LoginOfertante from './componentes/LoginOfertante/LoginOfertante';
import Painel from './componentes/Painel/Painel';
import PainelOfertante from './componentes/PainelOfertante/PainelOfertante';
import OfertarVaga from './componentes/OfertarVaga/OfertarVaga';
import VagasOfertadas from './componentes/VagasOfertadas/VagasOfertadas';
import BuscarEstagios from './componentes/BuscarEstagios/BuscarEstagios';
import DetalhesEstagio from './componentes/DetalhesEstagio/DetalhesEstagio';
import MeusEstagios from './componentes/MeusEstagios/MeusEstagios';
import MeuEstagioAtivo from './componentes/MeuEstagioAtivo/MeuEstagioAtivo';
import DetalhesEstagioOfertante from './componentes/DetalhesEstagioOfertante/DetalhesEstagioOfertante';
import PedidosEstagio from './componentes/PedidosEstagio/PedidosEstagio';
import AprovacaoEstagio from './componentes/AprovacaoEstagio/AprovacaoEstagio';


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Rotas de Autenticação */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/ofertante"
          element={<LoginOfertante />}
        />


        {/* Painéis Principais */}

        <Route
          path="/painel"
          element={<Painel />}
        />

        <Route
          path="/painel-ofertante"
          element={<PainelOfertante />}
        />


        {/* Rotas do Ofertante */}

        <Route
          path="/ofertar-vaga"
          element={<OfertarVaga />}
        />

        <Route
          path="/vagas-ofertadas"
          element={<VagasOfertadas />}
        />

        <Route
          path="/detalhes-ofertante"
          element={<DetalhesEstagioOfertante />}
        />

        <Route
          path="/pedidos-ofertante"
          element={<PedidosEstagio />}
        />

        <Route
          path="/aprovacao-estagio"
          element={<AprovacaoEstagio />}
        />



        {/* Outras rotas */}

   <Route path="/buscar" element={<BuscarEstagios />} />

  <Route
  path="/detalhes"
  element={<DetalhesEstagio />}
/>

<Route
  path="/detalhes-estagio"
  element={<DetalhesEstagio />}
/>
        <Route
          path="/meus-estagios"
          element={<MeusEstagios />}
        />

        <Route
          path="/meu-estagio-ativo"
          element={<MeuEstagioAtivo />}
        />

      </Routes>

    </BrowserRouter>
  );
}
export default App;
