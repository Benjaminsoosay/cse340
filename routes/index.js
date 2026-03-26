import express from 'express';
import { showHomePage } from './index.js';
import { showOrganizationsPage, showOrganizationDetailsPage, showNewOrganizationForm } from './organizations.js';
import { showProjectsPage, showProjectDetailsPage } from './projects.js';
import { showCategoriesPage, showCategoryDetailsPage } from './categories.js';
import { testErrorPage } from './errors.js';

const router = express.Router();

// Main pages
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// Detail pages
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/category/:id', showCategoryDetailsPage);

// New route for new organization form
router.get('/new-organization', showNewOrganizationForm);

// Test route for errors
router.get('/test-error', testErrorPage);

export default router;