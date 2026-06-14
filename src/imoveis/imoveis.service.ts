import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
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

  async importFromCsv(filePath: string): Promise<{ imported: number; skipped: number; indisponiveis: number }> {
    const content = fs.readFileSync(filePath, 'latin1');
    return this.processarCsv(content);
  }

  async importFromBuffer(buffer: Buffer): Promise<{ imported: number; skipped: number; indisponiveis: number }> {
    const content = buffer.toString('latin1');
    return this.processarCsv(content);
  }

  private async processarCsv(content: string): Promise<{ imported: number; skipped: number; indisponiveis: number }> {
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
            situacao: 'disponivel',
          });
          records.push(imovel);
        })
        .on('end', async () => {
          if (records.length === 0) return resolve({ imported: 0, skipped: 0, indisponiveis: 0 });

          const idsNoCsv = records.map((r) => r.numeroImovel);

          // Verifica quais já existem no banco
          const existing = await this.imovelRepo.find({
            where: { numeroImovel: In(idsNoCsv) },
            select: { numeroImovel: true },
          });
          const existingSet = new Set(existing.map((e) => String(e.numeroImovel)));

          // Insere somente os novos em lotes de 500
          const novos = records.filter((r) => !existingSet.has(String(r.numeroImovel)));
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

          // Marca como indisponível tudo que estava disponível e não veio no CSV
          const { affected } = await this.imovelRepo
            .createQueryBuilder()
            .update(Imovel)
            .set({ situacao: 'indisponivel', dataSituacao: new Date() })
            .where({ situacao: 'disponivel', numeroImovel: Not(In(idsNoCsv)) })
            .execute();

          resolve({
            imported: novos.length,
            skipped: records.length - novos.length,
            indisponiveis: affected ?? 0,
          });
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

    // Situação — padrão disponivel
    const situacao = query.situacao ?? 'disponivel';
    qb.andWhere('i.situacao = :situacao', { situacao });

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

    if (query.financiamento !== undefined) {
      qb.andWhere('i.financiamento = :financiamento', { financiamento: query.financiamento === 'sim' });
    }
    if (query.descricao) qb.andWhere('UPPER(i.descricao) LIKE UPPER(:descricao)', { descricao: `%${query.descricao}%` });
    if (query.precoMin) qb.andWhere('i.preco >= :precoMin', { precoMin: Number(query.precoMin) });
    if (query.precoMax) qb.andWhere('i.preco <= :precoMax', { precoMax: Number(query.precoMax) });
    if (query.descontoMin) qb.andWhere('i.desconto >= :descontoMin', { descontoMin: Number(query.descontoMin) });
    if (query.dataGeracao) qb.andWhere('i.data_geracao = :dataGeracao', { dataGeracao: query.dataGeracao });

    if (query.periodo) {
      const agora = new Date();
      let dataInicio: Date;

      if (query.periodo === 'hoje') {
        dataInicio = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
      } else if (query.periodo === 'semana') {
        dataInicio = new Date(agora);
        dataInicio.setDate(agora.getDate() - agora.getDay());
        dataInicio.setHours(0, 0, 0, 0);
      } else if (query.periodo === 'mes') {
        dataInicio = new Date(agora.getFullYear(), agora.getMonth(), 1);
      } else {
        dataInicio = new Date(agora.getFullYear(), 0, 1);
      }

      qb.andWhere('i.created_at >= :periodoInicio', { periodoInicio: dataInicio });
    }

    if (query.dataInicio) {
      qb.andWhere('i.created_at >= :dataInicio', { dataInicio: new Date(`${query.dataInicio}T00:00:00`) });
    }
    if (query.dataFim) {
      qb.andWhere('i.created_at <= :dataFim', { dataFim: new Date(`${query.dataFim}T23:59:59`) });
    }

    console.log('[findAll] SQL gerado:', qb.getSql());

    const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(numeroImovel: string): Promise<Imovel> {
    const imovel = await this.imovelRepo.findOne({ where: { numeroImovel } });
    if (!imovel) throw new NotFoundException(`Imóvel ${numeroImovel} não encontrado`);
    return imovel;
  }

  private parseDecimal(value: string): number {
    if (!value) return 0;
    const v = value.trim();
    if (v.includes(',')) {
      return parseFloat(v.replace(/\./g, '').replace(',', '.'));
    }
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
