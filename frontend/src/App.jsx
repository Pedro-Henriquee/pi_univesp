import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Funcionarios from './pages/Funcionarios';
import GestaoTarefas from './pages/GestaoTarefas';
import VisaoGeral from './pages/VisaoGeral';
import VisaoGeralUsuario from "./pages/VisaoGeralUsuario";
import VerPerfil from "./pages/VerPerfil";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        { <Route path="/" element={<VisaoGeralUsuario/>} />   /*esse aqui o certo é Home eu troquei para visualizar  */}
        <Route path="/login" element={<Login/>} />
        <Route path="/funcionarios" element={<Funcionarios/>} />
        <Route path="/tarefas" element={<GestaoTarefas />} />
        <Route path="/visao-geral" element={<VisaoGeral />} />
        <Route path="/visao-geral-usuario" element={<VisaoGeralUsuario />} />
        <Route path="/ver-perfil" element={<VerPerfil />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;