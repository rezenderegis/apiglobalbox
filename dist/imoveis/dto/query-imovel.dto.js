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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryImovelDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class QueryImovelDto {
}
exports.QueryImovelDto = QueryImovelDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'SP', description: 'Sigla do estado' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryImovelDto.prototype, "uf", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'São Paulo', description: 'Nome da cidade (busca parcial)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryImovelDto.prototype, "cidade", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Centro', description: 'Nome do bairro (busca parcial)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryImovelDto.prototype, "bairro", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Centro,Vila Nova,Jardim América',
        description: 'Incluir somente estes bairros (exato). Separe por vírgula: ?bairrosIncluir=Centro,Vila Nova',
        type: String,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_transformer_1.Transform)(({ value }) => {
        const raw = Array.isArray(value) ? value.join(',') : String(value);
        return raw.split(',').map((b) => b.trim()).filter(Boolean);
    }),
    __metadata("design:type", Array)
], QueryImovelDto.prototype, "bairrosIncluir", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Centro,Vila Nova,Jardim América',
        description: 'Excluir estes bairros da busca (exato). Separe por vírgula: ?bairrosExcluir=Centro,Vila Nova',
        type: String,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_transformer_1.Transform)(({ value }) => {
        const raw = Array.isArray(value) ? value.join(',') : String(value);
        return raw.split(',').map((b) => b.trim()).filter(Boolean);
    }),
    __metadata("design:type", Array)
], QueryImovelDto.prototype, "bairrosExcluir", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Terreno', description: 'Texto na descrição (busca parcial)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryImovelDto.prototype, "descricao", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '50000', description: 'Preço mínimo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], QueryImovelDto.prototype, "precoMin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '200000', description: 'Preço máximo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], QueryImovelDto.prototype, "precoMax", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '30', description: 'Desconto mínimo em %' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], QueryImovelDto.prototype, "descontoMin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-06-12', description: 'Data de geração do arquivo (YYYY-MM-DD)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryImovelDto.prototype, "dataGeracao", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-01-01', description: 'Data inicial de cadastro (YYYY-MM-DD)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryImovelDto.prototype, "dataInicio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-12-31', description: 'Data final de cadastro (YYYY-MM-DD)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryImovelDto.prototype, "dataFim", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'disponivel',
        description: 'Situação do imóvel: disponivel | indisponivel (padrão: disponivel)',
        enum: ['disponivel', 'indisponivel'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['disponivel', 'indisponivel']),
    __metadata("design:type", String)
], QueryImovelDto.prototype, "situacao", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1', description: 'Página (padrão: 1)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], QueryImovelDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '20', description: 'Itens por página (padrão: 20)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], QueryImovelDto.prototype, "limit", void 0);
//# sourceMappingURL=query-imovel.dto.js.map