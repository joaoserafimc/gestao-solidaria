# GestãoSolidária

Sistema web de gerenciamento de doações para a ONG fictícia
Mãos Solidárias.

Projeto Integrador Extensionista II (PIE II).
Curso de Análise e Desenvolvimento de Sistemas - UNIMAR.

## Objetivo

Auxiliar no gerenciamento de doadores e no registro e
acompanhamento das doações recebidas pela ONG.

## Funcionalidades

- Login com autenticação JWT.
- Proteção de senhas com bcrypt.
- Cadastro, consulta, edição e exclusão de doadores.
- Consulta de itens e categorias.
- Registro de doações com vários itens.
- Listagem de doações realizadas.
- Proteção das rotas da API.
- Interface responsiva.
- Logout do sistema.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript Vanilla
- Vite+
- Node.js
- Express
- MySQL / MariaDB
- mysql2
- dotenv
- bcryptjs
- jsonwebtoken
- PNPM
- Git e GitHub

## Pré-requisitos

- Git
- Node.js
- Vite+
- PNPM
- MySQL ou MariaDB (XAMPP)

## Como executar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/joaoserafimc/gestao-solidaria.git
cd gestao-solidaria
```

### 2. Instalar as dependências

```bash
vp install
```

### 3. Configurar o banco de dados

Inicie o MySQL pelo XAMPP.

No cliente MySQL, execute:

```sql
SOURCE database/schema.sql;
SOURCE database/seed.sql;
```

Caso necessário, informe o caminho completo dos arquivos.

Atenção: o schema.sql recria o banco de dados,
apagando os registros existentes.

### 4. Configurar as variáveis de ambiente

No PowerShell:

```powershell
Copy-Item .env.example .env
```

Gere uma chave JWT aleatória:

```bash
node -e "console.log(crypto.randomBytes(32).toString('hex'))"
```

Preencha o JWT_SECRET no arquivo .env com a chave gerada
e ajuste a senha do banco, caso necessário.

| Variável | Finalidade |
|---|---|
| PORT | Porta da API |
| DB_HOST | Endereço do banco |
| DB_PORT | Porta do banco |
| DB_USER | Usuário do banco |
| DB_PASSWORD | Senha do banco |
| DB_NAME | Nome do banco |
| JWT_SECRET | Chave de assinatura dos tokens |
| JWT_EXPIRES_IN | Tempo de validade do token |

O arquivo .env não deve ser publicado no GitHub.

### 5. Iniciar o backend

Terminal 1:

```bash
vp run api
```

### 6. Iniciar o frontend

Terminal 2:

```bash
vp dev
```

### 7. Acessar o sistema

http://localhost:5173/

## Usuário de demonstração

- E-mail: voluntario@exemplo.com
- Senha: gestao123

Credenciais exclusivamente para demonstração acadêmica.

## Rotas da API

| Método | Rota | Autenticação |
|---|---|---|
| GET | /api/health | Não |
| POST | /api/auth/login | Não |
| GET | /api/doadores | Sim |
| GET | /api/doadores/:id | Sim |
| POST | /api/doadores | Sim |
| PUT | /api/doadores/:id | Sim |
| DELETE | /api/doadores/:id | Sim |
| GET | /api/itens | Sim |
| GET | /api/doacoes | Sim |
| POST | /api/doacoes | Sim |

## Banco de dados

O banco gestao_solidaria possui oito tabelas:

- usuario
- doador
- beneficiario
- categoria
- item
- doacao
- doacao_item
- entrega

## Backup

Acesse o phpMyAdmin, selecione o banco gestao_solidaria,
clique em Exportar e selecione o formato SQL.

Mantenha os backups fora do repositório público.

## Verificação de código

```bash
vp check
vp build
```

## Melhorias futuras

- Edição de doações já registradas.
- Atualização automática do estoque.
- Gerenciamento de beneficiários e entregas pela interface.
- Redirecionamento automático ao login quando o token expirar.
- Relatórios gerenciais.

## Autor

João Vitor Serafim

Projeto Integrador Extensionista II - UNIMAR.