import { 
    getAllCategories, 
    getCategoryById, 
    getProjectsByCategoryId 
} from '../models/categories.js';

// Show all categories page
export const showCategoriesPage = async (req, res) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Categories';
        
        res.render('categories', { title, categories });
    } catch (err) {
        console.error('Error in showCategoriesPage:', err);
        res.status(500).render('errors/500', { 
            title: 'Server Error',
            message: 'Unable to load categories at this time.' 
        });
    }
};

// Show category details page
export const showCategoryDetailsPage = async (req, res) => {
    try {
        const categoryId = req.params.id;
        
        // Get category details
        const category = await getCategoryById(categoryId);
        
        if (!category) {
            return res.status(404).render('errors/404', { 
                title: 'Category Not Found',
                message: 'The requested category could not be found.' 
            });
        }
        
        // Get projects for this category
        const projects = await getProjectsByCategoryId(categoryId);
        
        const title = category.name;
        
        res.render('category', { title, category, projects });
    } catch (err) {
        console.error('Error in showCategoryDetailsPage:', err);
        res.status(500).render('errors/500', { 
            title: 'Server Error',
            message: 'Unable to load category details at this time.' 
        });
    }
};