// src/controllers/projectsController.js
import {
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject                // <-- added import
} from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

// Constant for number of upcoming projects
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// ------------------------------------------------------------------
// Validation rules for new project form
// ------------------------------------------------------------------
export const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Project title is required')
        .isLength({ max: 255 }).withMessage('Title must not exceed 255 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Project description is required'),
    body('date')
        .isISO8601().withMessage('Valid project date is required')
        .toDate(),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required'),
    body('organizationId')
        .isInt({ min: 1 }).withMessage('Valid organization must be selected')
];

// ------------------------------------------------------------------
// Controller: Show all upcoming projects page
// ------------------------------------------------------------------
export const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';
    res.render('projects', { title, projects });
};

// ------------------------------------------------------------------
// Controller: Show a single project details page
// ------------------------------------------------------------------
export const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);

    if (!project) {
        const err = new Error('Project Not Found');
        err.status = 404;
        throw err;
    }

    const categories = await getCategoriesByProjectId(projectId);
    const title = project.title;
    res.render('project', { title, project, categories });
};

// ------------------------------------------------------------------
// Controller: Show the "Add New Project" form
// ------------------------------------------------------------------
export const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';
    res.render('new-project', { title, organizations });
};

// ------------------------------------------------------------------
// Controller: Process the "Add New Project" form submission
// ------------------------------------------------------------------
export const processNewProjectForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-project');
    }

    const { title, description, location, date, organizationId } = req.body;
    try {
        const newProjectId = await createProject(title, description, location, date, organizationId);
        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
};

// ------------------------------------------------------------------
// Controller: Show the "Edit Project" form
// ------------------------------------------------------------------
export const showEditProjectForm = async (req, res) => {
    const projectId = parseInt(req.params.id);
    try {
        const project = await getProjectDetails(projectId);
        if (!project) {
            return res.status(404).send('Project not found');
        }
        const organizations = await getAllOrganizations();
        res.render('edit-project', { project, organizations });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading edit form');
    }
};

// ------------------------------------------------------------------
// Controller: Process the "Edit Project" form submission
// ------------------------------------------------------------------
export const processEditProjectForm = async (req, res) => {
    const projectId = parseInt(req.params.id);
    const { organizationId, name, description } = req.body;
    try {
        await updateProject(projectId, parseInt(organizationId), name, description);
        res.redirect(`/project/${projectId}`); // matches the project details route
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating project');
    }
};