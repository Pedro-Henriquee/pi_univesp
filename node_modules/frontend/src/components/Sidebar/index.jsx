import "./index.css";
import { NavLink } from "react-router-dom";
import { isAdmin } from "../../utils/session";

function Sidebar({ ativo, usuario }) {
  const itensMenuAdmin = [
    { nome: "Visão geral", href: "/visao-geral" },
    { nome: "Gestão de Funcionários", href: "/funcionarios" },
    { nome: "Gestão de Escalas", href: "/escalas" },
    { nome: "Gestão de Tarefas", href: "/tarefas" },
  ];
  const itensMenu = isAdmin(usuario)
    ? itensMenuAdmin
    : itensMenuAdmin.filter((item) => item.href === "/visao-geral");

  return (
    <div className="sidebarContainer">
      {itensMenu.map((item) => {
        const estaAtivo = item.nome === ativo;

        return (
          <NavLink
            className={`itemSidebar ${estaAtivo ? "itemAtivo" : ""}`}
            key={item.nome}
            to={item.href}
          >
            {item.nome}
          </NavLink>
        );
      })}
    </div>
  );
}

export default Sidebar;
