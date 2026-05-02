import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import "./VisaoGeral.css";

function VisaoGeral() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [funcionarioId, setFuncionarioId] = useState("");
  const [escala, setEscala] = useState([]);
  const [tarefas, setTarefas] = useState([]);
  const [mostrarTudo, setMostrarTudo] = useState(false);

  async function carregarFuncionarios() {
    try {
      const resposta = await api.get("/funcionarios");
      setFuncionarios(resposta.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar funcionários.");
    }
  }

  async function carregarDadosFuncionario(id) {
    try {
      const respostaTarefas = await api.get("/tarefas/tarefas");

      const tarefasDoFuncionario = respostaTarefas.data
        .filter((tarefa) => String(tarefa.funcionario_id) === String(id))
        .map((tarefa) => ({
          titulo: tarefa.titulo,
          descricao: tarefa.descricao,
          prazo: tarefa.prazo ? tarefa.prazo.substring(0, 10) : "",
        }));

      setTarefas(tarefasDoFuncionario);

      try {
        const respostaEscala = await api.get(`/escalas/escalas/${id}`);

        const escalaFormatada = respostaEscala.data.map((item) => ({
          dia: item.dia_semana,
          entrada: item.folga ? "Folga" : item.hora_inicio,
          saida: item.folga ? "Folga" : item.hora_fim,
          folga: item.folga,
        }));

        setEscala(escalaFormatada);
      } catch {
        setEscala([]);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar dados do funcionário.");
    }
  }

  function trocarFuncionario(id) {
    setFuncionarioId(id);
    setMostrarTudo(false);

    if (id) {
      carregarDadosFuncionario(id);
    } else {
      setEscala([]);
      setTarefas([]);
    }
  }

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const escalaVisivel = mostrarTudo ? escala : escala.slice(0, 3);

  return (
    <Layout titulo="Visão Geral" ativo="Visão geral">
      <div className="visaoContainer">
        <select
          className="selectFuncionario"
          value={funcionarioId}
          onChange={(e) => trocarFuncionario(e.target.value)}
        >
          <option value="">Selecione um funcionário</option>

          {funcionarios.map((funcionario) => (
            <option key={funcionario.id} value={funcionario.id}>
              {funcionario.nome.toUpperCase()} ({funcionario.cargo.toUpperCase()})
            </option>
          ))}
        </select>

        {funcionarioId && (
          <>
            <h2 className="secaoTitulo">Escala de trabalho</h2>

            <div className="escalaLista">
              {escalaVisivel.length > 0 ? (
                escalaVisivel.map((item) => (
                  <div className="linhaEscala" key={item.dia}>
                    <label>{item.dia}</label>
                    <input value={item.entrada || ""} readOnly />
                    <input value={item.saida || ""} readOnly />

                    <div className="folgaBox">
                      <input type="checkbox" checked={!!item.folga} readOnly />
                      <span>Folga</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>Nenhuma escala cadastrada para este funcionário.</p>
              )}
            </div>

            {escala.length > 3 && (
              <button
                className="verMaisBtn"
                onClick={() => setMostrarTudo(!mostrarTudo)}
              >
                {mostrarTudo ? "Ver menos" : "Ver mais"}
              </button>
            )}

            <h2 className="secaoTitulo tarefasTitulo">Tarefas</h2>

            <div className="tabelaVisao">
              <div className="tabelaVisaoHeader">
                <div>Título</div>
                <div>Descrição</div>
                <div>Prazo</div>
              </div>

              {tarefas.length > 0 ? (
                tarefas.map((tarefa, index) => (
                  <div className="tabelaVisaoLinha" key={index}>
                    <div>{tarefa.titulo}</div>
                    <div>{tarefa.descricao}</div>
                    <div>{tarefa.prazo}</div>
                  </div>
                ))
              ) : (
                <div className="tabelaVisaoLinha">
                  <div>Nenhuma tarefa</div>
                  <div>Sem tarefas cadastradas</div>
                  <div>-</div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default VisaoGeral;