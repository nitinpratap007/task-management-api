-- ============================================================================
-- schema.sql
-- Normalised relational database schema for the Task Management System
-- Database (practice only): task_management_design_db
-- Target: PostgreSQL 14+
--
-- SAFETY: Run this ONLY against a local/practice database.
--         Never run against the production application database.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Helper function: automatically maintain updated_at on row updates
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 1. users
--    Stores account information. One row per registered user.
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id                      BIGSERIAL PRIMARY KEY,
    name                    VARCHAR(100)  NOT NULL,
    email                   VARCHAR(255)  NOT NULL UNIQUE,
    password_hash           TEXT          NOT NULL,
    is_verified             BOOLEAN       NOT NULL DEFAULT FALSE,
    verification_token_hash TEXT,
    verification_token_expiry TIMESTAMPTZ,
    reset_token_hash        TEXT,
    reset_token_expiry      TIMESTAMPTZ,
    created_at              TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- 2. projects
--    A project is owned by exactly one user (owner_id).
-- ============================================================================
CREATE TABLE IF NOT EXISTS projects (
    id          BIGSERIAL PRIMARY KEY,
    owner_id    BIGINT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(150)  NOT NULL,
    description TEXT          NOT NULL DEFAULT '',
    status      VARCHAR(20)   NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'archived', 'completed')),
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- 3. project_members  (M:N between projects and users)
--    Composite PK prevents a user being added to the same project twice.
-- ============================================================================
CREATE TABLE IF NOT EXISTS project_members (
    project_id  BIGINT        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id     BIGINT        NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
    role        VARCHAR(20)   NOT NULL DEFAULT 'member'
                    CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    joined_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    PRIMARY KEY (project_id, user_id)
);

-- ============================================================================
-- 4. tasks
--    user_id  = creator/owner of the task (preserves existing API behaviour).
--    project_id is NULL for personal tasks, or references a project.
-- ============================================================================
CREATE TABLE IF NOT EXISTS tasks (
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT        NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
    project_id    BIGINT                 REFERENCES projects(id) ON DELETE CASCADE,
    title         VARCHAR(255)  NOT NULL,
    description   TEXT          NOT NULL DEFAULT '',
    completed     BOOLEAN       NOT NULL DEFAULT FALSE,
    priority      VARCHAR(10)   NOT NULL DEFAULT 'medium'
                      CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date      TIMESTAMPTZ,
    reminder_sent BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    -- Composite key support: allows task_labels to enforce "same project"
    CONSTRAINT uq_tasks_id_project UNIQUE (id, project_id)
);

CREATE TRIGGER trg_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- 5. task_assignees  (M:N between tasks and users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS task_assignees (
    task_id     BIGINT        NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id     BIGINT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    PRIMARY KEY (task_id, user_id)
);

-- ============================================================================
-- 6. comments
--    One task has many comments; each comment is written by one user.
-- ============================================================================
CREATE TABLE IF NOT EXISTS comments (
    id         BIGSERIAL PRIMARY KEY,
    task_id    BIGINT        NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id    BIGINT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content    TEXT          NOT NULL,
    created_at TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- 7. labels
--    Labels are project-specific. (project_id, name) must be unique.
-- ============================================================================
CREATE TABLE IF NOT EXISTS labels (
    id         BIGSERIAL PRIMARY KEY,
    project_id BIGINT        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name       VARCHAR(50)   NOT NULL,
    color      VARCHAR(7)    NOT NULL DEFAULT '#3B82F6'
                   CHECK (color::text ~ '^#[0-9A-Fa-f]{6}$'),
    created_at TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_labels_project_name UNIQUE (project_id, name),
    -- Composite key support: allows task_labels to enforce "same project"
    CONSTRAINT uq_labels_id_project UNIQUE (id, project_id)
);

-- ============================================================================
-- 8. task_labels  (M:N between tasks and labels)
--    project_id is carried so that a task and its label must belong to the
--    same project (enforced by the two composite foreign keys below).
-- ============================================================================
CREATE TABLE IF NOT EXISTS task_labels (
    task_id     BIGINT        NOT NULL,
    label_id    BIGINT        NOT NULL,
    project_id  BIGINT        NOT NULL,
    assigned_at TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    PRIMARY KEY (task_id, label_id),
    CONSTRAINT fk_task_labels_task_project
        FOREIGN KEY (task_id, project_id) REFERENCES tasks(id, project_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_task_labels_label_project
        FOREIGN KEY (label_id, project_id) REFERENCES labels(id, project_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_task_labels_project
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- ============================================================================
-- INDEXES (in addition to those created automatically by PK/UNIQUE constraints)
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_owner_id          ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id    ON project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id              ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id           ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed            ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date             ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_user_completed       ON tasks(user_id, completed);
CREATE INDEX IF NOT EXISTS idx_task_assignees_user_id     ON task_assignees(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_task_id           ON comments(task_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id           ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_labels_project_id          ON labels(project_id);
CREATE INDEX IF NOT EXISTS idx_task_labels_label_id       ON task_labels(label_id);
CREATE INDEX IF NOT EXISTS idx_task_labels_project_id     ON task_labels(project_id);
