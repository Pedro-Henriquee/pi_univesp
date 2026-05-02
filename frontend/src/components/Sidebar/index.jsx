import "./index.css";
import { NavLink } from "react-router-dom";

function Sidebar({ ativo }) {
  const itensMenu = [
    { nome: "Visão geral", href: "/visao-geral" },
    { nome: "Gestão de Funcionários", href: "/funcionarios" },
    { nome: "Gestão de Escalas", href: "/escalas" },
    { nome: "Gestão de Tarefas", href: "/tarefas" },
  ];

  return (
    <div className="sidebarContainer">
      {itensMenu.map((item) => {
        const estaAtivo = item.nome === ativo;

        return (
          <a
            className={`itemSidebar ${estaAtivo ? "itemAtivo" : ""}`}
            key={item.nome}
            href={item.href}
          >
            {item.nome}
          </a>
        );
      })}
    </div>
  );
}

export default Sidebar;