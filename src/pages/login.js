import { entrar } from "../api.js";
import { mostrarMensagem } from "../ui.js";

export function telaLogin(raiz, aoEntrar) {
  raiz.innerHTML = `
    <section class="login">

      <div class="login-marca">
        <h1>GestãoSolidária</h1>
        <p>Sistema de gerenciamento de doações</p>
        <p>ONG Mãos Solidárias</p>
      </div>

      <form id="form-login" class="cartao">

        <h2>Acesse sua conta</h2>

        <label for="email">E-mail</label>

        <input
          id="email"
          name="email"
          type="email"
          placeholder="Digite seu e-mail"
          autocomplete="username"
          required
        />

        <label for="senha">Senha</label>

        <input
          id="senha"
          name="senha"
          type="password"
          placeholder="Digite sua senha"
          autocomplete="current-password"
          required
        />

        <div id="msg-login"
          class="mensagem"
          role="status"
          hidden>
        </div>

        <button type="submit">
          Entrar
        </button>

      </form>

    </section>
  `;

  const form = raiz.querySelector("#form-login");
  const mensagem = raiz.querySelector("#msg-login");
  const botao = form.querySelector("button");

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    botao.disabled = true;

    mostrarMensagem(mensagem, "Entrando...", "info");

    try {
      await entrar(form.elements.email.value.trim(), form.elements.senha.value);

      aoEntrar();
    } catch (erro) {
      mostrarMensagem(mensagem, erro.message, "erro");

      form.elements.senha.value = "";
      form.elements.senha.focus();
    } finally {
      botao.disabled = false;
    }
  });
}
