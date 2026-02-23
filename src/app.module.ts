import { Module } from '@nestjs/common';
import { ExampleCommand } from './example/example.command.js';
import { StartCommand } from './app/start.command.js';
import { ClassifierModule } from './classifier/classifier.module.js';

@Module({
  imports: [ClassifierModule],
  providers: [ExampleCommand, StartCommand],
})
export class AppModule {}
