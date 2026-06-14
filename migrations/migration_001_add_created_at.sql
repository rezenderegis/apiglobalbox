-- Migração 001 - Adiciona coluna created_at na tabela imoveis
-- Executar: psql -U fabricio -d caixa_leilao -f migration_001_add_created_at.sql

ALTER TABLE imoveis
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();
