-- ============================
-- SUPER ADMIN
-- ============================
INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  NULL,
  'superadmin@system.com',
  '$2b$10$Q9o7cXJYx1Yy7G1U5n9qUeZkN5xkP4YQK5vWv8x3QYy5r9KZlN9aS',
  'Super Admin',
  'super_admin'
)
ON CONFLICT DO NOTHING;

-- ============================
-- TENANT
-- ============================
INSERT INTO tenants (id, name, subdomain, subscription_plan, max_users, max_projects)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Demo Company',
  'demo',
  'pro',
  25,
  15
)
ON CONFLICT DO NOTHING;

-- ============================
-- TENANT ADMIN
-- ============================
INSERT INTO users (id, tenant_id, email, password_hash, full_name, role)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  'admin@demo.com',
  '$2b$10$Q9o7cXJYx1Yy7G1U5n9qUeZkN5xkP4YQK5vWv8x3QYy5r9KZlN9aS',
  'Demo Admin',
  'tenant_admin'
)
ON CONFLICT DO NOTHING;
