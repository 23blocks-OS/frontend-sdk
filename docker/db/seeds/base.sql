-- Base seed data for SDK integration tests (Tier 2)
-- This file contains minimal data required for basic CRUD tests
--
-- NOTE: This is a template. You will need to update this file with
-- the actual schema and data that matches your Rails API.

-- ============================================================================
-- IMPORTANT: Replace this template with your actual database schema and data
-- ============================================================================

-- Example: Create test users (update to match your actual users table)
-- INSERT INTO users (id, email, encrypted_password, first_name, last_name, created_at, updated_at)
-- VALUES
--   (
--     'usr-test-001',
--     'seeded-user@example.com',
--     '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G8e6E8eb5J5Gxy', -- TestPassword123!
--     'Seeded',
--     'User',
--     NOW(),
--     NOW()
--   ),
--   (
--     'usr-test-002',
--     'existing@example.com',
--     '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G8e6E8eb5J5Gxy', -- TestPassword123!
--     'Existing',
--     'User',
--     NOW(),
--     NOW()
--   );

-- Example: Create test app (update to match your actual apps table)
-- INSERT INTO apps (id, name, app_id, created_at, updated_at)
-- VALUES
--   (
--     'app-test-001',
--     'SDK Test App',
--     'test-app-id',
--     NOW(),
--     NOW()
--   );

-- Placeholder to ensure the file is valid SQL
SELECT 'Base seed data loaded' AS status;
