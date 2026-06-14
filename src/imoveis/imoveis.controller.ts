import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { ImoveisService } from './imoveis.service';
import { ImportImovelDto } from './dto/import-imovel.dto';
import { QueryImovelDto } from './dto/query-imovel.dto';

@ApiTags('Imóveis')
@Controller('imoveis')
export class ImoveisController {
  constructor(private readonly imoveisService: ImoveisService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Importar CSV via upload de arquivo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Importação concluída com sucesso' })
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async uploadCsv(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Nenhum arquivo enviado');
    const result = await this.imoveisService.importFromBuffer(file.buffer);
    return { message: 'Importação concluída', ...result };
  }

  @Post('import')
  @ApiOperation({ summary: 'Importar CSV pelo caminho do arquivo no servidor' })
  @ApiResponse({ status: 201, description: 'Importação concluída com sucesso' })
  async importCsv(@Body() dto: ImportImovelDto) {
    const result = await this.imoveisService.importFromCsv(dto.filePath);
    return { message: 'Importação concluída', ...result };
  }

  @Get()
  @ApiOperation({ summary: 'Listar imóveis com filtros e paginação' })
  @ApiResponse({ status: 200, description: 'Lista de imóveis retornada com sucesso' })
  findAll(@Query() query: QueryImovelDto) {
    return this.imoveisService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar imóvel pelo número' })
  @ApiParam({ name: 'id', description: 'Número do imóvel', example: '10005120' })
  @ApiResponse({ status: 200, description: 'Imóvel encontrado' })
  @ApiResponse({ status: 404, description: 'Imóvel não encontrado' })
  findOne(@Param('id') id: string) {
    return this.imoveisService.findOne(id);
  }
}
