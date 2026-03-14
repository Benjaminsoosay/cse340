import db from './db.js';   

export const getAllCategories = async () => {
    try {
        const result = await db.query('SELECT * FROM category ORDER BY name');
        return result.rows;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};