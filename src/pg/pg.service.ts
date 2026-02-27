import { Injectable } from '@nestjs/common';
import { Client, QueryResult } from 'pg';

@Injectable()
export class PgService {
  async getSchema(): Promise<string> {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    try {
      const { rows } = await client.query<{
        table_name: string;
        column_name: string;
        data_type: string;
        is_nullable: string;
      }>(`
        SELECT table_name, column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public'
        ORDER BY table_name, ordinal_position
      `);

      if (rows.length === 0) {
        return 'No tables found in the public schema.';
      }

      const tables = new Map<string, string[]>();
      for (const row of rows) {
        if (!tables.has(row.table_name)) {
          tables.set(row.table_name, []);
        }
        const nullable = row.is_nullable === 'YES' ? ' (nullable)' : '';
        tables
          .get(row.table_name)!
          .push(`  ${row.column_name}: ${row.data_type}${nullable}`);
      }

      const lines: string[] = [];
      for (const [table, columns] of tables) {
        lines.push(`Table: ${table}`);
        lines.push(...columns);
        lines.push('');
      }

      return lines.join('\n').trim();
    } finally {
      await client.end();
    }
  }

  async executeQuery(
    sql: string,
  ): Promise<{ columns: string[]; rows: Record<string, unknown>[] }> {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    try {
      const result: QueryResult = await client.query(sql);
      return {
        columns: result.fields.map((f) => f.name),
        rows: result.rows as Record<string, unknown>[],
      };
    } finally {
      await client.end();
    }
  }
}
