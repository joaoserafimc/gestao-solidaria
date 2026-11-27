import { Router } from "express";
import db from "../db.js";
import { validarDoacao } from "../validacao.js";

const router = Router();

// Listar doações
router.get("/", async (req, res) => {
  const [doacoes] = await db.execute(`
    SELECT
      d.id_doacao,
      d.id_doador,
      d.data_doacao,
      d.descricao,
      d.descricao AS observacao,
      d.status,
      p.nome AS doador
    FROM doacao d
    INNER JOIN doador p
      ON d.id_doador = p.id_doador
    ORDER BY d.data_doacao DESC, d.id_doacao DESC
  `);

  const [itens] = await db.execute(`
    SELECT
      di.id_doacao,
      di.id_item,
      i.nome,
      di.quantidade
    FROM doacao_item di
    INNER JOIN item i
      ON di.id_item = i.id_item
    ORDER BY i.nome
  `);

  for (const doacao of doacoes) {
    doacao.itens = itens.filter((item) => item.id_doacao === doacao.id_doacao);
  }

  res.json(doacoes);
});

// Registrar nova doação
router.post("/", async (req, res) => {
  const erro = validarDoacao(req.body);

  if (erro) {
    return res.status(400).json({ erro });
  }

  const { id_doador, data_doacao, itens } = req.body;
  const descricao = req.body.descricao ?? req.body.observacao ?? "";

  if (typeof descricao !== "string") {
    return res.status(400).json({
      erro: "Descrição inválida",
    });
  }

  const conexao = await db.getConnection();

  try {
    await conexao.beginTransaction();

    const [resultado] = await conexao.execute(
      `INSERT INTO doacao
      (id_doador, data_doacao, descricao, status)
      VALUES (?, ?, ?, ?)`,
      [id_doador, data_doacao, descricao.trim(), "pendente"],
    );

    const id_doacao = resultado.insertId;

    for (const item of itens) {
      await conexao.execute(
        `INSERT INTO doacao_item
        (id_doacao, id_item, quantidade)
        VALUES (?, ?, ?)`,
        [id_doacao, item.id_item, item.quantidade],
      );
    }

    await conexao.commit();

    res.status(201).json({
      id_doacao,
      mensagem: "Doação registrada com sucesso",
    });
  } catch (erro) {
    await conexao.rollback();

    if (erro.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        erro: "Doador ou item não encontrado",
      });
    }

    throw erro;
  } finally {
    conexao.release();
  }
});

export default router;
