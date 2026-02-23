import 'reflect-metadata';
import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module.js';

void (async () => {
  await CommandFactory.run(AppModule);
})();
