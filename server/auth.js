import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "./db.js";
import { validarLogin } from "./validacao.js";

const router = Router();

// ROTA DE LOGIN

router.post("/login", async (req, res) => {
  const erro = validarLogin(req.body);

  if (erro) {
    return res.status(400).json({ erro });
  }

  const [linhas] = await db.execute(
    "SELECT id_usuario, nome, email, senha_hash FROM usuario WHERE email = ?",
    [req.body.email.trim()],
  );

  const usuario = linhas[0];

  const senhaConfere = usuario && (await bcrypt.compare(req.body.senha, usuario.senha_hash));

  if (!senhaConfere) {
    return res.status(401).json({
      erro: "E-mail ou senha inválidos",
    });
  }

  const token = jwt.sign(
    {
      id: usuario.id_usuario,
      nome: usuario.nome,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "8h",
      algorithm: "HS256",
    },
  );

  res.json({
    token,
    usuario: {
      nome: usuario.nome,
      email: usuario.email,
    },
  });
});

// PROTECAO DAS ROTAS

export function autenticar(req, res, next) {
  const [tipo, token] = (req.headers.authorization || "").split(" ");

  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({
      erro: "Token ausente",
    });
  }

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });

    next();
  } catch {
    res.status(401).json({
      erro: "Token inválido ou expirado",
    });
  }
}

export default router;
