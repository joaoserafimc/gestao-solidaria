import "dotenv/config";
import express from "express";
import db from "./db.js";
import auth, { autenticar } from "./auth.js";
import doadores from "./routes/doadores.js";
import itens from "./routes/itens.js";
import doacoes from "./routes/doacoes.js";

if (!process.env.JWT_SECRET) {
  console.error("Defina JWT_SECRET no arquivo .env");
  process.exit(1);
}

const app = express();

app.use(express.json());

// ROTAS PUBLICAS

app.get("/api/health", async (req, res) => {
  try {
    await db.execute("SELECT 1");

    res.json({
      status: "ok",
      app: "GestaoSolidaria",
      banco: "ok",
      hora: new Date().toISOString(),
    });
  } catch {
    res.status(500).json({
      status: "ok",
      banco: "erro",
    });
  }
});

app.use("/api/auth", auth);

// ROTAS PROTEGIDAS

app.use("/api", autenticar);

app.use("/api/doadores", doadores);
app.use("/api/itens", itens);
app.use("/api/doacoes", doacoes);

// TRATAMENTO DE ERROS

app.use((err, req, res, _next) => {
  console.error(err);

  res.status(500).json({
    erro: "Erro interno do servidor",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
