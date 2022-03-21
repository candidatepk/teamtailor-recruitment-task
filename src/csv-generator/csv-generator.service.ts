import { Injectable } from '@nestjs/common';
import { TeamtailorService } from '../teamtailor/teamtailor.service';
import { stringify } from 'csv-stringify';
import { Readable, Writable } from 'stream';

@Injectable()
export class CsvGeneratorService {
  constructor(private readonly teamtailorService: TeamtailorService) {}

  generateCandidatesCsv(outputStream: Writable) {
    const columns = [
      'candidate_id',
      'first_name',
      'last_name',
      'email',
      'job_application_id',
      'job_application_created_at',
    ];
    const stringifier = stringify({ header: true, columns, bom: true });
    const readableStream = Readable.from(
      this.teamtailorService.getAllCandidates(),
    );
    readableStream.pipe(stringifier).pipe(outputStream);
  }
}
