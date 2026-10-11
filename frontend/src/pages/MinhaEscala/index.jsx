import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../services/api";
import { getUsuarioLogado } from "../../utils/session";
import { formatarDiaSemana } from "../../utils/formatters";
import "./index.css";

const diasSemana = [1, 2, 3, 4, 5, 6, 7];

function MinhaEscala() {
  const usuario = getUsuarioLogado();
  const [escala, setEscala] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    Promise.resolve()
      .then(() => {
        if (!usuario?.id) {
          throw new Error("Não foi possível identificar o usuário conectado.");
        }

        return api.get(`/escalas/escalas/${usuario.id}`);
      })
      .then(({ data }) => {
        if (ativo) {
          setEscala([...data].sort((a, b) => Number(a.dia_semana) - Number(b.dia_semana)));
        }
      })
      .catch((errorDaApi) => {
        if (ativo && errorDaApi.response?.status !== 404) {
          setErro(errorDaApi.response?.data?.error || "Não foi possível carregar sua escala.");
        }
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [usuario?.id]);

  const escalasPorDia = new Map(escala.map((item) => [Number(item.dia_semana), item]));

  return (
    <Layout title="Minha escala" ativo="Minha escala">
      <section className="minhaEscalaPage">
        <header className="minhaEscalaHeader">
          <p className="minhaEscalaEyebrow">HORÁRIOS DE TRABALHO</p>
          <h1>Minha escala</h1>
          <p>{usuario?.nome ? `Confira seus horários, ${usuario.nome}.` : "Confira seus horários da semana."}</p>
        </header>

        {erro && <p className="minhaEscalaErro" role="alert">{erro}</p>}

        {carregando ? (
          <p className="minhaEscalaEstado">Carregando sua escala...</p>
        ) : escala.length === 0 && !erro ? (
          <p className="minhaEscalaEstado">Ainda não há uma escala cadastrada para você.</p>
        ) : (
          <div className="minhaEscalaLista">
            {diasSemana.map((dia) => {
              const horario = escalasPorDia.get(dia);

              return (
                <article className={`minhaEscalaDia${horario?.folga ? " diaFolga" : ""}`} key={dia}>
                  <h2>{formatarDiaSemana(dia)}</h2>
                  {horario ? (
                    <p>{horario.folga ? "Folga" : `${horario.hora_inicio || "--:--"} – ${horario.hora_fim || "--:--"}`}</p>
                  ) : (
                    <p className="minhaEscalaSemHorario">Sem horário cadastrado</p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </Layout>
  );
}

export default MinhaEscala;
