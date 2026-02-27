-- ============================================================
-- pg-agent demo schema: e-commerce store
-- ============================================================

-- Users
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100)        NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  country    VARCHAR(60),
  created_at TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(200)       NOT NULL,
  category   VARCHAR(100),
  price      NUMERIC(10, 2)     NOT NULL,
  stock_qty  INTEGER            NOT NULL DEFAULT 0
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER            NOT NULL REFERENCES users(id),
  status     VARCHAR(50)        NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INTEGER            NOT NULL REFERENCES orders(id),
  product_id INTEGER            NOT NULL REFERENCES products(id),
  quantity   INTEGER            NOT NULL,
  unit_price NUMERIC(10, 2)     NOT NULL
);

-- ============================================================
-- Seed data
-- ============================================================

INSERT INTO users (name, email, country, created_at) VALUES
  ('Alice Martin',   'alice@example.com',   'US', '2024-01-10 08:00:00+00'),
  ('Bob Singh',      'bob@example.com',     'IN', '2024-01-15 09:30:00+00'),
  ('Clara Liu',      'clara@example.com',   'CN', '2024-01-22 11:00:00+00'),
  ('David Okafor',   'david@example.com',   'NG', '2024-02-03 14:00:00+00'),
  ('Eva Schmidt',    'eva@example.com',     'DE', '2024-02-14 10:00:00+00'),
  ('Frank Rossi',    'frank@example.com',   'IT', '2024-03-01 08:00:00+00'),
  ('Grace Kim',      'grace@example.com',   'KR', '2024-03-18 09:00:00+00'),
  ('Henry Park',     'henry@example.com',   'KR', '2024-04-02 07:30:00+00'),
  ('Isabela Costa',  'isabela@example.com', 'BR', '2024-04-20 13:00:00+00'),
  ('James Lee',      'james@example.com',   'US', '2024-05-05 15:00:00+00')
ON CONFLICT DO NOTHING;

INSERT INTO products (name, category, price, stock_qty) VALUES
  ('Wireless Headphones',  'Electronics',  89.99,  120),
  ('Mechanical Keyboard',  'Electronics', 129.00,   80),
  ('USB-C Hub',            'Electronics',  39.99,  200),
  ('Desk Lamp',            'Home Office',  49.95,   60),
  ('Ergonomic Chair',      'Home Office', 349.00,   25),
  ('Running Shoes',        'Sports',       79.99,  150),
  ('Yoga Mat',             'Sports',       24.99,  300),
  ('Water Bottle',         'Sports',       18.50,  400),
  ('Notebook (A5)',        'Stationery',    8.99,  500),
  ('Ballpoint Pens (10pk)','Stationery',    4.50,  600)
ON CONFLICT DO NOTHING;

INSERT INTO orders (user_id, status, created_at) VALUES
  (1, 'completed', '2024-11-05 10:00:00+00'),
  (1, 'completed', '2024-12-20 11:00:00+00'),
  (2, 'completed', '2024-11-12 09:00:00+00'),
  (3, 'shipped',   '2025-01-03 14:00:00+00'),
  (3, 'completed', '2025-01-18 16:00:00+00'),
  (4, 'pending',   '2025-01-25 08:30:00+00'),
  (5, 'completed', '2025-02-01 12:00:00+00'),
  (6, 'completed', '2025-02-10 09:00:00+00'),
  (7, 'shipped',   '2025-02-14 11:30:00+00'),
  (8, 'completed', '2025-02-18 15:00:00+00'),
  (9, 'pending',   '2025-02-22 10:00:00+00'),
  (10,'completed', '2025-02-25 13:00:00+00')
ON CONFLICT DO NOTHING;

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
  -- order 1 (Alice, Nov 2024)
  (1, 1, 1,  89.99),
  (1, 3, 2,  39.99),
  -- order 2 (Alice, Dec 2024)
  (2, 2, 1, 129.00),
  (2, 4, 1,  49.95),
  -- order 3 (Bob, Nov 2024)
  (3, 5, 1, 349.00),
  -- order 4 (Clara, Jan 2025)
  (4, 6, 2,  79.99),
  (4, 8, 1,  18.50),
  -- order 5 (Clara, Jan 2025)
  (5, 9, 5,   8.99),
  (5,10, 3,   4.50),
  -- order 6 (David, Jan 2025, pending)
  (6, 7, 1,  24.99),
  -- order 7 (Eva, Feb 2025)
  (7, 1, 1,  89.99),
  (7, 2, 1, 129.00),
  -- order 8 (Frank, Feb 2025)
  (8, 3, 3,  39.99),
  (8, 4, 2,  49.95),
  -- order 9 (Grace, Feb 2025)
  (9, 6, 1,  79.99),
  -- order 10 (Henry, Feb 2025)
  (10,1, 2,  89.99),
  (10,7, 1,  24.99),
  -- order 11 (Isabela, Feb 2025, pending)
  (11,8, 4,  18.50),
  (11,9, 2,   8.99),
  -- order 12 (James, Feb 2025)
  (12,2, 1, 129.00),
  (12,5, 1, 349.00)
ON CONFLICT DO NOTHING;
