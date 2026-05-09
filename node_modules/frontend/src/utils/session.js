const STORAGE_KEY = "usuarioLogado";

export function getUsuarioLogado() {
  try {
    const usuario = localStorage.getItem(STORAGE_KEY);
    return usuario ? JSON.parse(usuario) : null;
  } catch {
    return null;
  }
}

export function setUsuarioLogado(usuario) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
}

export function isAdmin(usuario = getUsuarioLogado()) {
  return !usuario || usuario.is_admin === true;
}
