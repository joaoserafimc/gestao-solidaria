export function validarDoador(dados) {
  if (!dados || typeof dados.nome !== "string" || !dados.nome.trim()) {
    return "Informe o nome do doador";
  }

  if (dados.nome.length > 150) {
    return "Nome muito longo";
  }

  if (
    typeof dados.email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email) ||
    dados.email.length > 100
  ) {
    return "Informe um e-mail válido";
  }

  if (
    dados.telefone != null &&
    (typeof dados.telefone !== "string" || dados.telefone.length > 20)
  ) {
    return "Telefone inválido";
  }

  return null;
}

export function validarDoacao(dados) {
  if (!dados || !Number.isInteger(dados.id_doador) || dados.id_doador <= 0) {
    return "Selecione um doador";
  }

  if (typeof dados.data_doacao !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dados.data_doacao)) {
    return "Informe uma data válida";
  }

  const data = new Date(dados.data_doacao);
  if (Number.isNaN(data.getTime()) || data.toISOString().slice(0, 10) !== dados.data_doacao) {
    return "Informe uma data válida";
  }

  if (!Array.isArray(dados.itens) || dados.itens.length === 0) {
    return "Informe pelo menos um item";
  }

  const ids = new Set();

  for (const item of dados.itens) {
    if (!item || !Number.isInteger(item.id_item) || item.id_item <= 0) {
      return "Item inválido";
    }

    if (!Number.isInteger(item.quantidade) || item.quantidade <= 0) {
      return "A quantidade deve ser maior que zero";
    }

    if (ids.has(item.id_item)) {
      return "Não repita o mesmo item na doação";
    }

    ids.add(item.id_item);
  }

  return null;
}

export function validarLogin(dados) {
  if (
    !dados ||
    typeof dados.email !== "string" ||
    typeof dados.senha !== "string" ||
    !dados.email.trim() ||
    !dados.senha
  ) {
    return "Informe e-mail e senha";
  }

  return null;
}
