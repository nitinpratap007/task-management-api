# Existing Project Inspection Report

## 1. Repositories inspected

- Backend: task-management-api
- Frontend: task-management-api-frontend

## 2. Backend technology stack

- Runtime: Node.js (CommonJS)
- Framework: Express.js 5
- Database: PostgreSQL (via `pg`)
- Authentication: JWT (`jsonwebtoken`) + bcryptjs
- Validation: express-validator
- Email: nodemailer

## 3. Database configuration

- Connection is created in `config/db.js` using `process.env.DATABASE_URL`.
- Tables are created at startup with `CREATE TABLE IF NOT EXISTS`.
- SSL is required (hosted PostgreSQL, e.g. Neon/Render/Railway).

## 4. Existing tables found (from source code)

### users
- id SERIAL PRIMARY KEY
- name TEXT NOT NULL
- email TEXT NOT NULL UNIQUE
- password_hash TEXT NOT NULL
- created_at TIMESTAMP NOT NULL DEFAULT NOW()

Plus migration `001_add_authentication_fields.sql` adds:
- is_verified BOOLEAN NOT NULL DEFAULT FALSE
- verification_token_hash TEXT
- verification_token_expiry TIMESTAMPTZ
- reset_token_hash TEXT
- reset_token_expiry TIMESTAMPTZ

### tasks
- id SERIAL PRIMARY KEY
- user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
- title TEXT NOT NULL
- description TEXT NOT NULL DEFAULT ''
- completed BOOLEAN NOT NULL DEFAULT FALSE
- created_at TIMESTAMP NOT NULL DEFAULT NOW()
- updated_at TIMESTAMP NOT NULL DEFAULT NOW()

Plus migration adds:
- due_date TIMESTAMPTZ
- reminder_sent BOOLEAN NOT NULL DEFAULT FALSE

## 5. Relationships already present

- One user owns many tasks (`tasks.user_id -> users.id`, ON DELETE CASCADE).
- No projects, project members, task assignees, comments, labels or task_labels
  tables exist in the current application.

## 6. Missing relationships / design gaps identified

- No project entity; tasks are purely personal.
- No many-to-many task assignment (a task can only belong to one user).
- No comments on tasks.
- No labels / tagging.
- No project membership / collaboration.
- Timestamps use `TIMESTAMP` (no time zone) in the base schema; auth fields
  already use `TIMESTAMPTZ`.

## 7. Design decision

The existing `users` and `tasks` tables are preserved in spirit:
- `users` keeps all authentication fields.
- `tasks.user_id` is kept as the creator/owner to avoid breaking the existing
  API (which filters tasks by `user_id`).
- `project_id` is added as a nullable foreign key so personal tasks still work
  while project tasks become possible.
- Additional tables implement the missing relationships required by the
  internship task.

## 8. Safety notes

- The production database was not modified during this work.
- No existing migrations or application files were changed.
- All new SQL lives in the `database-design/` folder and targets a separate
  practice database named `task_management_design_db`.
