import express from 'express';

import { showHomePage } from './controllers/index.js';

// Organization controllers
import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    processEditOrganizationForm,
    organizationValidation,
    showEditOrganizationForm
} from './controllers/organizations.js';

// Project controllers
import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm
} from './controllers/projects.js';

// Category controllers
import {
    showCategoriesPage,
    showCategoryDetailsPage
} from './controllers/categories.js';

// Error controller
import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

/**
 * Home route
 */
router.get('/', showHomePage);

/**
 * Organizations routes
 */
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);

// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

// Route to display the edit organization form
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);
/**
 * Projects routes
 */
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

/**
 * Categories routes
 * 
 * 
 */
router.get('/category', (req, res) => {
  res.redirect('/categories');
});
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

// Route for new project page
router.get('/new-project', showNewProjectForm);

// Route to handle new project form submission
router.post('/new-project', processNewProjectForm);

/**
 * Test error route
 */
router.get('/test-error', testErrorPage);

export default router;