const pool = require("../database/");

async function getInventoryById(invId) {
  try {
    const sql = `
      SELECT * 
      FROM public.inventory 
      WHERE inv_id = $1
    `;
    const data = await pool.query(sql, [invId]);

    if (data.rows.length === 0) {
      return null; // no vehicle found
    }

    return data.rows[0]; // return the first matching vehicle
  } catch (error) {
    console.error("getInventoryById error:", error.message);
    throw error; // let the controller handle the error
  }
}

module.exports = { getInventoryById };
