# pg-agent

A terminal-based AI agent that lets you query your PostgreSQL database in plain English. Type a natural language question, and pg-agent classifies it, fetches the live schema, generates SQL, executes it, and explains the results — all in your terminal.

## How it works

```
User input
    │
    ▼
┌─────────────────┐
│ Classifier Agent│  Is this a DB query? Is it read-only?
└────────┬────────┘
         │ isDbQuery = true
         ▼
┌─────────────────┐
│  Analyst Agent  │  1. Fetch live schema from PostgreSQL
│                 │  2. Generate SQL from natural language
│   execute_sql   │  3. Execute SQL via tool call
│     (tool)      │  4. Return results in plain English
└─────────────────┘
         │ isDbQuery = false
         ▼
    "I am the Analyst Agent. My job is..."
```

**Classifier Agent** — decides whether the input is a database query and whether it is read-only or mutating.

**Analyst Agent** — given the live schema and user question, generates SQL, runs it against the database using the `execute_sql` tool, and explains the results in natural language. For queries that could return many rows it automatically runs a count first and limits results to 10.

## Prerequisites

- Node.js 20+
- pnpm
- Docker (for the local PostgreSQL instance)
- An OpenAI API key

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and fill in your OpenAI API key:

```env
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pg_agent
```

### 3. Start PostgreSQL

```bash
docker compose up -d
```

### 4. Run migrations and seed data

```bash
./scripts/migrate.sh
```

This creates four tables (`users`, `products`, `orders`, `order_items`) and seeds them with demo data.

### 5. Start pg-agent

```bash
pnpm start
```

## Example queries

### Users
```
how many users do we have?
show me all users from South Korea
which users signed up in January 2024?
```

### Products
```
show me all products in the Electronics category
which products have fewer than 100 units in stock?
what is the most expensive product we sell?
```

### Orders
```
how many orders were placed in February 2025?
show me all pending orders
how many orders does each user have?
```

### Revenue & sales
```
what is the total revenue from completed orders?
which product generated the most revenue?
show me the top 3 best-selling products by quantity sold
what is the average order value?
```

### Customer insights
```
who are the top 5 customers by total spend?
which users have never placed an order?
show me all orders placed by Alice Martin
```

See [`scripts/example-queries.md`](scripts/example-queries.md) for the full list.

## Project structure

```
src/
├── classifier/        # Classifier Agent — labels input as DB query or not
├── analyst/           # Analyst Agent — schema → SQL → execute → NL response
├── pg/                # PostgreSQL service (schema fetch + query execution)
├── openai/            # Shared OpenAI runner
└── app/               # Ink terminal UI + NestJS command entry point

scripts/
├── migrate.sql        # DDL + seed data
└── migrate.sh         # Runs migrate.sql inside the Docker container

docker-compose.yml     # PostgreSQL 16 service
```

## Tech stack

| Layer | Technology |
|---|---|
| CLI framework | [NestJS](https://nestjs.com) + [nest-commander](https://nest-commander.jaymcdoniel.dev) |
| Terminal UI | [Ink](https://github.com/vadimdemedes/ink) (React for CLIs) |
| AI agents | [OpenAI Agents SDK](https://github.com/openai/openai-agents-js) |
| Database | PostgreSQL 16 via [node-postgres](https://node-postgres.com) |
| Schema validation | [Zod](https://zod.dev) |
