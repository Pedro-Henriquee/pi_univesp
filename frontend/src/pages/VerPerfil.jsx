import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../services/api";

function VerPerfil() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const resposta = await api.get("/funcionarios");
        const encontrado = resposta.data.find(
          (f) => String(f.id) === String(id)
        );
        setUsuario(encontrado);
      } catch (error) {
        console.error(error);
      }
    }

    carregarUsuario();
  }, [id]);

  if (!usuario) return <p>Carregando...</p>;

  return (
    <Layout titulo="Perfil">
      <div style={{ padding: "20px" }}>
        <h2>Nome: {usuario.nome}</h2>
        <p>Cargo: {usuario.cargo}</p>
        <p>Usuário: {usuario.username}</p>
        <p>Admin: {usuario.is_admin ? "Sim" : "Não"}</p>
      </div>
    </Layout>
  );
}

export default VerPerfil;