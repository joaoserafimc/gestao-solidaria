import { Router } from "express";
import db from "../db.js";

const router = Router();

// Listar itens e suas categorias
router.get("/", async (req, res) => {
  const [linhas] = await db.execute(`
    SELECT
      i.id_item,
      i.nome,
      i.quantidade,
      i.prioridade,
      c.nome AS categoria
    FROM item i
    INNER JOIN categoria c
      ON i.id_categoria = c.id_categoria
    WHERE i.ativo = 1
    ORDER BY i.nome
  `);

  res.json(linhas);
});

export default router;
