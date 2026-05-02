import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout({
  children,
  titulo,
  ativo = "Gestão de Tarefas",
  usuario = { nome: "Gerente", tipo: "admin" },
}) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header title={titulo} previousScreen="/" usuario={usuario} />

      <div style={{ display: "flex", flex: 1, minHeight: "calc(100vh - 80px)" }}>
        <Sidebar ativo={ativo} />

        <main style={{ flex: 1, padding: "45px", background: "#f4f5f7" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;