import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import "./VisaoGeral.css";

function VisaoGeralUsuario() {
  const usuarioLogadoId = 32;

  const [usuario, setUsuario] = useState({
    nome: "Usuário",
    tipo: "usuario",
  });

  const [mostrarTudo, setMostrarTudo] = useState(false);
  const [escala, setEscala] = useState([]);
  const [tarefas, setTarefas] = useState([]);

  async function carregarUsuario() {
    try {
      const resposta = await api.get("/funcionarios");
      const encontrado = resposta.data.find(
        (funcionario) => funcionario.id === usuarioLogadoId
      );

      if (encontrado) {
        setUsuario({
          nome: encontrado.nome,
          tipo: "usuario",
        });
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar usuário.");
    }
  }

  async function carregarDadosUsuario() {
    try {
      const respostaTarefas = await api.get("/tarefas/tarefas");

      const tarefasDoUsuario = respostaTarefas.data
        .filter((tarefa) => tarefa.funcionario_id === usuarioLogadoId)
        .map((tarefa) => ({
          titulo: tarefa.titulo,
          descricao: tarefa.descricao,
          prazo: tarefa.prazo ? tarefa.prazo.substring(0, 10) : "",
        }));

      setTarefas(tarefasDoUsuario);

      try {
        const respostaEscala = await api.get(
          `/escalas/escalas/${usuarioLogadoId}`
        );

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
      alert("Erro ao carregar dados do usuário.");
    }
  }

  useEffect(() => {
    carregarUsuario();
    carregarDadosUsuario();
  }, []);

  const escalaVisivel = mostrarTudo ? escala : escala.slice(0, 3);

  return (
    <Layout titulo="Visão Geral" ativo="Visão geral" usuario={usuario}>
      <div className="visaoContainer">
        <h2 className="secaoTitulo">Escala de trabalho</h2>

        <div className="escalaLista">
          {escalaVisivel.length > 0 ? (
            escalaVisivel.map((item) => (
              <div className="linhaEscala" key={item.dia}>
                <label>{item.dia}</label>

                <input value={item.entrada || ""} readOnly />
                <input value={item.saida || ""} readOnly />

                <div className="folgaBox">
                  <input
                    type="checkbox"
                    checked={!!item.folga}
                    readOnly
                    disabled
                  />
                  <span>Folga</span>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhuma escala cadastrada para este usuário.</p>
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
      </div>
    </Layout>
  );
}

export default VisaoGeralUsuario;