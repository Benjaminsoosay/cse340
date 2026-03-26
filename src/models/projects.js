import db from '../db.js';

// Get all projects
export const getAllProjects = async () => {
    const query = `
        SELECT 
            project_id,
            title,
            description,
            created_at
        FROM projects
        ORDER BY created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
};

// Get upcoming projects (based on created_at, assuming new projects are "upcoming")
// Adjust logic if you have a date field – otherwise this is a placeholder
export const getUpcomingProjects = async (limit = 5) => {
    const query = `
        SELECT 
            project_id,
            title,
            description,
            created_at
        FROM projects
        ORDER BY created_at DESC
        LIMIT $1
    `;
    const result = await db.query(query, [limit]);
    return result.rows;
};

// Get projects by organization ID – this concept may not apply to your simple schema
// If you don't need it, you can remove it, but I'll keep a placeholder.
export const getProjectsByOrganizationId = async (organizationId) => {
    // Since your projects table has no organization_id, this query would fail.
    // For the assignment, you might not use this function. If you need it,
    // you'll have to add an organization_id column to your projects table.
    // For now, I'll return an empty array or throw an error.
    throw new Error('Organization ID not supported in current schema');
};

// Get single project details by ID
export const getProjectDetails = async (projectId) => {
    const query = `
        SELECT 
            project_id,
            title,
            description,
            created_at
        FROM projects
        WHERE project_id = $1
    `;
    try {
        const result = await db.query(query, [projectId]);
        if (result.rows.length === 0) return null;
        return result.rows[0];
    } catch (err) {
        console.error('Error in getProjectDetails:', err);
        throw err;
    }
};

// Create a new project
export const createProject = async (title, description) => {
    // Only include columns that exist in your projects table
    const query = `
        INSERT INTO projects (title, description, created_at)
        VALUES ($1, $2, DEFAULT)
        RETURNING project_id
    `;
    const params = [title, description];
    const result = await db.query(query, params);
    if (result.rows.length === 0) throw new Error('Failed to create project');
    return result.rows[0].project_id;
};