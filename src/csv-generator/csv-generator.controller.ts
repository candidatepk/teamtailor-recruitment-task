import { Controller, Get, Res } from '@nestjs/common';
import { CsvGeneratorService } from './csv-generator.service';
import { Response } from 'express';

@Controller('csv-generator')
export class CsvGeneratorController {
  constructor(private readonly csvGeneratorService: CsvGeneratorService) {}

  @Get('/candidates')
  generateCandidatesCsv(@Res() res: Response) {
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', `attachment; filename=candidates.csv`);
    return this.csvGeneratorService.generateCandidatesCsv(res);
  }
}
