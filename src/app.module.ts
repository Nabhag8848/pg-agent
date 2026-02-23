import { Module } from '@nestjs/common';
import { HelloWorldCommand } from './hello-world/hello-world.command.js';

@Module({
  providers: [HelloWorldCommand],
})
export class AppModule {}
