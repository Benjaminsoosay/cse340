// inventory-model.js
const { Pool } = require('pg');

// ✅ Connection pool using DATABASE_URL from environment variables
// Locally: set DATABASE_URL in a .env file
// On Render: set DATABASE_URL in the dashboard Environment tab
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const inventoryModel = {};

// 🔎 Get all vehicles
inventoryModel.getAllVehicles = async () => {
  try {
    const sql = 'SELECT * FROM public.vehicles WHERE status = $1';
    const params = ['active'];
    const result = await pool.query(sql, params);
    return result.rows;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

// 🔎 Get vehicle by ID
inventoryModel.getVehicleById = async (vehicleId) => {
  try {
    const sql = 'SELECT * FROM public.vehicles WHERE id = $1 AND status = $2';
    const params = [vehicleId, 'active'];
    const result = await pool.query(sql, params);
    return result.rows[0] || null;
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

// ➕ Insert multiple vehicles (programmatic seeding)
inventoryModel.insertSampleVehicles = async () => {
  try {
    const sql = `
      INSERT INTO public.vehicles (make, model, year, price, mileage, color, description, image, features, status)
      VALUES
      ('Tesla', 'Model 3', 2024, 42000, 5000, 'White', 'Electric Tesla Model 3 with autopilot.', '/images/tesla-model3.jpg', ARRAY['Autopilot','Touchscreen','Wireless Charging'], 'active'),
      ('BMW', 'X5', 2022, 60000, 10000, 'Black', 'Luxury BMW SUV with premium features.', '/images/bmw-x5.jpg', ARRAY['Sunroof','Heated Seats','All-Wheel Drive'], 'active'),
      ('Mercedes-Benz', 'C-Class', 2023, 48000, 8000, 'Silver', 'Elegant Mercedes-Benz sedan with advanced safety features.', '/images/mercedes-cclass.jpg', ARRAY['Adaptive Cruise Control','Lane Assist','Premium Audio'], 'active'),
      ('Hyundai', 'Elantra', 2022, 21000, 12000, 'Blue', 'Affordable Hyundai Elantra with great fuel economy.', '/images/hyundai-elantra.jpg', ARRAY['Bluetooth','Backup Camera','Apple CarPlay'], 'active'),
      ('Chevrolet', 'Tahoe', 2021, 55000, 25000, 'Black', 'Spacious Chevrolet Tahoe SUV with family-friendly features.', '/images/chevrolet-tahoe.jpg', ARRAY['Third Row Seating','Navigation','Rear Climate Control'], 'active');
    `;
    await pool.query(sql);
    return 'Sample vehicles inserted successfully!';
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  }
};

module.exports = inventoryModel;
