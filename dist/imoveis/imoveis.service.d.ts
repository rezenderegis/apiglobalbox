import { Repository } from 'typeorm';
import { Imovel } from './entities/imovel.entity';
import { QueryImovelDto } from './dto/query-imovel.dto';
export declare class ImoveisService {
    private readonly imovelRepo;
    constructor(imovelRepo: Repository<Imovel>);
    importFromCsv(filePath: string): Promise<{
        imported: number;
        skipped: number;
        indisponiveis: number;
    }>;
    importFromBuffer(buffer: Buffer): Promise<{
        imported: number;
        skipped: number;
        indisponiveis: number;
    }>;
    private processarCsv;
    findAll(query: QueryImovelDto): Promise<{
        data: Imovel[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(numeroImovel: string): Promise<Imovel>;
    private parseDecimal;
    private parseDataGeracao;
}
