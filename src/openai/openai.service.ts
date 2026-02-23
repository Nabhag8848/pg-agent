import { Injectable } from '@nestjs/common';
import { Agent, run } from '@openai/agents';

@Injectable()
export class OpenAIService {
  async run<TAgent extends Agent<unknown, any>>(agent: TAgent, input: string) {
    return run(agent, input);
  }
}
