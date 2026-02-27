import { Injectable } from '@nestjs/common';
import { Agent, tool } from '@openai/agents';
import { z } from 'zod';
import { OpenAIService } from '../openai/openai.service.js';
import { PgService } from '../pg/pg.service.js';
import { Classification } from '../classifier/classifier.service.js';

const ANALYST_ROLE = `I am the Analyst Agent. My job is to analyse your PostgreSQL database — I fetch the live schema, generate SQL from your natural language question, execute it, and explain the results in plain English.`;

@Injectable()
export class AnalystService {
  constructor(
    private readonly openai: OpenAIService,
    private readonly pg: PgService,
  ) {}

  async analyse(
    query: string,
    classification: Classification,
  ): Promise<string> {
    if (!classification.isDbQuery) {
      return ANALYST_ROLE;
    }

    const schema = await this.pg.getSchema();

    const executeSql = tool({
      name: 'execute_sql',
      description:
        'Execute a SQL query against the PostgreSQL database and return the results as JSON.',
      parameters: z.object({
        sql: z.string().describe('The SQL query to execute'),
      }),
      execute: async ({ sql }) => {
        try {
          const result = await this.pg.executeQuery(sql);
          return JSON.stringify(result);
        } catch (err) {
          return JSON.stringify({
            error: err instanceof Error ? err.message : String(err),
          });
        }
      },
    });

    const agent = new Agent({
      name: 'Analyst Agent',
      model: 'gpt-4o-mini',
      instructions: `You are an Analyst Agent for a PostgreSQL database tool. You convert natural language questions into SQL, execute them using the execute_sql tool, and explain the results in clear, concise natural language.

Rules:
- Study the schema provided in the user message before writing any SQL.
- Do not invent table or column names not present in the schema.
- For queries that could return many rows (e.g. "show all users", "list all orders", "get all products"):
    1. First call execute_sql with a COUNT query to get the total number of matching rows.
    2. Then call execute_sql with the main SELECT query adding LIMIT 10.
    3. In your response state the total count and summarise the first 10 rows.
- For aggregate queries (totals, averages, single counts) just run the query directly.
- If the schema lacks the required tables or columns, explain clearly why you cannot answer.
- Always respond in plain English. Never show raw SQL or JSON to the user.`,
      tools: [executeSql],
    });

    const input = `Database schema:\n${schema}\n\nUser question: ${query}`;
    const result = await this.openai.run(agent, input);
    return (result.finalOutput as string) ?? 'No response from analyst agent.';
  }
}
