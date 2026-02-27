import { Module } from '@nestjs/common';
import { OpenAIModule } from '../openai/openai.module.js';
import { PgModule } from '../pg/pg.module.js';
import { AnalystService } from './analyst.service.js';

@Module({
  imports: [OpenAIModule, PgModule],
  providers: [AnalystService],
  exports: [AnalystService],
})
export class AnalystModule {}
