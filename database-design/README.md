# Task Management System - Database Design

Normalised relational database schema for the existing Task Management API
project. This folder is a **design deliverable** for the database design
internship task; it does not change the running application.

## Contents

| File | Description |
|------|-------------|
| `INSPECTION_REPORT.md` | Inspection of the existing project and its current schema |
| `schema.sql` | Complete `CREATE TABLE` statements, constraints, indexes, triggers |
| `sample_data.sql` | Realistic dummy data for every table |
| `verification_queries.sql` | Counts, joins, index/FK listings and negative constraint tests |
| `task_management_schema.dbml` | DBML source for https://dbdiagram.io/ |
| `normalization.md` | 1NF / 2NF / 3NF analysis with functional dependencies |
| `DATABASE_DESIGN_REPORT.md` | Full professional report |
| `ER_DIAGRAM.md` | Mermaid ER diagram (rendered in Markdown viewers) |

## Entities (8 tables)

1. `users` - account information
2. `projects` - project information
3. `project_members` - users belonging to projects (M:N)
4. `tasks` - task details
5. `task_assignees` - users assigned to tasks (M:N)
6. `comments` - comments on tasks
7. `labels` - project-specific task labels
8. `task_labels` - labels assigned to tasks (M:N, same project enforced)

## Relationships

- One user owns many projects (`projects.owner_id`).
- One project has many tasks (`tasks.project_id`).
- Users and projects are M:N via `project_members`.
- Tasks and users (assignees) are M:N via `task_assignees`.
- One task has many comments.
- One project has many labels.
- Tasks and labels are M:N via `task_labels`, with the extra rule that a task
  and its label must belong to the same project (composite foreign keys).

## How to use (PostgreSQL)

```bash
# 1. Create the separate practice database (once)
createdb -U postgres task_management_design_db

# 2. Run the scripts in order
psql -U postgres -d task_management_design_db -f schema.sql
psql -U postgres -d task_management_design_db -f sample_data.sql
psql -U postgres -d task_management_design_db -f verification_queries.sql
```

## Safety

- Target database is `task_management_design_db` only.
- Never run these scripts against the production application database.
- No credentials are stored in this folder.
- No `DROP DATABASE` / destructive `DROP TABLE` statements are included.

## PostgreSQL testing status

Completed successfully on PostgreSQL 19.0 (local instance, port 5433).

- `schema.sql`, `sample_data.sql` and `verification_queries.sql` all ran without errors.
- Clean rerun (drop + recreate database) also succeeded.
- 8 tables, 25 indexes, 7 constraint tests all passed.
- See `DATABASE_DESIGN_REPORT.md` section 18 for full details.
