import db from './db.js';

// Get a single category by ID
export const getCategoryById = async (categoryId) => {
    const query = `
        SELECT 
            category_id,
            name
        FROM category
        WHERE category_id = $1;
    `;
    
    const query_params = [categoryId];
    
    try {
        const result = await db.query(query, query_params);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
        console.error('Error in getCategoryById:', err);
        throw err;
    }
};

// Get all categories for a given service project
export const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT 
            c.category_id,
            c.name
        FROM category c
        JOIN project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name;
    `;
    
    const query_params = [projectId];
    
    try {
        const result = await db.query(query, query_params);
        return result.rows;
    } catch (err) {
        console.error('Error in getCategoriesByProjectId:', err);
        throw err;
    }
};

// Get all service projects for a given category
export const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM project p
        JOIN project_category pc ON p.project_id = pc.project_id
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE pc.category_id = $1
        ORDER BY p.date DESC;
    `;
    
    const query_params = [categoryId];
    
    try {
        const result = await db.query(query, query_params);
        return result.rows;
    } catch (err) {
        console.error('Error in getProjectsByCategoryId:', err);
        throw err;
    }
};

// Get all categories (for the categories list page)
export const getAllCategories = async () => {
    const query = `
        SELECT 
            category_id,
            name
        FROM category
        ORDER BY name;
    `;
    
    try {
        const result = await db.query(query);
        return result.rows;
    } catch (err) {
        console.error('Error in getAllCategories:', err);
        throw err;
    }
};

// REMOVE ANY EXPORT OBJECT AT THE BOTTOM LIKE THIS:
// export {
//     getAllCategories,
//     getCategoryById,
//     getCategoriesByProjectId,
//     getProjectsByCategoryId
// };