import { Module } from '@nestjs/common';
import { CsvGeneratorService } from './csv-generator.service';
import { CsvGeneratorController } from './csv-generator.controller';

@Module({
  providers: [CsvGeneratorService],
  controllers: [CsvGeneratorController],
})
export class CsvGeneratorModule {}
