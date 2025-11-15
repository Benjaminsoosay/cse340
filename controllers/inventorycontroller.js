// models/inventory-model.js
const pool = require("../database/");

/**
 * Get a single vehicle by inventory id
 * Uses a prepared statement to prevent SQL injection
 */
async function getInventoryById(invId) {
  try {
    const sql = `
      SELECT inv_id, inv_make, inv_model, inv_year, inv_price, inv_miles,
             inv_color, inv_description, inv_type, inv_image
      FROM public.inventory
      WHERE inv_id = $1
    `;
    const result = await pool.query(sql, [invId]);
    return result.rows.length ? result.rows[0] : null;
  } catch (error) {
    console.error("getInventoryById error:", error.message);
    throw error;
  }
}

module.exports = { getInventoryById };
