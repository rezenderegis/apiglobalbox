import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ImportImovelDto {
  @ApiProperty({ example: '/caminho/para/Lista_imoveis_geral.csv' })
  @IsNotEmpty()
  @IsString()
  filePath: string;
}
