// models/users.js
import bcrypt from 'bcrypt';
import { pool } from '../db.js';

/**
 * Create a new user
 * @param {string} name - User's full name
 * @param {string} email - User's email address (unique)
 * @param {string} passwordHash - Already hashed password (bcrypt)
 * @returns {Promise<number>} The new user's ID
 */
export const createUser = async (name, email, passwordHash) => {
    const query = `
        INSERT INTO users (name, email, password_hash, role_id)
        VALUES ($1, $2, $3, (SELECT id FROM roles WHERE role_name = 'user'))
        RETURNING id
    `;
    const values = [name, email, passwordHash];
    const result = await pool.query(query, values);
    return result.rows[0].id;
};

/**
 * Authenticate a user by email and password
 * @param {string} email - User's email
 * @param {string} password - Plain text password to verify
 * @returns {Promise<object|null>} User object (with role_name) if authenticated, else null
 */
export const authenticateUser = async (email, password) => {
    const query = `
        SELECT u.id, u.name, u.email, u.password_hash, r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE u.email = $1
    `;
    const result = await pool.query(query, [email]);
    if (result.rows.length === 0) return null;

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return null;

    // Return user without the password hash
    delete user.password_hash;
    return user;
};

/**
 * Get all users (with role names)
 * @returns {Promise<Array>} List of users (excluding password hashes)
 */
export const getAllUsers = async () => {
    const query = `
        SELECT u.id, u.name, u.email, r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.id
        ORDER BY u.id
    `;
    const result = await pool.query(query);
    return result.rows;
};

/**
 * Get a single user by ID (with role name)
 * @param {number|string} id - User ID
 * @returns {Promise<object|null>} User object or null if not found
 */
export const getUserById = async (id) => {
    const query = `
        SELECT u.id, u.name, u.email, r.role_name
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE u.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
};

/**
 * Update a user's role
 * @param {number|string} userId - User ID
 * @param {string} roleName - New role name (e.g., 'admin', 'user')
 * @returns {Promise<boolean>} True if update succeeded
 */
export const updateUserRole = async (userId, roleName) => {
    const query = `
        UPDATE users
        SET role_id = (SELECT id FROM roles WHERE role_name = $1)
        WHERE id = $2
    `;
    const result = await pool.query(query, [roleName, userId]);
    return result.rowCount > 0;
};