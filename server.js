import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import session from 'express-session';
import { pool, testConnection } from './src/db.js';
import router from './src/controllers/routes.js';
import flash from './src/middleware/flash.js';
import categoryRoutes from './src/controllers/categoryRoutes.js';

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

// Request logging middleware (development only)
app.use((req, res, next) => {
    if (NODE_ENV === 'development') console.log(`${req.method} ${req.url}`);
    next();
});

// Set NODE_ENV in locals (always)
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }
}));
app.use(flash);

// ✅ Add middleware to make user login status available in all views
app.use((req, res, next) => {
    res.locals.isLoggedIn = !!req.session.user;
    res.locals.user = req.session.user || null;
    next();
});

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

        const errors = {};
        if (!name) errors.name = 'Name is required';

        if (Object.keys(errors).length > 0) {
            req.flash('error', 'Please fix the errors below');
            return res.render('organization-form', { organization: req.body, errors });
        }

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
// Mount category API routes under /api/categories
// -------------------------------------------------------------------
app.use('/api/categories', categoryRoutes);   // ✅ API endpoints separate

// -------------------------------------------------------------------
// Mount the main router (HTML routes)
// -------------------------------------------------------------------
app.use(router);

// -------------------------------------------------------------------
// 404 and error handlers – these must come AFTER all route definitions
// -------------------------------------------------------------------
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Error handler: send JSON for API requests, otherwise render HTML error page
app.use((err, req, res, next) => {
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);

    const status = err.status || 500;

    // If the request expects JSON (e.g., API routes), return JSON error
    if (req.path.startsWith('/api/') || req.xhr || req.headers.accept?.includes('application/json')) {
        res.status(status).json({
            error: err.message,
            status: status
        });
        return;
    }

    // Otherwise render the appropriate HTML error page
    const template = status === 404 ? '404' : '500';
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack,
        // These locals are already set, but we pass them again to ensure they are available
        isLoggedIn: req.session?.user ? true : false,
        user: req.session?.user || null
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