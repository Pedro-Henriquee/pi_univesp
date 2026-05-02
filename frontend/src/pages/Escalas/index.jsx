import { useEffect, useState, useRef } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import api from "../../services/api";
import "./index.css";

function Escalas() {
  const [escalas, setEscalas] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [alteracoesSemana, setAlteracoesSemana] = useState({});

  const inputFuncionario = useRef(null);

  const diasSemana = [
    { label: "Segunda-feira", value: 1 },
    { label: "Terça-feira", value: 2 },
    { label: "Quarta-feira", value: 3 },
    { label: "Quinta-feira", value: 4 },
    { label: "Sexta-feira", value: 5 },
    { label: "Sábado", value: 6 },
    { label: "Domingo", value: 7 }
  ];

  async function carregarEscalas() {
    const { data } = await api.get("/escalas/escalas");
    setEscalas(data);
  }

  async function carregarFuncionarios() {
    const { data } = await api.get("/funcionarios");
    setFuncionarios(data);
  }

  async function criarEscalaSemanal(funcionarioId) {
    try {
      const promises = [];
      for (let dia = 1; dia <= 7; dia++) {
        promises.push(
          api.post("/escalas/escalas/criar", {
            funcionario_id: funcionarioId,
            dia_semana: dia,
            hora_inicio: null,
            hora_fim: null,
            folga: false
          })
        );
      }
      await Promise.all(promises);
      alert("Escala semanal criada com sucesso!");
      await carregarEscalas();
    } catch (err) {
      alert("Erro ao criar escala semanal: " + (err.response?.data?.error || err.message));
    }
  }

  async function atualizarEscala(escalaAtualizada) {
    try {
      await api.put(`/escalas/escalas/${escalaAtualizada.id}`, escalaAtualizada);
      carregarEscalas();
    } catch (err) {
      alert("Erro ao atualizar escala: " + (err.response?.data?.error || err.message));
    }
  }

  async function excluirEscala(id) {
    const confirmar = window.confirm("Tem certeza que deseja excluir esta escala?");
    if (!confirmar) return;

    try {
      await api.delete(`/escalas/escalas/${id}`);
      carregarEscalas();
    } catch (err) {
      alert("Erro ao excluir escala: " + (err.response?.data?.error || err.message));
    }
  }

  async function excluirSemana(funcionarioId) {
    const confirmar = window.confirm("Tem certeza que deseja excluir TODAS as escalas deste funcionário?");
    if (!confirmar) return;

    try {
      const escalasFuncionario = escalas.filter(e => e.funcionario_id === funcionarioId);
      const promises = escalasFuncionario.map(e => api.delete(`/escalas/escalas/${e.id}`));
      await Promise.all(promises);
      alert("Todas as escalas da semana foram excluídas!");
      carregarEscalas();
    } catch (err) {
      alert("Erro ao excluir escalas da semana: " + (err.response?.data?.error || err.message));
    }
  }

  function registrarAlteracao(dia, campo, valor) {
    setAlteracoesSemana(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        [campo]: valor
      }
    }));
  }

  async function salvarSemana(funcionarioId) {
    try {
      const promises = diasSemana.map(dia => {
        const escala = escalas.find(
          e => e.funcionario_id === funcionarioId && e.dia_semana === dia.value
        );
        const alteracao = alteracoesSemana[dia.value];
        if (escala && alteracao) {
          return api.put(`/escalas/escalas/${escala.id}`, {
            ...escala,
            ...alteracao
          });
        }
        return null;
      }).filter(Boolean);

      await Promise.all(promises);
      alert("Semana salva com sucesso!");
      carregarEscalas();
      setAlteracoesSemana({});
    } catch (err) {
      alert("Erro ao salvar semana: " + (err.response?.data?.error || err.message));
    }
  }

  useEffect(() => {
    carregarFuncionarios();
    carregarEscalas();
  }, []);

  const funcionarioSelecionado = parseInt(inputFuncionario.current?.value, 10);

  return (
    <div className="escalasPage">
      <Header 
        title="Gestão - Escalas"
        previousScreen={() => navigate(-1)}
      />
      
      <div className="escalasContent">
        <Sidebar ativo="Gestão de Escalas" />

        <div className="escalasContainer">
          <h1 className="titleSection">Gestão de Escalas</h1>

          <div className="inputsContainer">
            <select 
              ref={inputFuncionario} 
              className="inputForm"
              onChange={carregarEscalas}
            >
              <option value="">Selecione um funcionário</option>
              {funcionarios.map(f => (
                <option key={f.id} value={f.id}>
                  {f.nome} ({f.cargo})
                </option>
              ))}
            </select>

            {funcionarioSelecionado &&
              !escalas.some(e => e.funcionario_id === funcionarioSelecionado) && (
                <button 
                  className="btnAdicionar" 
                  onClick={() => criarEscalaSemanal(funcionarioSelecionado)}
                >
                  Criar Escala Semanal
                </button>
            )}

            {funcionarioSelecionado && (
              <>
                <button 
                  className="btnSalvarSemana"
                  onClick={() => salvarSemana(funcionarioSelecionado)}
                >
                  Salvar todos os horários
                </button>
                <button 
                  className="btnExcluirSemana"
                  onClick={() => excluirSemana(funcionarioSelecionado)}
                >
                  Excluir todas as escalas da semana
                </button>
              </>
            )}
          </div>

          <table className="tabela">
            <thead className="tabelaHeader">
              <tr>
                <th className="th">ID</th>
                <th className="th">Funcionário</th>
                <th className="th">Dia</th>
                <th className="th">Início</th>
                <th className="th">Fim</th>
                <th className="th">Folga</th>
                <th className="th">Ações</th>
              </tr>
            </thead>
            <tbody>
              {funcionarioSelecionado &&
                diasSemana.map(dia => {
                  const escala = escalas.find(
                    e => e.funcionario_id === funcionarioSelecionado && e.dia_semana === dia.value
                  );

                  return (
                    <tr 
                      key={dia.value} 
                      className={`tabelaLinha ${escala?.folga ? "linhaFolga" : ""}`}
                    >
                      <td className="td">{escala?.id || "-"}</td>
                      <td className="td">
                        {funcionarios.find(f => f.id === funcionarioSelecionado)?.nome || "N/A"}
                      </td>
                      <td className="td">{dia.label}</td>
                      <td className="td">
                        <input
                          type="time"
                          defaultValue={escala?.hora_inicio || ""}
                          onChange={(ev) => registrarAlteracao(dia.value, "hora_inicio", ev.target.value || null)}
                          disabled={escala?.folga}
                        />
                      </td>
                      <td className="td">
                        <input
                          type="time"
                          defaultValue={escala?.hora_fim || ""}
                          onChange={(ev) => registrarAlteracao(dia.value, "hora_fim", ev.target.value || null)}
                          disabled={escala?.folga}
                        />
                      </td>
                      <td className="td">
                        {escala ? (
                          <>
                            <span className="folgaIcon">{escala.folga ? "❌" : "✅"}</span>
                            <input
                              type="checkbox"
                              defaultChecked={escala.folga}
                              onChange={(ev) => registrarAlteracao(dia.value, "folga", ev.target.checked)}
                            />
                          </>
                        ) : "-"}
                      </td>
                      <td className="td">
                        {escala ? (
                          <button 
                            className="btnExcluir"
                            onClick={() => excluirEscala(escala.id)}
                          >
                            Excluir
                          </button>
                        ) : "-"}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Escalas;
