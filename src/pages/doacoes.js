import { listarDoadores, listarItens, listarDoacoes, registrarDoacao } from "../api.js";

import { el, mostrarMensagem, esconderMensagem, estado, formatarData, hoje } from "../ui.js";

// TELA DE REGISTRO DE DOACOES

export async function telaNovaDoacao(raiz) {
  raiz.innerHTML = `
    <h1>Registrar doação</h1>
    <p>Registre os produtos recebidos pela ONG.</p>

    <section class="cartao">
      <form id="form-doacao">

        <label for="doador">Doador</label>
        <select id="doador" required>
          <option value="">Carregando...</option>
        </select>

        <label for="data">Data da doação</label>
        <input id="data" type="date" required />

        <label for="observacao">Observações</label>
        <textarea id="observacao" rows="3"></textarea>

        <h2>Itens da doação</h2>

        <div id="itens"></div>

        <button type="button" id="adicionar"
          class="secundario" disabled>
          + Adicionar item
        </button>

        <div id="mensagem" class="mensagem"
          role="status" hidden></div>

        <button type="submit" id="salvar" disabled>
          Registrar doação
        </button>

      </form>
    </section>
  `;

  const form = raiz.querySelector("#form-doacao");
  const doador = raiz.querySelector("#doador");
  const data = raiz.querySelector("#data");
  const observacao = raiz.querySelector("#observacao");
  const container = raiz.querySelector("#itens");
  const mensagem = raiz.querySelector("#mensagem");
  const adicionar = raiz.querySelector("#adicionar");
  const salvar = raiz.querySelector("#salvar");

  data.value = hoje();

  let produtos = [];

  function adicionarItem() {
    const seletor = el("select", {
      class: "produto",
      required: "",
      "aria-label": "Produto",
    });

    seletor.append(el("option", { value: "" }, "Selecione um produto"));

    for (const produto of produtos) {
      seletor.append(
        el("option", { value: produto.id_item }, `${produto.nome} - ${produto.categoria}`),
      );
    }

    const quantidade = el("input", {
      class: "quantidade",
      type: "number",
      min: "1",
      step: "1",
      value: "1",
      required: "",
      "aria-label": "Quantidade",
    });

    const linha = el("div", { class: "linha-item" }, seletor, quantidade);

    const remover = el(
      "button",
      {
        type: "button",
        class: "perigo",
        onclick: () => {
          if (container.children.length > 1) {
            linha.remove();
          } else {
            mostrarMensagem(mensagem, "A doação precisa ter pelo menos um item.", "erro");
          }
        },
      },
      "Remover",
    );

    linha.append(remover);
    container.append(linha);
  }

  try {
    const [doadores, itens] = await Promise.all([listarDoadores(), listarItens()]);

    produtos = itens;

    doador.replaceChildren(el("option", { value: "" }, "Selecione um doador"));

    for (const pessoa of doadores) {
      doador.append(el("option", { value: pessoa.id_doador }, pessoa.nome));
    }

    if (!doadores.length || !produtos.length) {
      mostrarMensagem(mensagem, "Cadastre doadores e itens antes de registrar uma doação.", "erro");
      return;
    }

    adicionarItem();
    adicionar.disabled = false;
    salvar.disabled = false;
  } catch (erro) {
    mostrarMensagem(mensagem, erro.message, "erro");
    return;
  }

  adicionar.addEventListener("click", adicionarItem);

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    esconderMensagem(mensagem);

    const itens = Array.from(container.querySelectorAll(".linha-item")).map((linha) => ({
      id_item: Number(linha.querySelector(".produto").value),
      quantidade: Number(linha.querySelector(".quantidade").value),
    }));

    const dados = {
      id_doador: Number(doador.value),
      data_doacao: data.value,
      observacao: observacao.value.trim(),
      itens,
    };

    salvar.disabled = true;
    adicionar.disabled = true;

    try {
      await registrarDoacao(dados);

      form.reset();
      data.value = hoje();
      container.replaceChildren();
      adicionarItem();

      mostrarMensagem(mensagem, "Doação registrada com sucesso!");
    } catch (erro) {
      mostrarMensagem(mensagem, erro.message, "erro");
    } finally {
      salvar.disabled = false;
      adicionar.disabled = false;
    }
  });
}

// TELA DE LISTAGEM DE DOACOES

export async function telaDoacoes(raiz) {
  raiz.innerHTML = `
    <h1>Doações registradas</h1>
    <p>Consulte o histórico de doações recebidas.</p>

    <a class="botao" href="#/doacoes/nova">
      + Registrar nova doação
    </a>

    <ul id="lista-doacoes" class="lista"></ul>
  `;

  const lista = raiz.querySelector("#lista-doacoes");

  lista.replaceChildren(estado("Carregando doações..."));

  try {
    const doacoes = await listarDoacoes();

    if (!doacoes.length) {
      lista.replaceChildren(estado("Nenhuma doação registrada."));
      return;
    }

    const registros = doacoes.map((doacao) => {
      const itens = el(
        "ul",
        { class: "lista-itens" },

        ...doacao.itens.map((item) =>
          el("li", {}, `${item.nome} — Quantidade: ${item.quantidade}`),
        ),
      );

      return el(
        "li",
        { class: "cartao doacao" },

        el("h2", {}, doacao.doador),

        el("p", {}, `Doação nº ${doacao.id_doacao}`),

        el("p", {}, `Data: ${formatarData(doacao.data_doacao)}`),

        el("p", {}, `Status: ${doacao.status}`),

        el("p", {}, doacao.observacao || "Sem observações"),

        el("h3", {}, "Itens recebidos"),

        itens,
      );
    });

    lista.replaceChildren(...registros);
  } catch (erro) {
    lista.replaceChildren(estado(erro.message));
  }
}
