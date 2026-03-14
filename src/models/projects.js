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