const diasSemana = {
  1: "Segunda-feira",
  2: "Terça-feira",
  3: "Quarta-feira",
  4: "Quinta-feira",
  5: "Sexta-feira",
  6: "Sábado",
  7: "Domingo",
};

export function formatarDiaSemana(valor) {
  return diasSemana[Number(valor)] || valor || "-";
}

export function formatarDataBR(valor) {
  if (!valor) return "";

  const [ano, mes, dia] = String(valor).substring(0, 10).split("-");

  if (!ano || !mes || !dia) return valor;

  return `${dia}/${mes}/${ano}`;
}
