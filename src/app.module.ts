import { Module } from '@nestjs/common';
import { HelloWorldCommand } from './echo/hello-world.command.js';

@Module({
  providers: [HelloWorldCommand],
})
export class AppModule {}
