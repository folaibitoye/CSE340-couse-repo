// Configuration Constant
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Import the needed model functions
import { 
    getUpcomingProjects, 
    getProjectDetails,
    getCategoriesByProjectId,
    createProject// Add this
} from '../models/projects.js';

import { 
   getAllOrganizations// Add this
} from '../models/organizations.js';


/**
 * Handles rendering the main projects page, now limited to upcoming projects
 */

const showProjectsPage = async (req, res) => {
    try {
        // Fetch only the next 5 upcoming projects
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const title = 'Upcoming Service Projects';

        res.render('projects', { title, projects });
    } catch (error) {
        console.error("Error in showProjectsPage:", error);
        res.status(500).send("Server Error");
    }
};  

/**
 * UPDATED: Handles rendering details for a single project, now including its categories
 */
const showProjectDetailsPage = async (req, res) => {
    try {
        const projectId = req.params.id; 
        
        // Fetch both the project details and its tags/categories from the database
        const project = await getProjectDetails(projectId);
        const categories = await getCategoriesByProjectId(projectId);

        if (!project) {
            return res.status(404).render('404', { title: 'Project Not Found' });
        }

        const title = project.title; 
        
        // Pass both 'project' and 'categories' arrays to the view template
        res.render('project', { title, project, categories });
    } catch (error) {
        console.error("Error in showProjectDetailsPage:", error);
        res.status(500).send("Server Error");
    }
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
}

const processNewProjectForm = async (req, res) => {
    // Extract form data from req.body
    const { title, description, location, date, organizationId } = req.body;

    try {
        // Create the new project in the database
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
}

// Export the controller functions for the route handlers
export { 
    showProjectsPage, 
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm
};