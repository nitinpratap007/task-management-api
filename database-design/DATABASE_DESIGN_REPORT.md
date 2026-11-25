# DATABASE DESIGN REPORT

## 1. Project Title

Normalised Relational Database Schema for a Task Management System

## 2. Introduction

This report documents the design of a normalised relational database for an
existing Task Management API. The existing application stores users and their
personal tasks in PostgreSQL. The internship assignment asked for a richer,
normalised schema with at least five related tables, correct keys, indexes,
many-to-many relationships, an ER diagram, executable SQL, sample data and
verification queries.

## 3. Problem Statement

The original schema only supported users and personal tasks. It could not
represent projects, collaboration (project members), task assignment to
multiple users, comments, or labels. These limitations prevent modelling a
real team task-management workflow and make the database non-normalised if
extended naively (for example by storing comma-separated user IDs or labels).

## 4. Project Scope

- Reuse the existing Task Management domain (users, tasks).
- Preserve existing application behaviour (tasks belong to a creator `user_id`).
- Add project, collaboration, assignment, comment and label support.
- Deliver SQL, DBML, sample data, verification queries, normalisation notes and
  documentation only. No application code was changed.

## 5. Existing Project Inspection Summary

See `INSPECTION_REPORT.md`. Summary:
- Backend: Node.js + Express + PostgreSQL (`pg`).
- Existing tables: `users`, `tasks`.
- Relationship: `tasks.user_id -> users.id` (one user, many tasks).
- Authentication fields added via migration `001_add_authentication_fields.sql`.
- Task fields added: `due_date`, `reminder_sent`.
- Frontend consumes only users and tasks.

## 6. Entity Descriptions

- `users`: account information, credentials, verification/reset tokens.
- `projects`: project information and its owner.
- `project_members`: junction table linking users to projects (M:N).
- `tasks`: task details, creator (`user_id`), optional project (`project_id`).
- `task_assignees`: junction table linking tasks to users (M:N).
- `comments`: comments written by users on tasks.
- `labels`: project-specific labels (name + colour).
- `task_labels`: junction table linking tasks to labels (M:N), with the rule
  that a task and its label must belong to the same project.

## 7. Database Schema

See `schema.sql`. Eight tables, all with primary keys, foreign keys, unique and
check constraints, defaults and indexes.

## 8. ER Diagram

- DBML source: `task_management_schema.dbml` (import into https://dbdiagram.io/).
- Mermaid diagram: `ER_DIAGRAM.md`.
- Composite many-to-many relationships are shown through the three junction
  tables.

## 9. Relationship Explanation

1. One user owns many projects: `projects.owner_id -> users.id`.
2. One project contains many tasks: `tasks.project_id -> projects.id`.
3. Users join many projects and a project has many members:
   `project_members(project_id, user_id)` (M:N).
4. A task can be assigned to many users and a user can be assigned many tasks:
   `task_assignees(task_id, user_id)` (M:N).
5. One task has many comments: `comments.task_id -> tasks.id`.
6. One project has many labels: `labels.project_id -> projects.id`.
7. Tasks and labels are M:N via `task_labels(task_id, label_id)`, with the
   extra rule that both must share a project.

## 10. Primary and Foreign Key Explanation

- Surrogate single-column primary keys (`id BIGSERIAL`) are used for
  `users`, `projects`, `tasks`, `comments`, `labels`.
- Composite primary keys are used for the three junction tables
  (`project_members`, `task_assignees`, `task_labels`) to prevent duplicate
  associations.
- Foreign keys use `ON DELETE CASCADE` so that deleting a user/project/task
  cleans up dependent rows.
- `task_labels` uses two composite foreign keys to enforce that a task and its
  label belong to the same project.

## 11. Many-to-Many Relationship Explanation

- `project_members`: links `projects` and `users`. PK `(project_id, user_id)`
  prevents a user being added twice to the same project.
- `task_assignees`: links `tasks` and `users`. PK `(task_id, user_id)`
  prevents duplicate assignment.
- `task_labels`: links `tasks` and `labels`. PK `(task_id, label_id)`
  prevents duplicate tagging. The carried `project_id` column plus composite
  foreign keys enforce the same-project rule.

## 12. 1NF Explanation

See `normalization.md`. All columns are atomic; repeating groups (multiple
user IDs, multiple labels) were moved into junction tables.

## 13. 2NF Explanation

All junction tables with composite keys were reviewed: non-key attributes
(`role`, `assigned_at`) depend on the whole composite key, not on part of it.

## 14. 3NF Explanation

Transitive dependencies were removed: user data lives only in `users`, project
data only in `projects`, label data only in `labels`. Other tables store only
foreign keys. See `normalization.md` for functional dependencies.

## 15. Indexing Strategy

- Unique indexes from PK/UNIQUE constraints (`users.email`,
  `labels(project_id, name)`, junction PKs).
- Foreign-key columns are indexed (`projects.owner_id`, `tasks.user_id`,
  `tasks.project_id`, `task_assignees.user_id`, `comments.task_id`,
  `comments.user_id`, `labels.project_id`, `task_labels.label_id`,
  `task_labels.project_id`, `project_members.user_id`).
- Query-supporting indexes: `tasks(completed)`, `tasks(due_date)`,
  `tasks(user_id, completed)`.

## 16. Complete SQL Implementation

All SQL is in `schema.sql`, `sample_data.sql` and `verification_queries.sql`.

## 17. Sample Data Explanation

`sample_data.sql` inserts 3 users, 2 projects, 5 memberships, 5 tasks, 5
assignments, 4 comments, 5 labels and 5 task-label links. IDs are set
explicitly and sequences are reset afterwards. All foreign keys are valid and
many-to-many relationships are demonstrated.

## 18. PostgreSQL Testing Results

Status: **COMPLETED SUCCESSFULLY on a real PostgreSQL instance.**

Environment:
- PostgreSQL 19.0 (x86_64-windows), existing local instance
- Host: 127.0.0.1, Port: 5433
- Superuser: postgres
- Practice database: `task_management_design_db` (separate from the application database)

Commands executed:

```bash
psql -U postgres -h 127.0.0.1 -p 5433 -d postgres -c "DROP DATABASE IF EXISTS task_management_design_db;"
psql -U postgres -h 127.0.0.1 -p 5433 -d postgres -c "CREATE DATABASE task_management_design_db;"
psql -U postgres -h 127.0.0.1 -p 5433 -d task_management_design_db -f schema.sql
psql -U postgres -h 127.0.0.1 -p 5433 -d task_management_design_db -f sample_data.sql
psql -U postgres -h 127.0.0.1 -p 5433 -d task_management_design_db -f verification_queries.sql
```

Results:
- `schema.sql` executed successfully: 8 tables, triggers and 25 indexes created.
- `sample_data.sql` executed successfully:
  - users: 3
  - projects: 2
  - project_members: 5
  - tasks: 5
  - task_assignees: 5
  - comments: 4
  - labels: 5
  - task_labels: 5
- `verification_queries.sql` executed successfully:
  - All join queries returned the expected rows.
  - Task/label project-consistency check returned 0 mismatched rows.
  - 25 indexes are visible in `pg_indexes`.
  - 19 foreign keys are visible in `information_schema`.
  - All 7 negative constraint tests printed `PASS`:
    - invalid user_id rejected by foreign key
    - duplicate users.id rejected
    - duplicate project_members row rejected
    - invalid project status rejected
    - invalid label colour rejected
    - task/label project mismatch rejected
    - duplicate email rejected
- A complete clean rerun was performed (DROP + CREATE + all 3 scripts) with
  the same successful results and no SQL errors.

Notes:
- An initial attempt to run the PostgreSQL 17 installer hung because a
  PostgreSQL 19 service was already running on this machine. Testing was
  therefore completed against the existing PostgreSQL 19 instance on port 5433.
- The application/production database was not modified.

## 19. Screenshots / Evidence Section

- ER diagram: `ER_DIAGRAM.md` and `task_management_schema.dbml`.
- Constraint test output will be captured from `verification_queries.sql`
  when run against PostgreSQL (pending).
- Suggested screenshot: dbdiagram.io rendering of the DBML file.

## 20. Design Decisions

- Kept `tasks.user_id` as creator/owner to preserve existing API semantics.
- Made `tasks.project_id` nullable to support personal tasks (backward
  compatible) and project tasks.
- Used composite foreign keys instead of triggers to enforce the same-project
  rule for `task_labels`.
- Used `BIGSERIAL` and `TIMESTAMPTZ` for future-proofing and time-zone safety.
- Did not alter application code or migrations.

## 21. Limitations

- PostgreSQL execution could not be verified in this environment.
- The schema is a design deliverable; the running application still uses its
  own simpler schema. Integrating the new tables into the API would be a
  separate task.
- `task_labels.project_id` is redundant data, carried only to enable the
  composite foreign-key check; it is functionally determined by `task_id`/
  `label_id`.

## 22. Conclusion

The deliverable provides a professional, normalised (3NF) relational schema
with eight related tables, three many-to-many relationships, proper keys,
constraints, indexes, executable SQL, sample data, verification queries, DBML
and documentation. It reuses the existing Task Management domain and preserves
existing functionality.
