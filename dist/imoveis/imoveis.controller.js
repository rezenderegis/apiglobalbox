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
exports.ImoveisController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const imoveis_service_1 = require("./imoveis.service");
const import_imovel_dto_1 = require("./dto/import-imovel.dto");
const query_imovel_dto_1 = require("./dto/query-imovel.dto");
let ImoveisController = class ImoveisController {
    constructor(imoveisService) {
        this.imoveisService = imoveisService;
    }
    async uploadCsv(file) {
        if (!file)
            throw new common_1.BadRequestException('Nenhum arquivo enviado');
        const result = await this.imoveisService.importFromBuffer(file.buffer);
        return { message: 'Importação concluída', ...result };
    }
    async importCsv(dto) {
        const result = await this.imoveisService.importFromCsv(dto.filePath);
        return { message: 'Importação concluída', ...result };
    }
    findAll(query) {
        return this.imoveisService.findAll(query);
    }
    findOne(id) {
        return this.imoveisService.findOne(id);
    }
};
exports.ImoveisController = ImoveisController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, swagger_1.ApiOperation)({ summary: 'Importar CSV via upload de arquivo' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Importação concluída com sucesso' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage: (0, multer_1.memoryStorage)() })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ImoveisController.prototype, "uploadCsv", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, swagger_1.ApiOperation)({ summary: 'Importar CSV pelo caminho do arquivo no servidor' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Importação concluída com sucesso' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [import_imovel_dto_1.ImportImovelDto]),
    __metadata("design:returntype", Promise)
], ImoveisController.prototype, "importCsv", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar imóveis com filtros e paginação' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de imóveis retornada com sucesso' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_imovel_dto_1.QueryImovelDto]),
    __metadata("design:returntype", void 0)
], ImoveisController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar imóvel pelo número' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Número do imóvel', example: '10005120' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Imóvel encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Imóvel não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ImoveisController.prototype, "findOne", null);
exports.ImoveisController = ImoveisController = __decorate([
    (0, swagger_1.ApiTags)('Imóveis'),
    (0, common_1.Controller)('imoveis'),
    __metadata("design:paramtypes", [imoveis_service_1.ImoveisService])
], ImoveisController);
//# sourceMappingURL=imoveis.controller.js.map