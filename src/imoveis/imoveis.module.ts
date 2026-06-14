import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Imovel } from './entities/imovel.entity';
import { ImoveisController } from './imoveis.controller';
import { ImoveisService } from './imoveis.service';

@Module({
  imports: [TypeOrmModule.forFeature([Imovel])],
  controllers: [ImoveisController],
  providers: [ImoveisService],
})
export class ImoveisModule {}
