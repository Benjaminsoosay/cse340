// src/models/categories.js
import db from '../db.js';

/**
 * Fetch all categories, ordered by name.
 * @returns {Promise<Array>} List of category objects.
 */
export const getAllCategories = async () => {
    const query = `SELECT * FROM categories ORDER BY name`;
    const result = await db.query(query);
    return result.rows;
};

/**
 * Fetch a single category by its ID.
 * @param {number|string} categoryId - The ID of the category.
 * @returns {Promise<Object|null>} Category object or null if not found.
 */
export const getCategoryById = async (categoryId) => {
    const query = `SELECT * FROM categories WHERE category_id = $1`;
    const result = await db.query(query, [categoryId]);
    return result.rows[0] || null;
};

/**
 * Fetch categories assigned to a specific project.
 * @param {number|string} projectId - The ID of the project.
 * @returns {Promise<Array>} List of category objects.
 */
export const getCategoriesByServiceProjectId = async (projectId) => {
    const query = `
        SELECT c.*
        FROM categories c
        JOIN project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
};

/**
 * Alias for getCategoriesByServiceProjectId. Used by projectsController.js.
 */
export const getCategoriesByProjectId = getCategoriesByServiceProjectId;

/**
 * Fetch projects that are assigned to a specific category.
 * @param {number|string} categoryId - The ID of the category.
 * @returns {Promise<Array>} List of project objects.
 */
export const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT p.*
        FROM projects p
        JOIN project_category pc ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.title
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows;
};

/**
 * Internal helper: insert a single project-category relationship.
 * @param {number|string} categoryId - The category ID.
 * @param {number|string} projectId - The project ID.
 * @returns {Promise<void>}
 */
const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2)
    `;
    await db.query(query, [categoryId, projectId]);
};

/**
 * Replace all category assignments for a project with a new list.
 * @param {number|string} projectId - The project ID.
 * @param {Array<number|string>} categoryIds - Array of category IDs to assign.
 * @returns {Promise<void>}
 */
export const updateCategoryAssignments = async (projectId, categoryIds) => {
    // Delete all existing assignments for this project
    const deleteQuery = `DELETE FROM project_category WHERE project_id = $1`;
    await db.query(deleteQuery, [projectId]);

    // Insert each new assignment
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};