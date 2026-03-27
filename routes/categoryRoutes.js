import express from 'express';
import {
  showCategoriesPage,
  showCategoryDetailsPage,
  showNewCategoryForm,
  createCategory,
  showEditCategoryForm,
  updateCategory
} from '../controllers/categoryController.js';

const router = express.Router();

// GET /categories - Show all categories
router.get('/categories', showCategoriesPage);

// GET /category/:id - Show category details page
router.get('/category/:id', showCategoryDetailsPage);

// GET /new-category - Show form to create a new category
router.get('/new-category', showNewCategoryForm);

// POST /new-category - Create a new category
router.post('/new-category', createCategory);

// GET /edit-category/:id - Show form to edit an existing category
router.get('/edit-category/:id', showEditCategoryForm);

// POST /edit-category/:id - Update an existing category
router.post('/edit-category/:id', updateCategory);

export default router;