-- GestaoSolidaria - seed.sql
-- Dados ficticios para demonstracao
-- Executar apos o schema.sql em um banco vazio

SET NAMES utf8mb4;

USE gestao_solidaria;
-- USUARIO DE DEMONSTRACAO
-- Email: voluntario@exemplo.com
-- Senha: gestao123

INSERT INTO usuario (nome, email, senha_hash)
VALUES (
    'Voluntario Demo',
    'voluntario@exemplo.com',
    '$2b$10$8Qij9N6VWC50fMWRnpRE0eMqd4eTyTjhrwBzIuEhM7Kmg8eWEITYG'
);

-- CATEGORIAS

INSERT INTO categoria (nome, descricao) VALUES
('Alimentos', 'Produtos alimenticios'),
('Higiene', 'Produtos de higiene pessoal'),
('Vestuario', 'Roupas e agasalhos');


-- DOADORES

INSERT INTO doador (nome, email, telefone) VALUES
('Ana Souza', 'ana@exemplo.com', '11988881001'),
('Carlos Lima', 'carlos@exemplo.com', '11988881002'),
('Mercado Solidario', 'mercado@exemplo.com', '11988881003'),
('Maria Oliveira', 'maria@exemplo.com', '11988881004');


-- BENEFICIARIOS

INSERT INTO beneficiario
(nome_familia, endereco, telefone, num_membros)
VALUES
('Familia Silva', 'Endereco ficticio 01', '11977771001', 4),
('Familia Santos', 'Endereco ficticio 02', '11977771002', 3),
('Familia Oliveira', 'Endereco ficticio 03', '11977771003', 5);


-- ITENS

INSERT INTO item
(id_categoria, nome, quantidade, prioridade)
VALUES
(1, 'Arroz 5 kg', 30, 'alta'),
(1, 'Feijao 1 kg', 25, 'alta'),
(1, 'Oleo de soja', 20, 'media'),
(1, 'Leite em po', 15, 'alta'),
(2, 'Sabonete', 40, 'media'),
(2, 'Creme dental', 30, 'media'),
(2, 'Fralda infantil', 20, 'alta'),
(3, 'Agasalho', 15, 'media'),
(3, 'Cobertor', 10, 'alta');


-- DOACOES

INSERT INTO doacao
(id_doador, data_doacao, descricao, status)
VALUES
(1, '2026-11-20', 'Doacao de alimentos', 'pendente'),
(2, '2026-11-21', 'Doacao de produtos de higiene', 'pendente'),
(3, '2026-11-22', 'Campanha de agasalhos', 'pendente');


-- ITENS DAS DOACOES

INSERT INTO doacao_item
(id_doacao, id_item, quantidade)
VALUES
(1, 1, 10),
(1, 2, 15),
(1, 3, 8),
(2, 5, 12),
(2, 6, 12),
(3, 8, 10),
(3, 9, 6);