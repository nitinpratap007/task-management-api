// ==========================================
// CATEGORY ROUTES — Protected (valid JWT required)
// ==========================================

const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { validate, createCategoryRules, updateCategoryRules } = require('../validators/validators');

router.use(authMiddleware);

router.get('/', getAllCategories);
router.get('/:id', getCategory);
router.post('/', createCategoryRules, validate, createCategory);
router.put('/:id', updateCategoryRules, validate, updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;