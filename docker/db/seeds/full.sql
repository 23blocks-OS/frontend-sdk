-- Full seed data for SDK integration tests (Tier 3)
-- This file contains comprehensive data for workflow and edge case tests
--
-- NOTE: This is a template. You will need to update this file with
-- the actual schema and data that matches your Rails API.

-- ============================================================================
-- IMPORTANT: Replace this template with your actual database schema and data
-- ============================================================================

-- Include base seed data first
-- \i /docker-entrypoint-initdb.d/base.sql

-- Additional users for workflow tests
-- INSERT INTO users (id, email, encrypted_password, first_name, last_name, created_at, updated_at)
-- VALUES
--   ('usr-wf-001', 'workflow-user-1@example.com', '$2a$12$...', 'Workflow', 'One', NOW(), NOW()),
--   ('usr-wf-002', 'workflow-user-2@example.com', '$2a$12$...', 'Workflow', 'Two', NOW(), NOW()),
--   ('usr-wf-003', 'workflow-user-3@example.com', '$2a$12$...', 'Workflow', 'Three', NOW(), NOW());

-- Products for search tests
-- INSERT INTO products (id, name, description, price, created_at, updated_at)
-- VALUES
--   ('prod-001', 'Test Product One', 'A searchable product description', 99.99, NOW(), NOW()),
--   ('prod-002', 'Test Product Two', 'Another searchable item for testing', 149.99, NOW(), NOW()),
--   ('prod-003', 'Premium Widget', 'High-quality widget for premium customers', 299.99, NOW(), NOW());

-- CRM contacts for multi-block workflow tests
-- INSERT INTO contacts (id, first_name, last_name, email, phone, created_at, updated_at)
-- VALUES
--   ('contact-001', 'John', 'Doe', 'john.doe@example.com', '+1-555-0101', NOW(), NOW()),
--   ('contact-002', 'Jane', 'Smith', 'jane.smith@example.com', '+1-555-0102', NOW(), NOW()),
--   ('contact-003', 'Bob', 'Johnson', 'bob.johnson@example.com', '+1-555-0103', NOW(), NOW());

-- Content items
-- INSERT INTO content_items (id, title, body, status, created_at, updated_at)
-- VALUES
--   ('content-001', 'Test Article One', 'Content body for the first test article', 'published', NOW(), NOW()),
--   ('content-002', 'Test Article Two', 'Content body for the second test article', 'draft', NOW(), NOW());

-- Placeholder to ensure the file is valid SQL
SELECT 'Full seed data loaded' AS status;
