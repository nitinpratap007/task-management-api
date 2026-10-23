// ==========================================
// TASK ROUTES — Protected (valid JWT required)
// ==========================================

const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const { validate, createTaskRules, updateTaskRules } = require('../validators/validators');

// Every task route requires a valid JWT
router.use(authMiddleware);

router.get('/', getAllTasks);
router.get('/:id', getTask);
router.post('/', createTaskRules, validate, createTask);
router.put('/:id', updateTaskRules, validate, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
