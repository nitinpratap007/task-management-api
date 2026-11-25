-- ============================================================================
-- verification_queries.sql
-- Verification queries for task_management_design_db (practice database only)
-- Run AFTER schema.sql and sample_data.sql.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. List all application tables
-- ----------------------------------------------------------------------------
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ----------------------------------------------------------------------------
-- 2. Record counts per table
-- ----------------------------------------------------------------------------
SELECT 'users'            AS table_name, COUNT(*) AS row_count FROM users
UNION ALL SELECT 'projects',        COUNT(*) FROM projects
UNION ALL SELECT 'project_members', COUNT(*) FROM project_members
UNION ALL SELECT 'tasks',           COUNT(*) FROM tasks
UNION ALL SELECT 'task_assignees',  COUNT(*) FROM task_assignees
UNION ALL SELECT 'comments',        COUNT(*) FROM comments
UNION ALL SELECT 'labels',          COUNT(*) FROM labels
UNION ALL SELECT 'task_labels',     COUNT(*) FROM task_labels
ORDER BY table_name;

-- ----------------------------------------------------------------------------
-- 3. Project owners
-- ----------------------------------------------------------------------------
SELECT p.id   AS project_id,
       p.name AS project_name,
       u.id   AS owner_id,
       u.name AS owner_name,
       u.email AS owner_email
FROM projects p
JOIN users u ON u.id = p.owner_id
ORDER BY p.id;

-- ----------------------------------------------------------------------------
-- 4. Project members
-- ----------------------------------------------------------------------------
SELECT pm.project_id,
       p.name AS project_name,
       pm.user_id,
       u.name AS member_name,
       pm.role,
       pm.joined_at
FROM project_members pm
JOIN projects p ON p.id = pm.project_id
JOIN users u    ON u.id = pm.user_id
ORDER BY pm.project_id, pm.user_id;

-- ----------------------------------------------------------------------------
-- 5. Tasks and their creators
-- ----------------------------------------------------------------------------
SELECT t.id       AS task_id,
       t.title,
       t.completed,
       t.priority,
       t.project_id,
       u.id       AS creator_id,
       u.name     AS creator_name
FROM tasks t
JOIN users u ON u.id = t.user_id
ORDER BY t.id;

-- ----------------------------------------------------------------------------
-- 6. Task assignments (M:N)
-- ----------------------------------------------------------------------------
SELECT ta.task_id,
       t.title AS task_title,
       ta.user_id,
       u.name  AS assignee_name
FROM task_assignees ta
JOIN tasks t ON t.id = ta.task_id
JOIN users u  ON u.id = ta.user_id
ORDER BY ta.task_id, ta.user_id;

-- ----------------------------------------------------------------------------
-- 7. Comments with task and author
-- ----------------------------------------------------------------------------
SELECT c.id         AS comment_id,
       c.task_id,
       t.title      AS task_title,
       c.user_id    AS author_id,
       u.name       AS author_name,
       c.content,
       c.created_at
FROM comments c
JOIN tasks t ON t.id = c.task_id
JOIN users u  ON u.id = c.user_id
ORDER BY c.id;

-- ----------------------------------------------------------------------------
-- 8. Task labels with project consistency check
--    The second query must return ZERO rows.
-- ----------------------------------------------------------------------------
SELECT tl.task_id,
       t.title      AS task_title,
       tl.label_id,
       l.name       AS label_name,
       tl.project_id
FROM task_labels tl
JOIN tasks t  ON t.id = tl.task_id
JOIN labels l ON l.id = tl.label_id
ORDER BY tl.task_id, tl.label_id;

SELECT tl.task_id, tl.label_id
FROM task_labels tl
JOIN tasks  t ON t.id = tl.task_id
JOIN labels l ON l.id = tl.label_id
WHERE t.project_id IS DISTINCT FROM tl.project_id
   OR l.project_id IS DISTINCT FROM tl.project_id
   OR t.project_id IS DISTINCT FROM l.project_id;
-- Expected: 0 rows

-- ----------------------------------------------------------------------------
-- 9. Indexes in the public schema
-- ----------------------------------------------------------------------------
SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ----------------------------------------------------------------------------
-- 10. Foreign keys in the public schema
-- ----------------------------------------------------------------------------
SELECT tc.table_name,
       kcu.column_name,
       ccu.table_name  AS foreign_table_name,
       ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
 AND tc.table_schema   = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
 AND ccu.table_schema   = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema     = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- ----------------------------------------------------------------------------
-- 11. Labels per project
-- ----------------------------------------------------------------------------
SELECT p.id   AS project_id,
       p.name AS project_name,
       l.id   AS label_id,
       l.name AS label_name,
       l.color
FROM projects p
LEFT JOIN labels l ON l.project_id = p.id
ORDER BY p.id, l.id;

-- ----------------------------------------------------------------------------
-- NEGATIVE / CONSTRAINT TESTS (wrapped so the script does not abort)
-- Each block is expected to raise an error and print a PASS notice.
-- ----------------------------------------------------------------------------

-- 12. Invalid foreign key: task with non-existent user
DO $$
BEGIN
    INSERT INTO tasks (user_id, title) VALUES (999999, 'FK violation test');
    RAISE EXCEPTION 'FAIL: invalid user_id was accepted';
EXCEPTION WHEN foreign_key_violation THEN
    RAISE NOTICE 'PASS: invalid user_id rejected by foreign key';
END $$;

-- 13. Duplicate primary key on users
DO $$
BEGIN
    INSERT INTO users (id, name, email, password_hash)
    VALUES (1, 'Dup', 'dup@example.com', 'x');
    RAISE EXCEPTION 'FAIL: duplicate PK was accepted';
EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'PASS: duplicate users.id rejected';
END $$;

-- 14. Duplicate junction row (project_members)
DO $$
BEGIN
    INSERT INTO project_members (project_id, user_id, role)
    VALUES (1, 2, 'member');
    RAISE EXCEPTION 'FAIL: duplicate membership was accepted';
EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'PASS: duplicate project_members row rejected';
END $$;

-- 15. Invalid status value (CHECK constraint)
DO $$
BEGIN
    INSERT INTO projects (owner_id, name, status)
    VALUES (1, 'Bad status project', 'deleted');
    RAISE EXCEPTION 'FAIL: invalid status was accepted';
EXCEPTION WHEN check_violation THEN
    RAISE NOTICE 'PASS: invalid project status rejected';
END $$;

-- 16. Invalid label colour (CHECK constraint)
DO $$
BEGIN
    INSERT INTO labels (project_id, name, color)
    VALUES (1, 'badcolour', '#GGGGGG');
    RAISE EXCEPTION 'FAIL: invalid colour was accepted';
EXCEPTION WHEN check_violation THEN
    RAISE NOTICE 'PASS: invalid label colour rejected';
END $$;

-- 17. Invalid task/label project mismatch (composite FK)
DO $$
BEGIN
    INSERT INTO tasks (id, user_id, project_id, title)
    VALUES (9001, 1, 1, 'Mismatch task');
    INSERT INTO labels (id, project_id, name, color)
    VALUES (9001, 2, 'mismatch-label', '#123456');
    INSERT INTO task_labels (task_id, label_id, project_id)
    VALUES (9001, 9001, 1);  -- label actually belongs to project 2
    RAISE EXCEPTION 'FAIL: mismatched task/label project was accepted';
EXCEPTION WHEN foreign_key_violation THEN
    RAISE NOTICE 'PASS: task/label project mismatch rejected';
END $$;

-- 18. Duplicate user email (UNIQUE constraint)
DO $$
BEGIN
    INSERT INTO users (name, email, password_hash)
    VALUES ('Dup Email', 'alice@example.com', 'x');
    RAISE EXCEPTION 'FAIL: duplicate email was accepted';
EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'PASS: duplicate email rejected';
END $$;
