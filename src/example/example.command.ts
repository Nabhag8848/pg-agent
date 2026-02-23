import { Command, CommandRunner } from 'nest-commander';
import { render } from 'ink';
import Example from './example.js';

@Command({ name: 'example', description: 'example command' })
export class ExampleCommand extends CommandRunner {
  async run(): Promise<void> {
    const { unmount, waitUntilExit } = render(Example);
    setTimeout(unmount, 1000);
    await waitUntilExit();
  }
}
