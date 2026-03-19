import express from 'express';
import { showCategoriesPage, showCategoryDetailsPage } from '../controllers/categoryController.js';

const router = express.Router();

// GET /categories - Show all categories
router.get('/categories', showCategoriesPage);

// GET /category/:id - Show category details page (THIS IS THE MISSING ROUTE)
router.get('/category/:id', showCategoryDetailsPage);

export default router;