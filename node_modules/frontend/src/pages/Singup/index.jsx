import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import userAvatar from "../../assets/avatar.png";
import api from "../../services/api";
import "./index.css";

function Signup() {
  const navigate = useNavigate();
  const inputNome = useRef(null);
  const inputCargo = useRef(null);
  const inputUser = useRef(null);
  const inputSenha = useRef(null);
  const inputConfirmarSenha = useRef(null);

  const [carregando, setCarregando] = useState(false);

  function validateFields() {
    if (
      !inputNome.current.value ||
      !inputCargo.current.value ||
      !inputUser.current.value ||
      !inputSenha.current.value ||
      !inputConfirmarSenha.current.value
    ) {
      alert("Preencha todos os campos!");
      return;
    }

    if (inputSenha.current.value !== inputConfirmarSenha.current.value) {
      alert("As senhas não coincidem!");
      return;
    }
  }

  createUser().then(() => {
    navigate("/login");
  });

  async function createUser() {
    try {
      setCarregando(true);

      await api.post("/auth/cadastro", {
        nome: inputNome.current.value,
        cargo: inputCargo.current.value,
        username: inputUser.current.value,
        senha: inputSenha.current.value,
      });

      inputNome.current.value = "";
      inputCargo.current.value = "";
      inputUser.current.value = "";
      inputSenha.current.value = "";
      inputConfirmarSenha.current.value = "";

      alert("Usuário criado com sucesso!");
    } catch (error) {
      alert("Erro ao criar usuário: " + error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="pageHome">
      {carregando && (
        <div className="loadingOverlay">
          <div className="loadingBox">
            <div className="loadingSpinner" />
            <span>Aguarde...</span>
          </div>
        </div>
      )}

      <Header
        title="Cadastro"
        previousScreen={window.history.back}
        nextScreen={{ texto: "Login", rota: "/login" }}
      />

      <div className="container">
        <div className="containerCard">
          <h2 id="containerTitle">Seja bem-vindo!</h2>

          <div id="userAvatar">
            <img src={userAvatar} alt="Avatar" />
          </div>

          <p id="containerSubtitle">
            Informe seu nome, cargo <br />
            usuário e senha para se cadastrar:
          </p>

          <input
            className="largeInput"
            type="text"
            name="nome"
            placeholder="Nome"
            ref={inputNome}
            disabled={carregando}
          />

          <div className="inputsLine">
            <input
              className="halfInput"
              type="text"
              name="cargo"
              placeholder="Cargo"
              ref={inputCargo}
              disabled={carregando}
            />
            <input
              className="halfInput"
              type="text"
              name="username"
              placeholder="Usuário (ex.: user123)"
              ref={inputUser}
              disabled={carregando}
            />
          </div>

          <div className="inputsLine">
            <input
              className="halfInput"
              type="password"
              name="senha"
              placeholder="Senha"
              ref={inputSenha}
              disabled={carregando}
            />
            <input
              className="halfInput"
              type="password"
              name="confirmarSenha"
              placeholder="Confirmar senha"
              ref={inputConfirmarSenha}
              disabled={carregando}
            />
          </div>

          <button
            className="containerButton"
            onClick={validateFields}
            disabled={carregando}
          >
            {carregando ? "AGUARDE..." : "CADASTRAR"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;