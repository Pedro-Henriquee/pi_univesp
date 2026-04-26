import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";
import "./index.css";

function Funcionarios() {
  const navigate = useNavigate();
  const [funcionarios, setFuncionarios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [busca, setBusca] = useState("");
  const inputNomeFiltro = useRef(null);
  const inputNome = useRef(null);
  const inputCargo = useRef(null);
  const inputUsuario = useRef(null);


  function validateFields() {
    if (!inputNome.current.value || !inputCargo.current.value) {
      alert("Preencha todos os campos!");
      return false;
    }
    return true;
  }

  async function carregarFuncionarios() {
    const { data } = await api.get("/funcionarios");
    setFuncionarios(data);
  }

  async function buscarFuncionario() {
    const nome = inputNomeFiltro.current.value;

    if (!nome || nome.trim() === "") {
      carregarFuncionarios();
      return;
    }

    const { data } = await api.get("/funcionarios", {
      params: { nome },
    });

    setFuncionarios(data);
  }

  async function gravarFuncionario() {
    if (!validateFields()) {
      return;
    }

    if (editandoId) {
      await api.put(`/funcionarios/${editandoId}`, {
        nome: inputNome.current.value,
        cargo: inputCargo.current.value,
        username: inputUsuario.current.value || null
      });
    } else {
      await api.post("/funcionarios/criar", {
        nome: inputNome.current.value,
        cargo: inputCargo.current.value,
        username: inputUsuario.current.value || null
      });
    }

    alert(`Funcionário ${editandoId ? "atualizado" : "adicionado"} com sucesso!`);
    limparCampos();
    carregarFuncionarios();
  }

  async function deletarFuncionario(id) {
    if (window.confirm("Tem certeza que deseja excluir este funcionário?")) {
      await api.delete(`/funcionarios/${id}`);
      alert("Funcionário excluído com sucesso!");
      carregarFuncionarios();
    }
  }

  async function tornarAdmin(id) {
    await api.put(`/funcionarios/${id}/admin`, {
      is_admin: true,
    });
    alert("Funcionário promovido a admin com sucesso!");
    carregarFuncionarios();
  }


  function editarFuncionario(funcionario) {
    setEditandoId(funcionario.id);
    inputNome.current.value = funcionario.nome;
    inputCargo.current.value = funcionario.cargo;
    inputUsuario.current.value = funcionario.username || "NÃO CADASTRADO";
  }

  function limparCampos() {
    setEditandoId(null);
    inputNome.current.value = "";
    inputCargo.current.value = "";
    inputUsuario.current.value = "";
  }

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  return (
    <div className="funcionariosPage">
      <Header
        title="Gestão - Funcionários"
        previousScreen={() => navigate(-1)}
        usuario={{ nome: "Gerente"}}
      />

      <div className="funcionariosContent">
        <Sidebar ativo="Gestão de Funcionários" />

        <div className="funcionariosContainer">
          <div className="buscaContainer">
            <label className="buscaLabel">Buscar Funcionário</label>
            <div className="buscaInputContainer">
              <span className="buscaIcone">🔍</span>
              <input
                className="buscaInput"
                type="text"
                placeholder="Nome do funcionário"
                ref={inputNomeFiltro}
                onChange={buscarFuncionario}
              />
            </div>
          </div>

          <h2 className="titleSection">
            {editandoId ? "Editar funcionário" : "Adicionar funcionários"}
          </h2>

          <div className="inputsContainer">
            <input
              className="inputForm"
              name="nome"
              placeholder="Nome *"
              ref={inputNome}
            />
            <input
              className="inputForm"
              name="cargo"
              placeholder="Cargo *"
              ref={inputCargo}
            /><input
              className="inputForm"
              name="usuario"
              placeholder="Usuário (opcional)"
              ref={inputUsuario}
            />
            <button className="btnAdicionar" onClick={gravarFuncionario}>
              {editandoId ? "Salvar" : "Adicionar"}
            </button>
            {editandoId && (
              <button className="btnCancelar" onClick={limparCampos}>
                Cancelar
              </button>
            )}
          </div>

          <table className="tabela">
            <thead>
              <tr className="tabelaHeader">
                <th className="th">Nome</th>
                <th className="th">Cargo</th>
                <th className="th">Usuário</th>
                <th className="th">Ações</th>
              </tr>
            </thead>
            <tbody>
              {funcionarios.map((funcionario) => (
                <tr key={funcionario.id} className="tabelaLinha">
                  <td className="td">{funcionario.nome}{funcionario.is_admin && <span className="adminBadge"> (ADMIN) </span>}</td>
                  <td className={`td ${!funcionario.cargo ? "semCargo" : ""}`}>
                    {funcionario.cargo || "SEM CARGO"}
                  </td>
                  <td
                    className={`td ${!funcionario.username ? "naoAutenticado" : ""}`}
                  >
                    {funcionario.username || "NÃO CADASTRADO"}
                  </td>
                  <td className="td acoes">
                    {funcionario.username && !funcionario.is_admin ? (
                      <button
                        className="btnAdmin"
                        onClick={() => tornarAdmin(funcionario.id)}
                      >
                        Tornar admin
                      </button>
                    ) : null}
                    <button
                      className="btnEditar"
                      onClick={() => editarFuncionario(funcionario)}
                    >
                      Editar
                    </button>
                    <button
                      className="btnExcluir"
                      onClick={() => deletarFuncionario(funcionario.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Funcionarios;
