-- GestaoSolidaria - schema.sql
-- ONG ficticia Maos Solidarias
-- Projeto Integrador Extensionista II - UNIMAR

-- ATENCAO: este script recria o banco e apaga os dados existentes.

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS gestao_solidaria;

CREATE DATABASE gestao_solidaria
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE gestao_solidaria;


-- 1. TABELA DOADOR

CREATE TABLE doador (
    id_doador INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    data_cadastro DATE NOT NULL DEFAULT (CURRENT_DATE),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    CHECK (ativo IN (0, 1))
);


-- 2. TABELA BENEFICIARIO

CREATE TABLE beneficiario (
    id_beneficiario INT AUTO_INCREMENT PRIMARY KEY,
    nome_familia VARCHAR(150) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    num_membros INT NOT NULL CHECK (num_membros > 0),
    data_cadastro DATE NOT NULL DEFAULT (CURRENT_DATE),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    CHECK (ativo IN (0, 1))
);


-- 3. TABELA CATEGORIA

CREATE TABLE categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(60) NOT NULL UNIQUE,
    descricao VARCHAR(255)
);


-- 4. TABELA ITEM

CREATE TABLE item (
    id_item INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    quantidade INT NOT NULL DEFAULT 0
        CHECK (quantidade >= 0),
    prioridade ENUM('baixa', 'media', 'alta')
        NOT NULL DEFAULT 'media',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    CHECK (ativo IN (0, 1)),

    FOREIGN KEY (id_categoria)
        REFERENCES categoria (id_categoria)
);


-- 5. TABELA DOACAO

CREATE TABLE doacao (
    id_doacao INT AUTO_INCREMENT PRIMARY KEY,
    id_doador INT NOT NULL,
    data_doacao DATE NOT NULL,
    descricao TEXT NOT NULL,
    status ENUM('pendente', 'entregue', 'cancelada')
        NOT NULL DEFAULT 'pendente',
    data_criacao TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_doador)
        REFERENCES doador (id_doador)
);


-- 6. TABELA ASSOCIATIVA DOACAO_ITEM

CREATE TABLE doacao_item (
    id_doacao INT NOT NULL,
    id_item INT NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),

    PRIMARY KEY (id_doacao, id_item),

    FOREIGN KEY (id_doacao)
        REFERENCES doacao (id_doacao)
        ON DELETE CASCADE,

    FOREIGN KEY (id_item)
        REFERENCES item (id_item)
);


-- 7. TABELA ENTREGA

CREATE TABLE entrega (
    id_entrega INT AUTO_INCREMENT PRIMARY KEY,
    id_beneficiario INT NOT NULL,
    id_doacao INT NOT NULL,
    data_entrega DATE NOT NULL,
    observacao VARCHAR(255),
    data_registro TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_beneficiario)
        REFERENCES beneficiario (id_beneficiario),

    FOREIGN KEY (id_doacao)
        REFERENCES doacao (id_doacao)
);