import db from './db.js';

export const getAllProjects = async () => {
    const sql = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.date,
            p.organization_id,
            o.name AS organization_name
        FROM project p
        JOIN organization o ON p.organization_id = o.organization_id
        ORDER BY p.date DESC;
    `;

    try {
        const result = await db.query(sql);
        return result.rows;
    } catch (err) {
        console.error('Error in getAllProjects:', err);
        throw err;
    }
};

export const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          date
        FROM project
        WHERE organization_id = $1
        ORDER BY date;
    `;
    
    const query_params = [organizationId];
    
    try {
        const result = await db.query(query, query_params);
        return result.rows;
    } catch (err) {
        console.error('Error in getProjectsByOrganizationId:', err);
        throw err;
    }
};

// Get upcoming projects (limited to a specific number)
export const getUpcomingProjects = async (number_of_projects) => {
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
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date ASC
        LIMIT $1;
    `;
    
    const query_params = [number_of_projects];
    
    try {
        const result = await db.query(query, query_params);
        return result.rows;
    } catch (err) {
        console.error('Error in getUpcomingProjects:', err);
        throw err;
    }
};

// Get project details by ID
export const getProjectDetails = async (id) => {
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
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;
    
    const query_params = [id];
    
    try {
        const result = await db.query(query, query_params);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
        console.error('Error in getProjectDetails:', err);
        throw err;
    }
};

// REMOVED THE DUPLICATE EXPORT OBJECT AT THE BOTTOM