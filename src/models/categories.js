import db from './db.js';   

export async function getAllCategories() {
    try {
        const result = await db.query('SELECT * FROM category ORDER BY name');
        return result.rows;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}