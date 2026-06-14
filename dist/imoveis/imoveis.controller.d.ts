import { ImoveisService } from './imoveis.service';
import { ImportImovelDto } from './dto/import-imovel.dto';
import { QueryImovelDto } from './dto/query-imovel.dto';
export declare class ImoveisController {
    private readonly imoveisService;
    constructor(imoveisService: ImoveisService);
    importCsv(dto: ImportImovelDto): Promise<{
        imported: number;
        skipped: number;
        message: string;
    }>;
    findAll(query: QueryImovelDto): Promise<{
        data: import("./entities/imovel.entity").Imovel[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<import("./entities/imovel.entity").Imovel>;
}
