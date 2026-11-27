# GestãoSolidária

Sistema de gestão de doações para a ONG fictícia Mãos Solidárias.

Projeto Integrador Extensionista II (PIE II).
Curso de Análise e Desenvolvimento de Sistemas - UNIMAR.

## Objetivo

Desenvolver um sistema web para auxiliar no gerenciamento
de doadores, beneficiários, doações, estoque e entregas.

## Tecnologias utilizadas

- HTML
- CSS
- JavaScript Vanilla
- Vite+
- Node.js
- Express
- dotenv
- PNPM
- Git e GitHub

## Requisitos

- Git
- Vite+ (comando vp)
- PNPM

## Como executar o projeto

1. Clone este repositório pelo GitHub e entre na pasta do projeto.

2. Instale as dependências:

   ```bash
   vp install
   ```

3. Copie o arquivo .env.example para .env.

4. No primeiro terminal, inicie a API:

   ```bash
   vp run api
   ```

5. No segundo terminal, inicie o frontend:

   ```bash
   vp dev
   ```

6. Acesse no navegador:

   http://localhost:5173

## Rota da API

GET /api/health

Retorna o status da API, o nome da aplicação e a data e hora.

## Etapa atual

Atividade 1 - Estrutura inicial da aplicação,
API Express e integração entre frontend e backend.

## Autor

João Vitor Serafim
