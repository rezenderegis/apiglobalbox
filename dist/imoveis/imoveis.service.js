"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImoveisService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fs = require("fs");
const csv_parse_1 = require("csv-parse");
const imovel_entity_1 = require("./entities/imovel.entity");
let ImoveisService = class ImoveisService {
    constructor(imovelRepo) {
        this.imovelRepo = imovelRepo;
    }
    async importFromCsv(filePath) {
        const content = fs.readFileSync(filePath, 'latin1');
        const lines = content.split('\n');
        const dataGeracao = this.parseDataGeracao(lines[0]);
        return new Promise((resolve, reject) => {
            const records = [];
            (0, csv_parse_1.parse)(lines.slice(2).join('\n'), {
                delimiter: ';',
                skip_empty_lines: true,
                trim: true,
            })
                .on('data', (row) => {
                if (!row[0] || isNaN(Number(row[0])))
                    return;
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
                if (records.length === 0)
                    return resolve({ imported: 0, skipped: 0, indisponiveis: 0 });
                const idsNoCsv = records.map((r) => r.numeroImovel);
                const existing = await this.imovelRepo.find({
                    where: { numeroImovel: (0, typeorm_2.In)(idsNoCsv) },
                    select: { numeroImovel: true },
                });
                const existingSet = new Set(existing.map((e) => String(e.numeroImovel)));
                const novos = records.filter((r) => !existingSet.has(String(r.numeroImovel)));
                if (novos.length > 0) {
                    const CHUNK = 500;
                    for (let i = 0; i < novos.length; i += CHUNK) {
                        await this.imovelRepo
                            .createQueryBuilder()
                            .insert()
                            .into(imovel_entity_1.Imovel)
                            .values(novos.slice(i, i + CHUNK))
                            .orIgnore()
                            .execute();
                    }
                }
                const { affected } = await this.imovelRepo
                    .createQueryBuilder()
                    .update(imovel_entity_1.Imovel)
                    .set({ situacao: 'indisponivel', dataSituacao: new Date() })
                    .where({ situacao: 'disponivel', numeroImovel: (0, typeorm_2.Not)((0, typeorm_2.In)(idsNoCsv)) })
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
    async findAll(query) {
        const page = Number(query.page ?? 1);
        const limit = Number(query.limit ?? 20);
        const skip = (page - 1) * limit;
        console.log('[findAll] filtros recebidos:', JSON.stringify(query, null, 2));
        const qb = this.imovelRepo.createQueryBuilder('i');
        const situacao = query.situacao ?? 'disponivel';
        qb.andWhere('i.situacao = :situacao', { situacao });
        if (query.uf)
            qb.andWhere('UPPER(i.uf) = UPPER(:uf)', { uf: query.uf });
        if (query.cidade)
            qb.andWhere('UPPER(i.cidade) LIKE UPPER(:cidade)', { cidade: `%${query.cidade}%` });
        if (query.bairro)
            qb.andWhere('UPPER(i.bairro) LIKE UPPER(:bairro)', { bairro: `%${query.bairro}%` });
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
        if (query.descricao)
            qb.andWhere('UPPER(i.descricao) LIKE UPPER(:descricao)', { descricao: `%${query.descricao}%` });
        if (query.precoMin)
            qb.andWhere('i.preco >= :precoMin', { precoMin: Number(query.precoMin) });
        if (query.precoMax)
            qb.andWhere('i.preco <= :precoMax', { precoMax: Number(query.precoMax) });
        if (query.descontoMin)
            qb.andWhere('i.desconto >= :descontoMin', { descontoMin: Number(query.descontoMin) });
        if (query.dataGeracao)
            qb.andWhere('i.data_geracao = :dataGeracao', { dataGeracao: query.dataGeracao });
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
    async findOne(numeroImovel) {
        const imovel = await this.imovelRepo.findOne({ where: { numeroImovel } });
        if (!imovel)
            throw new common_1.NotFoundException(`Imóvel ${numeroImovel} não encontrado`);
        return imovel;
    }
    parseDecimal(value) {
        if (!value)
            return 0;
        const v = value.trim();
        if (v.includes(',')) {
            return parseFloat(v.replace(/\./g, '').replace(',', '.'));
        }
        return parseFloat(v);
    }
    parseDataGeracao(headerLine) {
        const match = headerLine.match(/(\d{2})\/(\d{2})\/(\d{2,4})/);
        if (!match)
            return new Date();
        const [, day, month, year] = match;
        const fullYear = year.length === 2 ? `20${year}` : year;
        return new Date(`${fullYear}-${month}-${day}`);
    }
};
exports.ImoveisService = ImoveisService;
exports.ImoveisService = ImoveisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(imovel_entity_1.Imovel)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ImoveisService);
//# sourceMappingURL=imoveis.service.js.map