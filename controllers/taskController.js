// ==========================================
// TASK CONTROLLER — Create, Read, Update, Delete Tasks
// Every operation enforces ownership via req.user.id
// ==========================================

const db = require('../config/db');

const formatTask = (task) => ({
  id: task.id,
  userId: task.user_id,
  title: task.title,
  description: task.description,
  completed: task.completed === true,
  createdAt: task.created_at,
  updatedAt: task.updated_at
});

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description = '', completed = false } = req.body;

    const result = await db.query(
      'INSERT INTO tasks (user_id, title, description, completed) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, title, description, completed]
    );

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task: formatTask(result.rows[0]) }
    });
  } catch (error) {
    console.error('Create task error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET /api/tasks
const getAllTasks = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      data: {
        count: result.rows.length,
        tasks: result.rows.map(formatTask)
      }
    });
  } catch (error) {
    console.error('Get all tasks error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET /api/tasks/:id
const getTask = async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId) || taskId < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID'
      });
    }

    const result = await db.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [taskId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { task: formatTask(result.rows[0]) }
    });
  } catch (error) {
    console.error('Get task error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId) || taskId < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID'
      });
    }

    const existing = await db.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [taskId, req.user.id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const existingTask = existing.rows[0];
    const body = req.body;
    const title = body.title !== undefined ? body.title : existingTask.title;
    const description = body.description !== undefined ? body.description : existingTask.description;
    const completed = body.completed !== undefined ? body.completed : existingTask.completed;

    const result = await db.query(
      `UPDATE tasks
       SET title = $1, description = $2, completed = $3, updated_at = NOW()
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [title, description, completed, taskId, req.user.id]
    );

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: { task: formatTask(result.rows[0]) }
    });
  } catch (error) {
    console.error('Update task error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId) || taskId < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID'
      });
    }

    const result = await db.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2',
      [taskId, req.user.id]
    );

    if (result.rowCount === 0) {
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
