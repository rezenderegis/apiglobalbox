import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';

export class QueryImovelDto {
  @ApiPropertyOptional({ example: 'SP', description: 'Sigla do estado' })
  @IsOptional()
  @IsString()
  uf?: string;

  @ApiPropertyOptional({ example: 'São Paulo', description: 'Nome da cidade (busca parcial)' })
  @IsOptional()
  @IsString()
  cidade?: string;

  @ApiPropertyOptional({ example: 'Centro', description: 'Nome do bairro (busca parcial)' })
  @IsOptional()
  @IsString()
  bairro?: string;

  @ApiPropertyOptional({
    example: 'Centro,Vila Nova,Jardim América',
    description: 'Incluir somente estes bairros (exato). Separe por vírgula: ?bairrosIncluir=Centro,Vila Nova',
    type: String,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    const raw = Array.isArray(value) ? value.join(',') : String(value);
    return raw.split(',').map((b) => b.trim()).filter(Boolean);
  })
  bairrosIncluir?: string[];

  @ApiPropertyOptional({
    example: 'Centro,Vila Nova,Jardim América',
    description: 'Excluir estes bairros da busca (exato). Separe por vírgula: ?bairrosExcluir=Centro,Vila Nova',
    type: String,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    const raw = Array.isArray(value) ? value.join(',') : String(value);
    return raw.split(',').map((b) => b.trim()).filter(Boolean);
  })
  bairrosExcluir?: string[];

  @ApiPropertyOptional({ example: 'Terreno', description: 'Texto na descrição (busca parcial)' })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiPropertyOptional({ example: '50000', description: 'Preço mínimo' })
  @IsOptional()
  @IsNumberString()
  precoMin?: string;

  @ApiPropertyOptional({ example: '200000', description: 'Preço máximo' })
  @IsOptional()
  @IsNumberString()
  precoMax?: string;

  @ApiPropertyOptional({ example: '30', description: 'Desconto mínimo em %' })
  @IsOptional()
  @IsNumberString()
  descontoMin?: string;

  @ApiPropertyOptional({ example: '2026-06-12', description: 'Data de geração do arquivo (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  dataGeracao?: string;

  @ApiPropertyOptional({ example: '2026-01-01', description: 'Data inicial de cadastro (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  dataInicio?: string;

  @ApiPropertyOptional({ example: '2026-12-31', description: 'Data final de cadastro (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  dataFim?: string;

  @ApiPropertyOptional({
    example: 'disponivel',
    description: 'Situação do imóvel: disponivel | indisponivel (padrão: disponivel)',
    enum: ['disponivel', 'indisponivel'],
  })
  @IsOptional()
  @IsIn(['disponivel', 'indisponivel'])
  situacao?: string;

  @ApiPropertyOptional({ example: '1', description: 'Página (padrão: 1)' })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ example: '20', description: 'Itens por página (padrão: 20)' })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
