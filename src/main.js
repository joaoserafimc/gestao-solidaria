import "./style.css";

import { verificarSaude, lerToken, lerNomeUsuario, sair } from "./api.js";

import { telaDoadores } from "./pages/doadores.js";

import { telaDoacoes, telaNovaDoacao } from "./pages/doacoes.js";

import { telaLogin } from "./pages/login.js";

const app = document.querySelector("#app");
const topo = document.querySelector("#topo");
const nomeUsuario = document.querySelector("#nome-usuario");
const botaoSair = document.querySelector("#sair");

const rotas = {
  "#/doadores": telaDoadores,
  "#/doacoes/nova": telaNovaDoacao,
  "#/doacoes": telaDoacoes,
};

async function navegar() {
  if (!lerToken()) {
    topo.hidden = true;
    telaLogin(app, iniciar);
    return;
  }

  topo.hidden = false;
  nomeUsuario.textContent = lerNomeUsuario() || "";

  const rota = Object.hasOwn(rotas, location.hash) ? location.hash : "#/doadores";

  for (const link of document.querySelectorAll("nav a")) {
    if (link.getAttribute("href") === rota) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  }

  await rotas[rota](app);
}

function iniciar() {
  navegar();
}

botaoSair.addEventListener("click", () => {
  sair();
  location.hash = "#/doadores";
  iniciar();
});

window.addEventListener("hashchange", navegar);

iniciar();

const statusApi = document.querySelector("#status-api");

verificarSaude()
  .then((saude) => {
    statusApi.textContent = `${saude.status}, banco: ${saude.banco}`;
  })
  .catch(() => {
    statusApi.textContent = "fora do ar";
  });
