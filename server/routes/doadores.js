import { Router } from "express";
import db from "../db.js";
import { validarDoador } from "../validacao.js";

const router = Router();

// Listar doadores
router.get("/", async (req, res) => {
  const [linhas] = await db.execute("SELECT * FROM doador ORDER BY nome");

  res.json(linhas);
});

// Buscar doador pelo ID
router.get("/:id", async (req, res) => {
  const [linhas] = await db.execute("SELECT * FROM doador WHERE id_doador = ?", [req.params.id]);

  if (linhas.length === 0) {
    return res.status(404).json({
      erro: "Doador não encontrado",
    });
  }

  res.json(linhas[0]);
});

// Cadastrar doador
router.post("/", async (req, res) => {
  const erro = validarDoador(req.body);

  if (erro) {
    return res.status(400).json({ erro });
  }

  const { nome, email, telefone } = req.body;

  try {
    const [resultado] = await db.execute(
      "INSERT INTO doador (nome, email, telefone) VALUES (?, ?, ?)",
      [nome.trim(), email, telefone || null],
    );

    res.status(201).json({
      id_doador: resultado.insertId,
      nome: nome.trim(),
      email,
      telefone: telefone || null,
    });
  } catch (erro) {
    if (erro.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        erro: "E-mail já cadastrado",
      });
    }

    throw erro;
  }
});

// Editar doador
router.put("/:id", async (req, res) => {
  const erro = validarDoador(req.body);

  if (erro) {
    return res.status(400).json({ erro });
  }

  const { nome, email, telefone } = req.body;

  try {
    const [resultado] = await db.execute(
      "UPDATE doador SET nome = ?, email = ?, telefone = ? WHERE id_doador = ?",
      [nome.trim(), email, telefone || null, req.params.id],
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        erro: "Doador não encontrado",
      });
    }

    res.json({
      id_doador: Number(req.params.id),
      nome: nome.trim(),
      email,
      telefone: telefone || null,
    });
  } catch (erro) {
    if (erro.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        erro: "E-mail já cadastrado",
      });
    }

    throw erro;
  }
});

// Excluir doador
router.delete("/:id", async (req, res) => {
  try {
    const [resultado] = await db.execute("DELETE FROM doador WHERE id_doador = ?", [req.params.id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        erro: "Doador não encontrado",
      });
    }

    res.status(204).end();
  } catch (erro) {
    if (erro.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        erro: "Este doador possui doações registradas",
      });
    }

    throw erro;
  }
});

export default router;
