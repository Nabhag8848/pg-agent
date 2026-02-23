import { Module } from '@nestjs/common';
import { ExampleCommand } from './example/example.command.js';

@Module({
  providers: [ExampleCommand],
})
export class AppModule {}
