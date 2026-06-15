import { body, validationResult } from 'express-validator';

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),

    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 })
        .withMessage('Location must be less than 200 characters'),

    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601()
        .withMessage('Date must be a valid date format'),

    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt()
        .withMessage('Organization must be a valid integer')
];

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
        // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-project');
    }
    
    // Extract form data from req.body
    const { title, description, location, date, organizationId } = req.body;

    try {
        // Create the new project in the database
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/projects/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
}
const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const categories = await getAllCategories();

    res.render('assign-categories', {
        title: 'Assign Categories',
        projectId,
        categories
    });
};

const processAssignCategoriesForm = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        let { categoryIds } = req.body;

        // Ensure categoryIds is always an array
        if (!categoryIds) categoryIds = [];
        if (!Array.isArray(categoryIds)) categoryIds = [categoryIds];

        await updateCategoryAssignments(projectId, categoryIds);

        req.flash('success', 'Categories assigned successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error assigning categories:', error);
        req.flash('error', 'Failed to assign categories.');
        res.redirect('/projects');
    }
};

// Export the controller functions for the route handlers
export { 
    showProjectsPage, 
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation, 
    showAssignCategoriesForm,
    processAssignCategoriesForm
};