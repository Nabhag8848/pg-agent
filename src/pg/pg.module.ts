import { Module } from '@nestjs/common';
import { PgService } from './pg.service.js';

@Module({
  providers: [PgService],
  exports: [PgService],
})
export class PgModule {}
