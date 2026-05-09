import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import api from "../../services/api";
import avatar from "../../assets/avatar.png";
import { getUsuarioLogado, setUsuarioLogado } from "../../utils/session";
import "./index.css";

function VerPerfil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const usuarioLogado = getUsuarioLogado();
  const idUsuarioLogado = usuarioLogado?.id;
  const [usuario, setUsuario] = useState(null);
  const [formulario, setFormulario] = useState({
    nome: "",
    username: "",
    cargo: "",
    senha: "",
  });

  useEffect(() => {
    let ativo = true;

    api.get("/funcionarios").then((resposta) => {
      if (!ativo) return;

      const idPerfil = id || idUsuarioLogado;
      const encontrado = resposta.data.find(
        (funcionario) => String(funcionario.id) === String(idPerfil)
      );
      const usuarioAtual = encontrado || getUsuarioLogado();

      setUsuario(usuarioAtual);
      setFormulario({
        nome: usuarioAtual?.nome || "",
        username: usuarioAtual?.username || "",
        cargo: usuarioAtual?.cargo || "",
        senha: "",
      });
    });

    return () => {
      ativo = false;
    };
  }, [id, idUsuarioLogado]);

  async function salvarPerfil() {
    if (!usuario?.id) return;

    try {
      const dadosPerfil = {
        nome: formulario.nome,
        username: formulario.username || null,
        cargo: formulario.cargo,
        is_admin: usuario.is_admin,
      };

      if (formulario.senha) {
        dadosPerfil.senha = formulario.senha;
      }

      const { data } = await api.put(`/funcionarios/${usuario.id}`, dadosPerfil);

      const usuarioAtualizado = data || { ...usuario, ...formulario };
      setUsuario(usuarioAtualizado);

      if (String(usuarioAtualizado.id) === String(idUsuarioLogado)) {
        setUsuarioLogado(usuarioAtualizado);
      }

      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      alert("Erro ao salvar perfil: " + (error.response?.data?.error || error.message));
    }
  }

  async function excluirPerfil() {
    if (!usuario?.id) return;

    const confirmar = window.confirm("Tem certeza que deseja excluir este perfil?");
    if (!confirmar) return;

    try {
      await api.delete(`/funcionarios/${usuario.id}`);
      alert("Perfil excluído com sucesso!");
      navigate("/funcionarios");
    } catch (error) {
      alert("Erro ao excluir perfil: " + (error.response?.data?.error || error.message));
    }
  }

  if (!usuario) {
    return (
      <div className="perfilPage">
        <Header title="Ver perfil" previousScreen={() => navigate(-1)} />
        <main className="perfilMain">
          <h1>Perfil não encontrado</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="perfilPage">
      <Header title="Ver perfil" previousScreen={() => navigate(-1)} />

      <main className="perfilMain">
        <section className="perfilForm">
          <h1>Ver perfil</h1>
          <div className="linhaDivisoria" />

          <label>Nome</label>
          <input
            value={formulario.nome}
            onChange={(event) =>
              setFormulario({ ...formulario, nome: event.target.value })
            }
          />

          <label>Usuário</label>
          <input
            value={formulario.username}
            onChange={(event) =>
              setFormulario({ ...formulario, username: event.target.value })
            }
          />

          <label>Cargo</label>
          <input
            value={formulario.cargo}
            onChange={(event) =>
              setFormulario({ ...formulario, cargo: event.target.value })
            }
          />

          <label>Senha</label>
          <input
            type="password"
            value={formulario.senha}
            placeholder="Nova senha"
            onChange={(event) =>
              setFormulario({ ...formulario, senha: event.target.value })
            }
          />
        </section>

        <aside className="perfilCard">
          <div className="perfilAvatar">
            <img src={avatar} alt="Avatar" />
          </div>

          <h2>{formulario.nome || usuario.nome}</h2>

          <div className="perfilAcoes">
            <button className="btnSalvar" onClick={salvarPerfil}>
              SALVAR
            </button>
            <button className="btnLixeira" onClick={excluirPerfil} aria-label="Excluir perfil">
              X
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default VerPerfil;
