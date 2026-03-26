import db from '../db.js';

/**
 * Get all projects
 * Returns id instead of project_id, name instead of title
 */
export const getAllProjects = async () => {
    const query = `
        SELECT 
            id,
            name,
            description,
            created_at,
            updated_at
        FROM projects
        ORDER BY created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
};

/**
 * Get a limited number of recent projects (e.g., for "upcoming" section)
 */
export const getUpcomingProjects = async (limit = 5) => {
    const query = `
        SELECT 
            id,
            name,
            description,
            created_at,
            updated_at
        FROM projects
        ORDER BY created_at DESC
        LIMIT $1
    `;
    const result = await db.query(query, [limit]);
    return result.rows;
};

/**
 * Get all projects belonging to a specific organization
 */
export const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT 
            id,
            name,
            description,
            created_at,
            updated_at
        FROM projects
        WHERE organization_id = $1
        ORDER BY created_at DESC
    `;
    const result = await db.query(query, [organizationId]);
    return result.rows;
};

/**
 * Get a single project by its ID
 */
export const getProjectDetails = async (projectId) => {
    const query = `
        SELECT 
            id,
            name,
            description,
            created_at,
            updated_at,
            organization_id
        FROM projects
        WHERE id = $1
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

/**
 * Create a new project
 * @param {number} organizationId - ID of the organization this project belongs to
 * @param {string} name - Project name (was 'title' in old schema)
 * @param {string} description - Project description
 * @returns {number} - The newly created project's ID
 */
export const createProject = async (organizationId, name, description) => {
    // Insert into the new table structure
    const query = `
        INSERT INTO projects (organization_id, name, description, created_at, updated_at)
        VALUES ($1, $2, $3, DEFAULT, DEFAULT)
        RETURNING id
    `;
    const params = [organizationId, name, description];
    const result = await db.query(query, params);
    if (result.rows.length === 0) throw new Error('Failed to create project');
    return result.rows[0].id;
};