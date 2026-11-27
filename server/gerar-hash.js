import bcrypt from "bcryptjs";

const senha = process.argv[2];

if (!senha) {
  console.log("Informe uma senha");
  process.exit(1);
}

console.log(await bcrypt.hash(senha, 10));
