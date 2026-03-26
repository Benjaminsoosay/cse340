import express from 'express';
import { showHomePage } from './index.js';
import {
  showOrganizationsPage,
  showOrganizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  organizationValidation,
  showEditOrganizationForm,
  processEditOrganizationForm
} from './organizations.js';
import {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  projectValidation,
  showEditProjectForm,
  processEditProjectForm
} from './projects.js';
import {
  showCategoriesPage,
  showCategoryDetailsPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm
} from './categories.js';
import { testErrorPage } from './errors.js';

const router = express.Router();

// ==================================================
// MAIN PAGES (no dynamic parameters)
// ==================================================
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// ==================================================
// ORGANIZATION ROUTES
// ==================================================
// Static route: display new organization form
router.get('/organization/new', showNewOrganizationForm);
// POST for new organization is handled in server.js (kept separate)

// Edit organization routes (dynamic :id)
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// ==================================================
// PROJECT ROUTES
// ==================================================
// Static routes for new project (must come before dynamic routes)
router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, processNewProjectForm);
// Alternative static route (optional)
router.get('/project/new', showNewProjectForm);

// Edit project routes (dynamic :id)
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', processEditProjectForm); // add validation if needed

// Project category assignment (dynamic :projectId)
router.get('/project/:projectId/assign-categories', showAssignCategoriesForm);
router.post('/project/:projectId/assign-categories', processAssignCategoriesForm);

// ==================================================
// DETAIL PAGES (dynamic :id)
// ==================================================
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/project/:id', showProjectDetailsPage);       // project details
router.get('/category/:id', showCategoryDetailsPage);

// ==================================================
// TEST ROUTE
// ==================================================
router.get('/test-error', testErrorPage);

// No wildcard routes – all defined routes are explicit or use :id parameters.
// 404 handling is delegated to the main server.js after this router.

export default router;