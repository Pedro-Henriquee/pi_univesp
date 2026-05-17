import Sidebar from "../Sidebar";
import Header from "../Header";
import { useNavigate } from "react-router-dom";
import { getUsuarioLogado } from "../../utils/session";
import "./index.css";

function Layout({ title, nextScreen, usuario, ativo, children }) {
  const navigate = useNavigate();
  const usuarioAtual =
    usuario || getUsuarioLogado() || { nome: "Gerente", tipo: "admin" };

  return (
    <div className="layoutContainer">
      <Header
        title={title}
        previousScreen={() => navigate(-1)}
        nextScreen={nextScreen}
        usuario={usuarioAtual}
      />

      <div className="layoutBody">
        <Sidebar ativo={ativo} usuario={usuarioAtual} />
        <main className="layoutMain">{children}</main>
      </div>
    </div>
  );
}

export default Layout;