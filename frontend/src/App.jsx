import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Funcionarios from './pages/Funcionarios';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/funcionarios" element={<Funcionarios/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;