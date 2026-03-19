// Import any needed model functions
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
// ADD THIS IMPORT - get categories for a project
import { getCategoriesByProjectId } from '../models/categories.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define any controller functions
const showProjectsPage = async (req, res) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const title = 'Upcoming Service Projects';

        res.render('projects', { title, projects });
    } catch (err) {
        console.error('Error in showProjectsPage:', err);
        res.status(500).render('errors/500', { 
            title: 'Server Error',
            message: 'Unable to load projects at this time.' 
        });
    }
};

// UPDATE THIS FUNCTION - add categories
const showProjectDetailsPage = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);
        
        if (!project) {
            return res.status(404).render('errors/404', { 
                title: 'Project Not Found',
                message: 'The requested project could not be found.' 
            });
        }
        
        // NEW: Get categories for this project
        const categories = await getCategoriesByProjectId(projectId);
        
        const title = project.title;
        // UPDATE: Add categories to the render data
        res.render('project', { title, project, categories });
    } catch (err) {
        console.error('Error in showProjectDetailsPage:', err);
        res.status(500).render('errors/500', { 
            title: 'Server Error',
            message: 'Unable to load project details at this time.' 
        });
    }
};

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };