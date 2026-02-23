import 'reflect-metadata';
import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module.js';
import { config } from 'dotenv';
config();

void (async () => {
  await CommandFactory.run(AppModule);
})();
