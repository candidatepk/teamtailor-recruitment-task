import { DynamicModule, Global, Module } from '@nestjs/common';
import { TeamtailorService } from './teamtailor.service';
import { HttpModule, HttpModuleAsyncOptions } from '@nestjs/axios';

@Global()
@Module({})
export class TeamtailorModule {
  static forRootAsync(asyncOptions: HttpModuleAsyncOptions): DynamicModule {
    return {
      module: TeamtailorModule,
      imports: [TeamtailorModule, HttpModule.registerAsync(asyncOptions)],
      providers: [TeamtailorService],
      exports: [TeamtailorService],
    };
  }
}
