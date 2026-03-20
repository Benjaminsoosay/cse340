import db from './db.js';

// Get all categories
export const getAllCategories = async () => {
    const query = `
        SELECT category_id, name
        FROM category
        ORDER BY name
    `;
    const result = await db.query(query);
    return result.rows;
};

// Get category by ID - REMOVED description field
export const getCategoryById = async (categoryId) => {
    const query = `
        SELECT category_id, name
        FROM category
        WHERE category_id = $1
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

// Get projects by category ID
export const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.date, p.location,
               p.organization_id, o.name as organization_name
        FROM project p
        JOIN project_category pc ON p.project_id = pc.project_id
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE pc.category_id = $1
        ORDER BY p.date
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows;
};

// Get categories by project ID
export const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name
        FROM category c
        JOIN project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
};