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
exports.Imovel = void 0;
const typeorm_1 = require("typeorm");
let Imovel = class Imovel {
};
exports.Imovel = Imovel;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'numero_imovel', type: 'bigint' }),
    __metadata("design:type", String)
], Imovel.prototype, "numeroImovel", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 5 }),
    __metadata("design:type", String)
], Imovel.prototype, "uf", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Imovel.prototype, "cidade", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150 }),
    __metadata("design:type", String)
], Imovel.prototype, "bairro", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 300 }),
    __metadata("design:type", String)
], Imovel.prototype, "endereco", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], Imovel.prototype, "preco", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'valor_avaliacao', type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], Imovel.prototype, "valorAvaliacao", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], Imovel.prototype, "desconto", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Imovel.prototype, "financiamento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Imovel.prototype, "descricao", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'modalidade_venda', length: 100 }),
    __metadata("design:type", String)
], Imovel.prototype, "modalidadeVenda", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500 }),
    __metadata("design:type", String)
], Imovel.prototype, "link", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'data_geracao', type: 'date' }),
    __metadata("design:type", Date)
], Imovel.prototype, "dataGeracao", void 0);
exports.Imovel = Imovel = __decorate([
    (0, typeorm_1.Entity)('imoveis')
], Imovel);
//# sourceMappingURL=imovel.entity.js.map