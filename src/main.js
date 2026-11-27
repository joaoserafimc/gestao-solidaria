import "./style.css";
import { verificarSaude } from "./api.js";
import { telaDoadores } from "./pages/doadores.js";
import { telaDoacoes, telaNovaDoacao } from "./pages/doacoes.js";

const app = document.querySelector("#app");

const rotas = {
  "#/doadores": telaDoadores,
  "#/doacoes/nova": telaNovaDoacao,
  "#/doacoes": telaDoacoes,
};

async function navegar() {
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

window.addEventListener("hashchange", navegar);

navegar();

const statusApi = document.querySelector("#status-api");

verificarSaude()
  .then((saude) => {
    statusApi.textContent = `${saude.status}, banco: ${saude.banco}`;
  })
  .catch(() => {
    statusApi.textContent = "fora do ar";
  });
