import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as fs from 'fs';
import { parse } from 'csv-parse';
import { Imovel } from './entities/imovel.entity';
import { QueryImovelDto } from './dto/query-imovel.dto';

@Injectable()
export class ImoveisService {
  constructor(
    @InjectRepository(Imovel)
    private readonly imovelRepo: Repository<Imovel>,
  ) {}

  async importFromCsv(filePath: string): Promise<{ imported: number; skipped: number }> {
    const content = fs.readFileSync(filePath, 'latin1');

    const lines = content.split('\n');
    const dataGeracao = this.parseDataGeracao(lines[0]);

    return new Promise((resolve, reject) => {
      const records: Imovel[] = [];

      parse(lines.slice(2).join('\n'), {
        delimiter: ';',
        skip_empty_lines: true,
        trim: true,
      })
        .on('data', (row: string[]) => {
          if (!row[0] || isNaN(Number(row[0]))) return;

          const imovel = this.imovelRepo.create({
            numeroImovel: row[0].trim(),
            uf: row[1]?.trim(),
            cidade: row[2]?.trim(),
            bairro: row[3]?.trim(),
            endereco: row[4]?.trim(),
            preco: this.parseDecimal(row[5]),
            valorAvaliacao: this.parseDecimal(row[6]),
            desconto: this.parseDecimal(row[7]),
            financiamento: row[8]?.trim().toLowerCase() === 'sim',
            descricao: row[9]?.trim(),
            modalidadeVenda: row[10]?.trim(),
            link: row[11]?.trim(),
            dataGeracao,
          });
          records.push(imovel);
        })
        .on('end', async () => {
          if (records.length === 0) return resolve({ imported: 0, skipped: 0 });

          const ids = records.map((r) => r.numeroImovel);

          const existing = await this.imovelRepo.find({
            where: { numeroImovel: In(ids) },
            select: { numeroImovel: true },
          });

          const existingSet = new Set(existing.map((e) => String(e.numeroImovel)));
          const novos = records.filter((r) => !existingSet.has(String(r.numeroImovel)));
          const skipped = records.length - novos.length;

          if (novos.length > 0) {
            const CHUNK = 500;
            for (let i = 0; i < novos.length; i += CHUNK) {
              await this.imovelRepo
                .createQueryBuilder()
                .insert()
                .into(Imovel)
                .values(novos.slice(i, i + CHUNK))
                .orIgnore()
                .execute();
            }
          }

          resolve({ imported: novos.length, skipped });
        })
        .on('error', reject);
    });
  }

  async findAll(query: QueryImovelDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 20);
    const skip = (page - 1) * limit;

    console.log('[findAll] filtros recebidos:', JSON.stringify(query, null, 2));

    const qb = this.imovelRepo.createQueryBuilder('i');

    if (query.uf) qb.andWhere('UPPER(i.uf) = UPPER(:uf)', { uf: query.uf });
    if (query.cidade) qb.andWhere('UPPER(i.cidade) LIKE UPPER(:cidade)', { cidade: `%${query.cidade}%` });
    if (query.bairro) qb.andWhere('UPPER(i.bairro) LIKE UPPER(:bairro)', { bairro: `%${query.bairro}%` });
    if (query.bairrosIncluir?.length) {
      const vals = query.bairrosIncluir.map((b) => b.toUpperCase());
      console.log('[findAll] bairrosIncluir aplicado:', vals);
      qb.andWhere('UPPER(i.bairro) IN (:...bairrosIncluir)', { bairrosIncluir: vals });
    }
    if (query.bairrosExcluir?.length) {
      const vals = query.bairrosExcluir.map((b) => b.toUpperCase());
      console.log('[findAll] bairrosExcluir aplicado:', vals);
      qb.andWhere('UPPER(i.bairro) NOT IN (:...bairrosExcluir)', { bairrosExcluir: vals });
    }
    if (query.descricao) qb.andWhere('UPPER(i.descricao) LIKE UPPER(:descricao)', { descricao: `%${query.descricao}%` });
    if (query.precoMin) qb.andWhere('i.preco >= :precoMin', { precoMin: Number(query.precoMin) });
    if (query.precoMax) qb.andWhere('i.preco <= :precoMax', { precoMax: Number(query.precoMax) });
    if (query.descontoMin) qb.andWhere('i.desconto >= :descontoMin', { descontoMin: Number(query.descontoMin) });
    if (query.dataGeracao) qb.andWhere('i.data_geracao = :dataGeracao', { dataGeracao: query.dataGeracao });

    console.log('[findAll] SQL gerado:', qb.getSql());

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(numeroImovel: string): Promise<Imovel> {
    const imovel = await this.imovelRepo.findOne({ where: { numeroImovel } });
    if (!imovel) throw new NotFoundException(`Imóvel ${numeroImovel} não encontrado`);
    return imovel;
  }

  private parseDecimal(value: string): number {
    if (!value) return 0;
    const v = value.trim();
    // Formato BR: 62.592,83 — ponto como milhar, vírgula como decimal
    if (v.includes(',')) {
      return parseFloat(v.replace(/\./g, '').replace(',', '.'));
    }
    // Formato com ponto decimal direto: 58.28
    return parseFloat(v);
  }

  private parseDataGeracao(headerLine: string): Date {
    const match = headerLine.match(/(\d{2})\/(\d{2})\/(\d{2,4})/);
    if (!match) return new Date();
    const [, day, month, year] = match;
    const fullYear = year.length === 2 ? `20${year}` : year;
    return new Date(`${fullYear}-${month}-${day}`);
  }
}
