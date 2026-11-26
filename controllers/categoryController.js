// ==========================================
// CATEGORY CONTROLLER — Create, Read, Update, Delete Categories
// Every operation enforces ownership via req.user.id
// ==========================================

const db = require('../config/db');

const formatCategory = (cat) => ({
  id: cat.id,
  userId: cat.user_id,
  name: cat.name,
  createdAt: cat.created_at,
  updatedAt: cat.updated_at
});

// POST /api/categories
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const result = await db.query(
      'INSERT INTO categories (user_id, name) VALUES ($1, $2) RETURNING *',
      [req.user.id, name]
    );

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category: formatCategory(result.rows[0]) }
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Category name already exists' });
    }
    console.error('Create category error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET /api/categories
const getAllCategories = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM categories WHERE user_id = $1 ORDER BY name ASC',
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      data: {
        count: result.rows.length,
        categories: result.rows.map(formatCategory)
      }
    });
  } catch (error) {
    console.error('Get all categories error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET /api/categories/:id
const getCategory = async (req, res) => {
  try {
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId) || categoryId < 1) {
      return res.status(400).json({ success: false, message: 'Invalid category ID' });
    }

    const result = await db.query(
      'SELECT * FROM categories WHERE id = $1 AND user_id = $2',
      [categoryId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({
      success: true,
      data: { category: formatCategory(result.rows[0]) }
    });
  } catch (error) {
    console.error('Get category error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// PUT /api/categories/:id
const updateCategory = async (req, res) => {
  try {
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId) || categoryId < 1) {
      return res.status(400).json({ success: false, message: 'Invalid category ID' });
    }

    const existing = await db.query(
      'SELECT * FROM categories WHERE id = $1 AND user_id = $2',
      [categoryId, req.user.id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const existingCat = existing.rows[0];
    const name = req.body.name !== undefined ? req.body.name : existingCat.name;

    const result = await db.query(
      `UPDATE categories SET name = $1, updated_at = NOW()
       WHERE id = $2 AND user_id = $3 RETURNING *`,
      [name, categoryId, req.user.id]
    );

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: { category: formatCategory(result.rows[0]) }
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Category name already exists' });
    }
    console.error('Update category error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
  try {
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId) || categoryId < 1) {
      return res.status(400).json({ success: false, message: 'Invalid category ID' });
    }

    const result = await db.query(
      'DELETE FROM categories WHERE id = $1 AND user_id = $2',
      [categoryId, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory
};