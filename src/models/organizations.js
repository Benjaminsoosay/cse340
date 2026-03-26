import db from '../db.js';

export const getAllOrganizations = async () => {
    const query = 'SELECT * FROM organization ORDER BY name';
    const result = await db.query(query);
    return result.rows;
};

export const getOrganizationDetails = async (organizationId) => {
    // Use alias 'id' so that the view can use organization.id
    const query = `
        SELECT organization_id AS id,
               name,
               description,
               contact_email,
               logo_filename
        FROM organization
        WHERE organization_id = $1
    `;
    const result = await db.query(query, [organizationId]);
    if (result.rows.length === 0) {
        throw new Error('Organization not found');
    }
    return result.rows[0];
};

export const createOrganization = async (name, description, contactEmail, logoFilename) => {
    const query = `
        INSERT INTO organization (name, description, contact_email, logo_filename)
        VALUES ($1, $2, $3, $4)
        RETURNING organization_id
    `;
    const values = [name, description, contactEmail, logoFilename];
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
        throw new Error('Failed to create organization');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new organization with ID:', result.rows[0].organization_id);
    }

    return result.rows[0].organization_id;
};

export const updateOrganization = async (organizationId, name, description, contactEmail, logoFilename) => {
    const query = `
        UPDATE organization
        SET name = $1,
            description = $2,
            contact_email = $3,
            logo_filename = $4
        WHERE organization_id = $5
        RETURNING *
    `;
    const values = [name, description, contactEmail, logoFilename, organizationId];
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
        throw new Error('Organization not found');
    }

    return result.rows[0];
};