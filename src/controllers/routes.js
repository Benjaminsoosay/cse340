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
  showEditProjectForm,       // added
  processEditProjectForm      // added
} from './projects.js';
import {
  showCategoriesPage,
  showCategoryDetailsPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm
} from './categories.js';
import { testErrorPage } from './errors.js';

const router = express.Router();

// Main pages
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// New organization form (static route must come before dynamic)
router.get('/organization/new', showNewOrganizationForm);
// POST route for new organization is now handled in server.js
// router.post('/organization', organizationValidation, processNewOrganizationForm); // REMOVED

// Edit organization form and processing
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// New project routes – both GET and POST for /new-project
router.get('/new-project', showNewProjectForm);                 // display form
router.post('/new-project', projectValidation, processNewProjectForm); // handle submission

// (Optional) Alternative route if you still need /project/new – keep or remove as needed
router.get('/project/new', showNewProjectForm); // may be removed if you consolidate to /new-project

// Edit project routes – added
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', processEditProjectForm);  // optionally add validation if needed

// Project category assignment routes
router.get('/project/:projectId/assign-categories', showAssignCategoriesForm);
router.post('/project/:projectId/assign-categories', processAssignCategoriesForm);

// Detail pages (dynamic)
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/category/:id', showCategoryDetailsPage);

// Test route for errors
router.get('/test-error', testErrorPage);

export default router;