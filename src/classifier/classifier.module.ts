import { Module } from '@nestjs/common';
import { OpenAIModule } from '../openai/openai.module.js';
import { ClassifierService } from './classifier.service.js';

@Module({
  imports: [OpenAIModule],
  providers: [ClassifierService],
  exports: [ClassifierService],
})
export class ClassifierModule {}
