import { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../services/api";
import "./index.css";

const diasSemana = [
  { label: "Segunda-feira", value: 1 },
  { label: "Terça-feira", value: 2 },
  { label: "Quarta-feira", value: 3 },
  { label: "Quinta-feira", value: 4 },
  { label: "Sexta-feira", value: 5 },
  { label: "Sábado", value: 6 },
  { label: "Domingo", value: 7 },
];

function criarSemanaVazia(funcionarioId = "") {
  return {
    funcionarioId: String(funcionarioId),
    dias: diasSemana.reduce((acc, dia) => {
      acc[dia.value] = {
        id: null,
        hora_inicio: "",
        hora_fim: "",
        folga: false,
      };
      return acc;
    }, {}),
  };
}

function Escalas() {
  const [modoFormulario, setModoFormulario] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);
  const [escalas, setEscalas] = useState([]);
  const [formulario, setFormulario] = useState(criarSemanaVazia());

  async function carregarDados() {
    const [respostaFuncionarios, respostaEscalas] = await Promise.all([
      api.get("/funcionarios"),
      api.get("/escalas/escalas"),
    ]);

    setFuncionarios(respostaFuncionarios.data);
    setEscalas(respostaEscalas.data);
  }

  useEffect(() => {
    let ativo = true;

    Promise.all([
      api.get("/funcionarios"),
      api.get("/escalas/escalas"),
    ]).then(([respostaFuncionarios, respostaEscalas]) => {
      if (!ativo) return;
      setFuncionarios(respostaFuncionarios.data);
      setEscalas(respostaEscalas.data);
    });

    return () => {
      ativo = false;
    };
  }, []);

  const escalasPorFuncionario = useMemo(() => {
    return funcionarios
      .map((funcionario) => ({
        funcionario,
        escalas: escalas
          .filter((escala) => Number(escala.funcionario_id) === Number(funcionario.id))
          .sort((a, b) => Number(a.dia_semana) - Number(b.dia_semana)),
      }))
      .filter((grupo) => grupo.escalas.length > 0);
  }, [funcionarios, escalas]);

  function abrirCadastro() {
    setFormulario(criarSemanaVazia());
    setModoFormulario(true);
  }

  function abrirEdicao(funcionarioId) {
    const semana = criarSemanaVazia(funcionarioId);

    escalas
      .filter((escala) => Number(escala.funcionario_id) === Number(funcionarioId))
      .forEach((escala) => {
        semana.dias[Number(escala.dia_semana)] = {
          id: escala.id,
          hora_inicio: escala.hora_inicio || "",
          hora_fim: escala.hora_fim || "",
          folga: !!escala.folga,
        };
      });

    setFormulario(semana);
    setModoFormulario(true);
  }

  function alterarFuncionario(funcionarioId) {
    const funcionarioJaTemEscala = escalas.some(
      (escala) => Number(escala.funcionario_id) === Number(funcionarioId)
    );

    if (funcionarioJaTemEscala) {
      abrirEdicao(funcionarioId);
      return;
    }

    setFormulario(criarSemanaVazia(funcionarioId));
  }

  function alterarDia(dia, campo, valor) {
    setFormulario((atual) => ({
      ...atual,
      dias: {
        ...atual.dias,
        [dia]: {
          ...atual.dias[dia],
          [campo]: valor,
        },
      },
    }));
  }

  async function salvarSemana() {
    if (!formulario.funcionarioId) {
      alert("Selecione um funcionário.");
      return;
    }

    try {
      const requisicoes = diasSemana.map((dia) => {
        const dadosDia = formulario.dias[dia.value];
        const payload = {
          funcionario_id: Number(formulario.funcionarioId),
          dia_semana: dia.value,
          hora_inicio: dadosDia.folga ? null : dadosDia.hora_inicio || null,
          hora_fim: dadosDia.folga ? null : dadosDia.hora_fim || null,
          folga: dadosDia.folga,
        };

        if (dadosDia.id) {
          return api.put(`/escalas/escalas/${dadosDia.id}`, payload);
        }

        return api.post("/escalas/escalas/criar", payload);
      });

      await Promise.all(requisicoes);
      await carregarDados();
      setModoFormulario(false);
      setFormulario(criarSemanaVazia());
      alert("Escala salva com sucesso!");
    } catch (err) {
      alert("Erro ao salvar escala: " + (err.response?.data?.error || err.message));
    }
  }

  async function excluirSemana(funcionarioId) {
    const confirmar = window.confirm("Tem certeza que deseja excluir a escala deste funcionário?");
    if (!confirmar) return;

    try {
      const escalasFuncionario = escalas.filter(
        (escala) => Number(escala.funcionario_id) === Number(funcionarioId)
      );
      await Promise.all(
        escalasFuncionario.map((escala) => api.delete(`/escalas/escalas/${escala.id}`))
      );
      await carregarDados();
      alert("Escala excluída com sucesso!");
    } catch (err) {
      alert("Erro ao excluir escala: " + (err.response?.data?.error || err.message));
    }
  }

  function renderizarFormulario() {
    return (
      <Layout title="Cadastro de Escala" ativo="Gestão de Escalas">
        <div className="escalaCadastroContainer">
          <select
            className="escalaSelect"
            value={formulario.funcionarioId}
            onChange={(event) => alterarFuncionario(event.target.value)}
          >
            <option value="">Funcionário</option>
            {funcionarios.map((funcionario) => (
              <option key={funcionario.id} value={funcionario.id}>
                {funcionario.nome} ({funcionario.cargo})
              </option>
            ))}
          </select>

          <div className="escalaFormulario">
            {diasSemana.map((dia) => {
              const dadosDia = formulario.dias[dia.value];

              return (
                <div className="escalaDiaForm" key={dia.value}>
                  <label>{dia.label}</label>

                  <input
                    type="time"
                    value={dadosDia.hora_inicio}
                    disabled={dadosDia.folga}
                    onChange={(event) =>
                      alterarDia(dia.value, "hora_inicio", event.target.value)
                    }
                  />

                  <input
                    type="time"
                    value={dadosDia.hora_fim}
                    disabled={dadosDia.folga}
                    onChange={(event) =>
                      alterarDia(dia.value, "hora_fim", event.target.value)
                    }
                  />

                  <label className="folgaCheck">
                    <input
                      type="checkbox"
                      checked={dadosDia.folga}
                      onChange={(event) =>
                        alterarDia(dia.value, "folga", event.target.checked)
                      }
                    />
                    Folga
                  </label>
                </div>
              );
            })}
          </div>

          <div className="escalaFormularioAcoes">
            <button className="btnAdicionar" onClick={salvarSemana}>
              Salvar escala
            </button>
            <button className="btnCancelar" onClick={() => setModoFormulario(false)}>
              Cancelar
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (modoFormulario) {
    return renderizarFormulario();
  }

  return (
    <Layout title="Gestão - Escalas" ativo="Gestão de Escalas">
      <div className="escalasContainer">
        <div className="escalaTituloLinha">
          <h1>Escalas Mensais</h1>
          <button className="btnAdicionar" onClick={abrirCadastro}>
            Adicionar nova escala
          </button>
        </div>

        {escalasPorFuncionario.length === 0 ? (
          <div className="escalaVazia">Nenhuma escala cadastrada.</div>
        ) : (
          escalasPorFuncionario.map(({ funcionario, escalas: escalasFuncionario }) => (
            <section className="escalaCard" key={funcionario.id}>
              <div className="escalaCardTopo">
                <h2>
                  Funcionário(a): {funcionario.nome} ({funcionario.cargo})
                </h2>

                <div className="escalaCardAcoes">
                  <button className="btnEditar" onClick={() => abrirEdicao(funcionario.id)}>
                    Editar
                  </button>
                  <button className="btnExcluir" onClick={() => excluirSemana(funcionario.id)}>
                    Excluir
                  </button>
                </div>
              </div>

              <table className="escalaTabela">
                <thead>
                  <tr>
                    <th>Dia da semana</th>
                    <th>Início</th>
                    <th>Fim</th>
                    <th>Folga</th>
                  </tr>
                </thead>
                <tbody>
                  {diasSemana.map((dia) => {
                    const escala = escalasFuncionario.find(
                      (item) => Number(item.dia_semana) === dia.value
                    );
                    const folga = !!escala?.folga;

                    return (
                      <tr key={dia.value}>
                        <td>{dia.label}</td>
                        <td>{folga ? "-" : escala?.hora_inicio || "-"}</td>
                        <td>{folga ? "-" : escala?.hora_fim || "-"}</td>
                        <td>{folga ? "Sim" : "Não"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          ))
        )}
      </div>
    </Layout>
  );
}

export default Escalas;
