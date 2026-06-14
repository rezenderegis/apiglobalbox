-- Criação do banco de dados
CREATE DATABASE caixa_leilao;

-- Conectar ao banco antes de executar o restante
\c caixa_leilao;

-- Tabela de imóveis da Caixa
CREATE TABLE IF NOT EXISTS imoveis (
    numero_imovel   BIGINT          PRIMARY KEY,
    uf              VARCHAR(5)      NOT NULL,
    cidade          VARCHAR(100)    NOT NULL,
    bairro          VARCHAR(150)    NOT NULL,
    endereco        VARCHAR(300)    NOT NULL,
    preco           DECIMAL(15, 2)  NOT NULL,
    valor_avaliacao DECIMAL(15, 2)  NOT NULL,
    desconto        DECIMAL(5, 2)   NOT NULL,
    financiamento   BOOLEAN         NOT NULL DEFAULT FALSE,
    descricao       TEXT            NOT NULL,
    modalidade_venda VARCHAR(100)   NOT NULL,
    link            VARCHAR(500)    NOT NULL,
    data_geracao    DATE            NOT NULL
);

-- Índices para os filtros mais usados
CREATE INDEX IF NOT EXISTS idx_imoveis_uf          ON imoveis (UPPER(uf));
CREATE INDEX IF NOT EXISTS idx_imoveis_cidade      ON imoveis (UPPER(cidade));
CREATE INDEX IF NOT EXISTS idx_imoveis_bairro      ON imoveis (UPPER(bairro));
CREATE INDEX IF NOT EXISTS idx_imoveis_preco       ON imoveis (preco);
CREATE INDEX IF NOT EXISTS idx_imoveis_desconto    ON imoveis (desconto);
CREATE INDEX IF NOT EXISTS idx_imoveis_data_geracao ON imoveis (data_geracao);
