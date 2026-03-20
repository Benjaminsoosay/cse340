import db from './db.js';

// Get all projects
export const getAllProjects = async () => {
    const query = `
        SELECT 
            p.project_id,
            p.organization_id,
            p.title,
            p.description,
            p.location,
            p.date,
            o.name as organization_name
        FROM project p
        JOIN organization o ON p.organization_id = o.organization_id
        ORDER BY p.date
    `;
    const result = await db.query(query);
    return result.rows;
};

// Get upcoming projects
export const getUpcomingProjects = async (limit = 5) => {
    const query = `
        SELECT 
            p.project_id,
            p.organization_id,
            p.title,
            p.description,
            p.location,
            p.date,
            o.name as organization_name
        FROM project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date
        LIMIT $1
    `;
    const result = await db.query(query, [limit]);
    return result.rows;
};

// Get projects by organization ID
export const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT 
            p.project_id,
            p.organization_id,
            p.title,
            p.description,
            p.location,
            p.date,
            o.name as organization_name
        FROM project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.organization_id = $1
        ORDER BY p.date
    `;
    const result = await db.query(query, [organizationId]);
    return result.rows;
};

// Get single project details by ID
export const getProjectDetails = async (projectId) => {
    const query = `
        SELECT 
            p.project_id,
            p.organization_id,
            p.title,
            p.description,
            p.location,
            p.date,
            o.name as organization_name
        FROM project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1
    `;
    const result = await db.query(query, [projectId]);
    return result.rows.length > 0 ? result.rows[0] : null;
};