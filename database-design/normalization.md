# Normalisation Analysis

This document explains how the proposed schema (`schema.sql`) satisfies
First, Second and Third Normal Form (1NF, 2NF, 3NF).

## Starting point (unnormalised idea)

A naive single-table design might look like:

| task_id | title | assigned_user_ids | label_names | project_name | owner_name | owner_email |
|---------|-------|-------------------|-------------|--------------|------------|-------------|
| 2 | Design homepage | 2,3 | frontend,bug | Website Redesign | Alice | alice@example.com |

This stores repeating groups (multiple user IDs, multiple labels) and
duplicates user/project information inside task rows.

## First Normal Form (1NF)

Rules applied:
- Every column contains a single atomic value.
- No repeating groups / arrays of IDs are stored in one cell.
- Each row represents one fact.

How the schema satisfies 1NF:
- `tasks` has scalar columns only (`title`, `description`, `completed`, ...).
- Multiple assignees are stored in `task_assignees(task_id, user_id)` instead
  of a comma-separated list in `tasks`.
- Multiple labels are stored in `task_labels(task_id, label_id)` instead of a
  comma-separated list.
- Project membership is stored in `project_members(project_id, user_id)`.
- User details live only in `users`; project details only in `projects`.

## Second Normal Form (2NF)

Rules applied:
- The table must already be in 1NF.
- Every non-key attribute must depend on the *whole* primary key, not just part
  of it (relevant for composite keys).

Junction tables reviewed:

### project_members (PK = (project_id, user_id))
- Non-key attributes: `role`, `joined_at`.
- `role` depends on the combination (which user in which project), not on
  `project_id` alone or `user_id` alone.
- No partial dependency -> 2NF satisfied.

### task_assignees (PK = (task_id, user_id))
- Non-key attribute: `assigned_at`.
- Depends on the full composite key -> 2NF satisfied.

### task_labels (PK = (task_id, label_id))
- Non-key attribute: `assigned_at`, `project_id`.
- `project_id` is functionally determined by either `task_id` or `label_id`
  (because a task and its label must share a project), so it is carried to
  enforce the same-project rule; it does not introduce a partial dependency on
  a non-key attribute beyond the key.
- `assigned_at` depends on the full key -> 2NF satisfied.

All other tables have a single-column surrogate primary key (`id`), so 2NF is
trivially satisfied (no composite key to have partial dependencies).

## Third Normal Form (3NF)

Rules applied:
- Must be in 2NF.
- No transitive dependencies: non-key attributes must depend only on the key,
  not on other non-key attributes.

Functional dependencies reviewed:

- users: `id -> name, email, password_hash, is_verified, ...`
  Email is also a candidate key (`email -> id`). All other attributes depend
  on the key. No transitive dependency.

- projects: `id -> owner_id, name, description, status, created_at, updated_at`
  `owner_id -> users.id` is a foreign key, not a stored copy of user data.
  Project name does not determine owner. 3NF satisfied.

- tasks: `id -> user_id, project_id, title, description, completed, priority,
  due_date, reminder_sent, ...`
  User/project details are NOT stored here; only their IDs. 3NF satisfied.

- comments: `id -> task_id, user_id, content, ...`
  Author name and task title are not stored; only IDs. 3NF satisfied.

- labels: `id -> project_id, name, color, ...`
  Project name is not stored; only `project_id`. 3NF satisfied.

- Junction tables store only the association plus association-specific data
  (`role`, `assigned_at`), never duplicated entity attributes.

Transitive dependencies explicitly removed:
- Storing `owner_name` or `owner_email` in `projects` would be transitive
  (project -> owner -> owner attributes). We store only `owner_id`.
- Storing `creator_name` in `tasks` would be transitive (task -> user -> name).
  We store only `user_id`.
- Storing `project_name` in `tasks` or `labels` would be transitive. We store
  only `project_id`.

## Conclusion

The schema is in 3NF: every non-key attribute is fully functionally dependent
on the primary key of its own table, and transitive dependencies have been
removed by replacing duplicated data with foreign keys.
