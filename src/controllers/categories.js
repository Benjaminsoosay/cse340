// src/controllers/categoriesController.js
import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    getCategoriesByServiceProjectId,
    updateCategoryAssignments
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';

// ========== EXISTING CONTROLLERS ==========

/**
 * Show all categories page.
 */
export const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';
    res.render('categories', { title, categories });
};

/**
 * Show category details page with its associated projects.
 */
export const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);

    if (!category) {
        const err = new Error('Category Not Found');
        err.status = 404;
        throw err;
    }

    const projects = await getProjectsByCategoryId(categoryId);
    const title = `Category: ${category.name}`;

    res.render('category', { title, category, projects });
};

// ========== NEW CONTROLLERS FOR ASSIGNING CATEGORIES TO A PROJECT ==========

/**
 * Show the form to assign/unassign categories for a specific project.
 */
export const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    // Debug logs
    console.log('projectId:', projectId);

    const projectDetails = await getProjectDetails(projectId);
    console.log('projectDetails:', projectDetails);

    // If project doesn't exist, redirect with error
    if (!projectDetails) {
        console.error('Project not found:', projectId);
        req.flash('error', 'Project not found');
        return res.redirect('/'); // adjust to your projects list route
    }

    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByServiceProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', {
        title,
        projectId,
        projectDetails,
        categories,
        assignedCategories
    });
};

/**
 * Process the category assignment form submission.
 */
export const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    let selectedCategoryIds = req.body.categoryIds || [];

    // Ensure selectedCategoryIds is an array (form can send a single value or array)
    if (!Array.isArray(selectedCategoryIds)) {
        selectedCategoryIds = [selectedCategoryIds];
    }

    // Optional debug: log what is being saved
    console.log(`Updating categories for project ${projectId}:`, selectedCategoryIds);

    await updateCategoryAssignments(projectId, selectedCategoryIds);

    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};