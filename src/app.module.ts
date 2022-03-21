import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { ConfigEnum } from './config/config.enum';
import { TeamtailorModule } from './teamtailor/teamtailor.module';
import { CsvGeneratorModule } from './csv-generator/csv-generator.module';
import { resolve } from 'path';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.load(
      resolve(__dirname, 'config', '**/!(*.d).config.{ts,js}'),
      {
        modifyConfigName: (name) => name.replace('.config', ''),
      },
    ),
    TeamtailorModule.forRootAsync({
      useFactory: (config: ConfigService) => config.get(ConfigEnum.teamtailor),
      inject: [ConfigService],
    }),
    CsvGeneratorModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
