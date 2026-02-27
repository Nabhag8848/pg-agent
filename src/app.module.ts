import { Module } from '@nestjs/common';
import { ExampleCommand } from './example/example.command.js';
import { StartCommand } from './app/start.command.js';
import { ClassifierModule } from './classifier/classifier.module.js';
import { AnalystModule } from './analyst/analyst.module.js';

@Module({
  imports: [ClassifierModule, AnalystModule],
  providers: [ExampleCommand, StartCommand],
})
export class AppModule {}
