import Sidebar from "../Sidebar";
import Header from "../Header";
import { useNavigate } from "react-router-dom";
import { getUsuarioLogado } from "../../utils/session";

function Layout({
  title,
  nextScreen,
  usuario,
  ativo,
  children
}) {

  const navigate = useNavigate();
  const usuarioAtual = usuario || getUsuarioLogado() || { nome: "Gerente", tipo: "admin" };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header title={title} previousScreen={() => navigate(-1)} nextScreen={nextScreen} usuario={usuarioAtual} />

      <div style={{ display: "flex", flex: 1, minHeight: "calc(100vh - 80px)" }}>
        <Sidebar ativo={ativo} usuario={usuarioAtual} />

        <main style={{ flex: 1, padding: "45px", background: "#f4f5f7" }}>
          {  children }
        </main>
      </div>
    </div>
  );
}

export default Layout;
