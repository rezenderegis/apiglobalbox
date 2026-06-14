-- Migração 002 - Adiciona campos situacao e data_situacao
-- Executar: psql -U fabricio -d caixa_leilao -f migrations/migration_002_add_situacao.sql

ALTER TABLE imoveis
    ADD COLUMN IF NOT EXISTS situacao     VARCHAR(20)              NOT NULL DEFAULT 'disponivel',
    ADD COLUMN IF NOT EXISTS data_situacao TIMESTAMP WITH TIME ZONE NULL;

CREATE INDEX IF NOT EXISTS idx_imoveis_situacao ON imoveis (situacao);
