-- ============================================================================
-- sample_data.sql
-- Realistic dummy data for task_management_design_db (practice database only)
-- Run AFTER schema.sql.
-- No real passwords or credentials are included.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- users
-- password_hash values are obviously dummy placeholders, not usable hashes.
-- ----------------------------------------------------------------------------
INSERT INTO users (id, name, email, password_hash, is_verified) VALUES
    (1, 'Alice Anderson', 'alice@example.com', 'DUMMY_HASH_NOT_A_REAL_PASSWORD_1', TRUE),
    (2, 'Bob Brown',      'bob@example.com',   'DUMMY_HASH_NOT_A_REAL_PASSWORD_2', TRUE),
    (3, 'Carol Clark',    'carol@example.com', 'DUMMY_HASH_NOT_A_REAL_PASSWORD_3', FALSE);

-- ----------------------------------------------------------------------------
-- projects
-- ----------------------------------------------------------------------------
INSERT INTO projects (id, owner_id, name, description, status) VALUES
    (1, 1, 'Website Redesign', 'Redesign the company marketing website', 'active'),
    (2, 2, 'Mobile App',       'Build the new mobile companion app',      'active');

-- ----------------------------------------------------------------------------
-- project_members  (M:N projects <-> users)
-- ----------------------------------------------------------------------------
INSERT INTO project_members (project_id, user_id, role) VALUES
    (1, 1, 'owner'),
    (1, 2, 'member'),
    (1, 3, 'viewer'),
    (2, 2, 'owner'),
    (2, 1, 'admin');

-- ----------------------------------------------------------------------------
-- tasks
--    user_id    = creator/owner (existing API semantics)
--    project_id = NULL for personal tasks
-- ----------------------------------------------------------------------------
INSERT INTO tasks (id, user_id, project_id, title, description, completed, priority, due_date) VALUES
    (1, 1, NULL, 'Buy groceries',            'Milk, eggs, bread',               FALSE, 'low',    NULL),
    (2, 1, 1,    'Design new homepage',     'Wireframe and mockups',           FALSE, 'high',   '2026-12-01 17:00:00+00'),
    (3, 2, 1,    'Implement login page',    'HTML/CSS/JS for login',           FALSE, 'medium', '2026-12-05 17:00:00+00'),
    (4, 2, 2,    'Set up React Native',     'Project scaffolding',             TRUE,  'medium', NULL),
    (5, 3, 2,    'Write API documentation', 'OpenAPI spec for mobile endpoints',FALSE, 'low',    '2026-12-10 17:00:00+00');

-- ----------------------------------------------------------------------------
-- task_assignees  (M:N tasks <-> users)
-- ----------------------------------------------------------------------------
INSERT INTO task_assignees (task_id, user_id) VALUES
    (2, 2),
    (2, 3),
    (3, 1),
    (4, 3),
    (5, 1);

-- ----------------------------------------------------------------------------
-- comments
-- ----------------------------------------------------------------------------
INSERT INTO comments (id, task_id, user_id, content) VALUES
    (1, 1, 1, 'Don''t forget the cheese!'),
    (2, 2, 1, 'First draft of wireframe is ready.'),
    (3, 2, 2, 'Looks good, please add mobile view.'),
    (4, 4, 3, 'Done and pushed to main.');

-- ----------------------------------------------------------------------------
-- labels  (project-specific)
-- ----------------------------------------------------------------------------
INSERT INTO labels (id, project_id, name, color) VALUES
    (1, 1, 'frontend', '#3B82F6'),
    (2, 1, 'backend',  '#10B981'),
    (3, 1, 'bug',      '#EF4444'),
    (4, 2, 'ui',       '#8B5CF6'),
    (5, 2, 'api',      '#F59E0B');

-- ----------------------------------------------------------------------------
-- task_labels  (M:N tasks <-> labels), same project enforced
-- ----------------------------------------------------------------------------
INSERT INTO task_labels (task_id, label_id, project_id) VALUES
    (2, 1, 1),   -- Design new homepage -> frontend
    (2, 3, 1),   -- Design new homepage -> bug
    (3, 2, 1),   -- Implement login page -> backend
    (4, 4, 2),   -- Set up React Native -> ui
    (5, 5, 2);   -- Write API documentation -> api

-- ----------------------------------------------------------------------------
-- Reset sequences so future inserts get fresh IDs
-- ----------------------------------------------------------------------------
SELECT setval('users_id_seq',          (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval('projects_id_seq',       (SELECT COALESCE(MAX(id), 1) FROM projects));
SELECT setval('tasks_id_seq',          (SELECT COALESCE(MAX(id), 1) FROM tasks));
SELECT setval('comments_id_seq',       (SELECT COALESCE(MAX(id), 1) FROM comments));
SELECT setval('labels_id_seq',         (SELECT COALESCE(MAX(id), 1) FROM labels));
