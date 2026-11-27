import { listarDoadores, criarDoador, atualizarDoador, excluirDoador } from "../api.js";

import { el, mostrarMensagem, esconderMensagem, estado } from "../ui.js";

export function telaDoadores(raiz) {
  raiz.innerHTML = `
    <h1>Gerenciamento de doadores</h1>
    <p>Cadastre e gerencie os doadores da ONG.</p>

    <div class="grade">
      <section class="cartao">
        <h2 id="titulo-form">Cadastrar doador</h2>

        <form id="form-doador">
          <label for="nome">Nome completo</label>
          <input id="nome" name="nome"
            maxlength="150" required />

          <label for="email">E-mail</label>
          <input id="email" name="email"
            type="email" maxlength="100" required />

          <label for="telefone">Telefone</label>
          <input id="telefone" name="telefone"
            type="tel" maxlength="20" />

          <div id="mensagem" class="mensagem"
            role="status" hidden></div>

          <div class="acoes">
            <button type="submit" id="salvar">
              Salvar doador
            </button>

            <button type="button" id="cancelar"
              class="secundario" hidden>
              Cancelar
            </button>
          </div>
        </form>
      </section>

      <section class="cartao">
        <h2>Doadores cadastrados</h2>
        <ul id="lista-doadores" class="lista"></ul>
      </section>
    </div>
  `;

  const form = raiz.querySelector("#form-doador");
  const lista = raiz.querySelector("#lista-doadores");
  const mensagem = raiz.querySelector("#mensagem");
  const titulo = raiz.querySelector("#titulo-form");
  const salvar = raiz.querySelector("#salvar");
  const cancelar = raiz.querySelector("#cancelar");

  let editando = null;

  function limparFormulario() {
    editando = null;
    form.reset();
    titulo.textContent = "Cadastrar doador";
    salvar.textContent = "Salvar doador";
    cancelar.hidden = true;
  }

  cancelar.addEventListener("click", () => {
    limparFormulario();
    esconderMensagem(mensagem);
  });

  function editar(doador) {
    editando = doador.id_doador;

    form.elements.nome.value = doador.nome;
    form.elements.email.value = doador.email;
    form.elements.telefone.value = doador.telefone || "";

    titulo.textContent = "Editar doador";
    salvar.textContent = "Salvar alterações";
    cancelar.hidden = false;

    esconderMensagem(mensagem);
    form.elements.nome.focus();
  }

  async function remover(doador) {
    const confirmar = window.confirm(`Deseja excluir ${doador.nome}?`);

    if (!confirmar) return;

    try {
      await excluirDoador(doador.id_doador);

      limparFormulario();

      mostrarMensagem(mensagem, "Doador excluído com sucesso!");

      await carregar();
    } catch (erro) {
      mostrarMensagem(mensagem, erro.message, "erro");
    }
  }

  async function carregar() {
    lista.replaceChildren(estado("Carregando doadores..."));

    try {
      const doadores = await listarDoadores();

      if (doadores.length === 0) {
        lista.replaceChildren(estado("Nenhum doador cadastrado."));
        return;
      }

      const registros = doadores.map((doador) =>
        el(
          "li",
          { class: "registro" },

          el("strong", {}, doador.nome),

          el("p", {}, doador.email),

          el("p", {}, doador.telefone || "Sem telefone"),

          el(
            "div",
            { class: "acoes" },

            el(
              "button",
              {
                type: "button",
                class: "secundario",
                onclick: () => editar(doador),
              },
              "Editar",
            ),

            el(
              "button",
              {
                type: "button",
                class: "perigo",
                onclick: () => remover(doador),
              },
              "Excluir",
            ),
          ),
        ),
      );

      lista.replaceChildren(...registros);
    } catch (erro) {
      lista.replaceChildren(estado(erro.message));
    }
  }

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    esconderMensagem(mensagem);
    salvar.disabled = true;
    cancelar.disabled = true;

    const dados = {
      nome: form.elements.nome.value.trim(),
      email: form.elements.email.value.trim(),
      telefone: form.elements.telefone.value.trim(),
    };

    try {
      if (editando !== null) {
        await atualizarDoador(editando, dados);

        mostrarMensagem(mensagem, "Doador atualizado com sucesso!");
      } else {
        await criarDoador(dados);

        mostrarMensagem(mensagem, "Doador cadastrado com sucesso!");
      }

      limparFormulario();
      await carregar();
    } catch (erro) {
      mostrarMensagem(mensagem, erro.message, "erro");
    } finally {
      salvar.disabled = false;
      cancelar.disabled = false;
    }
  });

  carregar();
}
