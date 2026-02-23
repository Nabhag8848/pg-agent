import React from 'react';
import { render } from 'ink';
import { Command, CommandRunner } from 'nest-commander';
import { ClassifierService } from '../classifier/classifier.service.js';
import App from './app.js';

@Command({
  name: 'start',
  options: { isDefault: true },
  description: 'start pg-agent',
})
export class StartCommand extends CommandRunner {
  constructor(private readonly classifier: ClassifierService) {
    super();
  }

  async run(): Promise<void> {
    const handleSubmit = (query: string) => this.classifier.classify(query);

    const { waitUntilExit } = render(<App onSubmit={handleSubmit} />);
    await waitUntilExit();
  }
}
