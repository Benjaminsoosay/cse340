import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import session from 'express-session';
import { testConnection } from './src/db.js';
import router from './src/controllers/routes.js';
import flash from './src/middleware/flash.js';
// IMPORTANT: adjust this import to match your db.js export
import pool from './src/db.js';   // <-- default export

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- Middleware ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use((req, res, next) => {
    if (NODE_ENV === 'development') console.log(`${req.method} ${req.url}`);
    next();
});
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }
}));
app.use(flash);

// -------------------------------------------------------------------
// 1. Display the "Create Organization" form (static route)
// -------------------------------------------------------------------
app.get('/organization/new', (req, res) => {
    res.render('organization-form', { 
        title: 'Create New Organization',
        organization: {}, 
        errors: {} 
    });
});

// -------------------------------------------------------------------
// 2. Handle new organization creation (updated to match schema)
// -------------------------------------------------------------------
app.post('/organization', async (req, res) => {
    try {
        const { name, description, contact_email, logo_filename } = req.body;

        // Basic validation
        const errors = {};
        if (!name) errors.name = 'Name is required';

        if (Object.keys(errors).length > 0) {
            req.flash('error', 'Please fix the errors below');
            return res.render('organization-form', { organization: req.body, errors });
        }

        // Insert into the 'organization' table
        const result = await pool.query(
            `INSERT INTO organization (name, description, contact_email, logo_filename)
             VALUES ($1, $2, $3, $4)
             RETURNING organization_id`,
            [name, description, contact_email, logo_filename]
        );

        const newOrgId = result.rows[0].organization_id;
        req.flash('success', 'Organization created successfully');
        res.redirect(`/organization/${newOrgId}`);

    } catch (error) {
        console.error('Error creating organization:', error);
        req.flash('error', 'Failed to create organization');
        res.render('organization-form', { organization: req.body, errors: {} });
    }
});

// -------------------------------------------------------------------
// Mount the main router (all other routes)
// -------------------------------------------------------------------
app.use(router);

// -------------------------------------------------------------------
// 404 and error handlers
// -------------------------------------------------------------------
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    };
    res.status(status).render(`errors/${template}`, context);
});

app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});