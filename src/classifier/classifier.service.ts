import { Injectable } from '@nestjs/common';
import { Agent } from '@openai/agents';
import { z } from 'zod';
import { OpenAIService } from '../openai/openai.service.js';

const ClassificationSchema = z.object({
  isDbQuery: z
    .boolean()
    .describe(
      'True if the natural language query intends to retrieve or modify data in a database',
    ),
  isReadOnly: z
    .boolean()
    .describe(
      'True if the intent is to read or analyse data only (show, list, count, summarise). False if the intent is to change data (delete, update, add, create)',
    ),
});

export type Classification = z.infer<typeof ClassificationSchema>;

@Injectable()
export class ClassifierService {
  private readonly agent: Agent<any, typeof ClassificationSchema>;

  constructor(private readonly openai: OpenAIService) {
    this.agent = new Agent({
      name: 'Query Classifier',
      model: 'gpt-4o-mini',
      instructions: `You classify natural language queries entered by users into a PostgreSQL data analysis tool.

      Users will type things like:
      - "show me all orders from last week"
      - "how many users signed up in January?"
      - "delete all inactive accounts"
      - "what is the total revenue this month?"
      - "add a new product called X"
          
      Determine two things:
      - isDbQuery: true if the user's intent is to retrieve or change data stored in a database (e.g. asking about records, counts, trends, summaries, or requesting data changes). False for unrelated questions like greetings or help requests.
      - isReadOnly: true if the intent is purely to read or analyse data (e.g. show, list, count, find, summarise, compare). False if the intent is to change data (e.g. delete, remove, update, add, insert, create, drop).
          
      If isDbQuery is false, isReadOnly must also be false.`,
      outputType: ClassificationSchema,
    });
  }

  async classify(query: string): Promise<Classification> {
    const result = await this.openai.run(this.agent, query);
    return result.finalOutput as Classification;
  }
}
