// ==========================================
// TASK CONTROLLER — Create, Read, Update, Delete Tasks
// Every operation enforces ownership via req.user.id
// ==========================================

const db = require('../config/db');

// Helper: convert a SQLite task row into a clean JSON-friendly object
const formatTask = (task) => ({
  id: task.id,
  userId: task.user_id,
  title: task.title,
  description: task.description,
  completed: task.completed === 1,
  createdAt: task.created_at,
  updatedAt: task.updated_at
});

// POST /api/tasks
const createTask = (req, res) => {
  try {
    const { title, description = '', completed = false } = req.body;

    const result = db.prepare(
      'INSERT INTO tasks (user_id, title, description, completed) VALUES (?, ?, ?, ?)'
    ).run(req.user.id, title, description, completed ? 1 : 0);

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task: formatTask(task) }
    });
  } catch (error) {
    console.error('Create task error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET /api/tasks
const getAllTasks = (req, res) => {
  try {
    const tasks = db.prepare(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC'
    ).all(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        count: tasks.length,
        tasks: tasks.map(formatTask)
      }
    });
  } catch (error) {
    console.error('Get all tasks error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET /api/tasks/:id
const getTask = (req, res) => {
  try {
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId) || taskId < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID'
      });
    }

    // Ownership enforced in the query itself
    const task = db.prepare(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?'
    ).get(taskId, req.user.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { task: formatTask(task) }
    });
  } catch (error) {
    console.error('Get task error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// PUT /api/tasks/:id
const updateTask = (req, res) => {
  try {
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId) || taskId < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID'
      });
    }

    const existingTask = db.prepare(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?'
    ).get(taskId, req.user.id);

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const body = req.body;
    const title = body.title !== undefined ? body.title : existingTask.title;
    const description = body.description !== undefined ? body.description : existingTask.description;
    const completed = body.completed !== undefined ? body.completed : Boolean(existingTask.completed);

    db.prepare(
      `UPDATE tasks
       SET title = ?, description = ?, completed = ?, updated_at = datetime('now')
       WHERE id = ? AND user_id = ?`
    ).run(title, description, completed ? 1 : 0, taskId, req.user.id);

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: { task: formatTask(updatedTask) }
    });
  } catch (error) {
    console.error('Update task error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// DELETE /api/tasks/:id
const deleteTask = (req, res) => {
  try {
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId) || taskId < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID'
      });
    }

    const result = db.prepare(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?'
    ).run(taskId, req.user.id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask
};
