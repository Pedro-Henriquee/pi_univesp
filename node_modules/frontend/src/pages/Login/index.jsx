import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import userAvatar from "../../assets/avatar.png";
import api from "../../services/api";
import { setUsuarioLogado } from "../../utils/session";
import "./index.css";

function Login() {
  const navigate = useNavigate();
  const inputUsuario = useRef(null);
  const inputSenha = useRef(null);

  const [carregando, setCarregando] = useState(false);

  function validateFields() {
    if (!inputUsuario.current.value || !inputSenha.current.value) {
      alert("Preencha todos os campos!");
      return;
    }

    getUsuario();
  }

  async function getUsuario() {
    try {
      setCarregando(true);

      await api.post("/auth/login", {
        username: inputUsuario.current.value,
        senha: inputSenha.current.value,
      });

      const { data: funcionarios } = await api.get("/funcionarios");

      const usuarioLogado = funcionarios.find(
        (funcionario) => funcionario.username === inputUsuario.current.value
      );

      if (usuarioLogado) {
        setUsuarioLogado(usuarioLogado);
      }

      inputUsuario.current.value = "";
      inputSenha.current.value = "";

      navigate("/visao-geral");
    } catch (error) {
      alert("Usuário não encontrado!");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="pageLogin">
      {carregando && (
        <div className="loadingOverlay">
          <div className="loadingBox">
            <div className="loadingSpinner" />
            <span>Aguarde...</span>
          </div>
        </div>
      )}

      <Header title="Login" previousScreen={"/"} />

      <div className="content">
        <div className="card">
          <h2 id="titulo">Bem-vindo(a)!</h2>

          <div className="avatar">
            <img src={userAvatar} alt="Avatar" />
          </div>

          <p id="subtitulo">
            Informe seu usuário e senha
            <br />
            para acessar:
          </p>

          <input
            className="input"
            type="text"
            name="username"
            placeholder="Usuário"
            ref={inputUsuario}
            disabled={carregando}
          />

          <input
            className="input"
            type="password"
            name="senha"
            placeholder="Senha"
            ref={inputSenha}
            disabled={carregando}
          />

          <div className="botoes">
            <button
              id="btnEntrar"
              onClick={validateFields}
              disabled={carregando}
            >
              {carregando ? "AGUARDE..." : "ENTRAR"}
            </button>
            <button
              id="btnCadastrar"
              onClick={() => navigate("/signup")}
              disabled={carregando}
            >
              CADASTRAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;