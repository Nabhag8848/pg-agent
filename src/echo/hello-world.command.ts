import { Command, CommandRunner } from 'nest-commander';
import { render } from 'ink';
import HelloWorld from './hello-world.js';

@Command({ name: 'helloworld', options: { isDefault: true } })
export class HelloWorldCommand extends CommandRunner {
  async run() {
    const { unmount, waitUntilExit } = render(HelloWorld);
    unmount();
    await waitUntilExit();
  }
}
