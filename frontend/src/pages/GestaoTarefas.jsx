import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import "./GestaoTarefas.css";

function GestaoTarefas() {
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEdicao, setIdEdicao] = useState(null);
  const [busca, setBusca] = useState("");

  const [funcionarios, setFuncionarios] = useState([]);

  const [tarefa, setTarefa] = useState({
    titulo: "",
    descricao: "",
    responsavel: "",
    prazo: "",
  });

  const [tarefas, setTarefas] = useState([]);

  async function carregarTarefas() {
    try {
      const resposta = await api.get("/tarefas/tarefas");

      const tarefasFormatadas = resposta.data.map((item) => ({
        id: item.tarefa_id,
        titulo: item.titulo,
        descricao: item.descricao,
        responsavel: item.funcionario_nome || "Sem responsável",
        funcionario_id: item.funcionario_id,
        prazo: item.prazo ? item.prazo.substring(0, 10) : "",
      }));

      setTarefas(tarefasFormatadas);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar tarefas do banco.");
    }
  }

  async function carregarFuncionarios() {
    try {
      const resposta = await api.get("/funcionarios");
      setFuncionarios(resposta.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar funcionários.");
    }
  }

  useEffect(() => {
    carregarTarefas();
    carregarFuncionarios();
  }, []);

  function limparFormulario() {
    setTarefa({
      titulo: "",
      descricao: "",
      responsavel: "",
      prazo: "",
    });

    setModoEdicao(false);
    setIdEdicao(null);
  }

  async function salvarTarefa() {
    if (
      !tarefa.titulo ||
      !tarefa.descricao ||
      !tarefa.responsavel ||
      !tarefa.prazo
    ) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      if (modoEdicao) {
        await api.put(`/tarefas/tarefas/${idEdicao}`, {
          titulo: tarefa.titulo,
          descricao: tarefa.descricao,
          funcionario_id: tarefa.responsavel,
          prazo: tarefa.prazo,
        });

        alert("Tarefa editada com sucesso!");
      } else {
        await api.post("/tarefas/tarefas/criar", {
          titulo: tarefa.titulo,
          descricao: tarefa.descricao,
          funcionario_id: tarefa.responsavel,
          prazo: tarefa.prazo,
        });

        alert("Tarefa criada no banco!");
      }

      limparFormulario();
      carregarTarefas();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar tarefa no banco.");
    }
  }

  async function excluirTarefa(id) {
    try {
      await api.delete(`/tarefas/tarefas/${id}`);
      alert("Tarefa excluída com sucesso!");
      carregarTarefas();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir tarefa.");
    }
  }

  return (
    <Layout titulo="Gestão - Tarefas">
      <div className="containerTarefas">
        <div className="buscarContainer">
          <label>Buscar Tarefa</label>
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className="tituloSecao">
          {modoEdicao ? "Editar tarefa" : "Criar tarefa"}
        </div>

        <div className="formTarefa">
          <input
            className="inputTitulo"
            type="text"
            placeholder="Título da tarefa *"
            value={tarefa.titulo}
            onChange={(e) =>
              setTarefa({ ...tarefa, titulo: e.target.value })
            }
          />

          <input
            className="inputDescricao"
            type="text"
            placeholder="Descrição *"
            value={tarefa.descricao}
            onChange={(e) =>
              setTarefa({ ...tarefa, descricao: e.target.value })
            }
          />

          <select
            className="inputResponsavel"
            value={tarefa.responsavel}
            onChange={(e) =>
              setTarefa({ ...tarefa, responsavel: e.target.value })
            }
          >
            <option value="">Selecione um responsável</option>

            {funcionarios.map((funcionario) => (
              <option key={funcionario.id} value={funcionario.id}>
                {funcionario.nome}
              </option>
            ))}
          </select>

          <input
            className="inputPrazo"
            type="date"
            value={tarefa.prazo}
            onChange={(e) =>
              setTarefa({ ...tarefa, prazo: e.target.value })
            }
          />

          <button className="btnAdicionar" onClick={salvarTarefa}>
            {modoEdicao ? "Editar" : "Adicionar"}
          </button>

          {modoEdicao && (
            <button className="btnCancelar" onClick={limparFormulario}>
              Cancelar
            </button>
          )}
        </div>

        <div className="tabelaContainer">
          <div className="tabelaHeader">
            <div>Título</div>
            <div>Descrição</div>
            <div>Responsável</div>
            <div>Prazo</div>
            <div>Ações</div>
          </div>

          {tarefas
            .filter(
              (t) =>
                t.titulo.toLowerCase().includes(busca.toLowerCase()) ||
                t.descricao.toLowerCase().includes(busca.toLowerCase()) ||
                t.responsavel.toLowerCase().includes(busca.toLowerCase())
            )
            .map((tarefaAtual) => (
              <div className="tabelaLinha" key={tarefaAtual.id}>
                <div>{tarefaAtual.titulo}</div>
                <div>{tarefaAtual.descricao}</div>
                <div>{tarefaAtual.responsavel}</div>
                <div>{tarefaAtual.prazo}</div>

                <div className="acoes">
                  <button
                    className="btnAtualizar"
                    onClick={() => {
                      setModoEdicao(true);
                      setIdEdicao(tarefaAtual.id);
                      setTarefa({
                        titulo: tarefaAtual.titulo,
                        descricao: tarefaAtual.descricao,
                        responsavel: String(tarefaAtual.funcionario_id),
                        prazo: tarefaAtual.prazo,
                      });
                    }}
                  >
                    Atualizar
                  </button>

                  <button
                    className="btnExcluir"
                    onClick={() => excluirTarefa(tarefaAtual.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
}

export default GestaoTarefas;