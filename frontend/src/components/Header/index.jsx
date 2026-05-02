import { useNavigate } from "react-router-dom";
import avatarUser from "../../assets/avatar.png";
import "./index.css";

function Header({ title, previousScreen, nextScreen, usuario = null }) {
  const navigate = useNavigate();

  return (
    <div id="headerBar">
      <button id="btnPrevious" onClick={() => navigate(previousScreen)}>
        &#8592;
      </button>

      <span id="headerTitle">{title}</span>

      {nextScreen && (
        <button id="btnNext" onClick={() => navigate(nextScreen.rota)}>
          {nextScreen.texto} &#8594;
        </button>
      )}

      {usuario && (
        <div className="usuarioContainer">
          <div className="usuarioText">
            <span id="usuarioNome">{usuario.nome}</span>
            <button
  id="btnAction"
  onClick={() => navigate(`/perfil/${usuario.id || 32}`)}
>
  Ver perfil
</button>
          </div>

          <div id="avatarUsuario">
            <img src={avatarUser} alt="Avatar" />
          </div>
        </div>
      )}
    </div >
  );
}

export default Header;

