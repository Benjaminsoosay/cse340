import { getAllCategories, getCategoryById, getProjectsByCategoryId } from '../models/categories.js';

// Show all categories page
export const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';
    res.render('categories', { title, categories });
};

// Show category details page
export const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    
    // Handle category not found
    if (!category) {
        const err = new Error('Category Not Found');
        err.status = 404;
        throw err;
    }
    
    const projects = await getProjectsByCategoryId(categoryId);
    const title = `Category: ${category.name}`;
    
    res.render('category', { title, category, projects });
};