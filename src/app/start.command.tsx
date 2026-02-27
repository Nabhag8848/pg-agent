import React from 'react';
import { render } from 'ink';
import { Command, CommandRunner } from 'nest-commander';
import { ClassifierService } from '../classifier/classifier.service.js';
import { AnalystService } from '../analyst/analyst.service.js';
import App from './app.js';

@Command({
  name: 'start',
  options: { isDefault: true },
  description: 'start pg-agent',
})
export class StartCommand extends CommandRunner {
  constructor(
    private readonly classifier: ClassifierService,
    private readonly analyst: AnalystService,
  ) {
    super();
  }

  async run(): Promise<void> {
    const handleSubmit = async (query: string): Promise<string> => {
      const classification = await this.classifier.classify(query);
      return this.analyst.analyse(query, classification);
    };

    const { waitUntilExit } = render(<App onSubmit={handleSubmit} />);
    await waitUntilExit();
  }
}
