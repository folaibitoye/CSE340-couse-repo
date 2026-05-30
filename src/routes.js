import express from 'express';
import { showOrganizationDetailsPage } from './controllers/organizations.js';
import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage } from './controllers/organizations.js';
import { testErrorPage } from './controllers/errors.js';

// Project controllers
import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';

// 1. Updated categories import to pull the new detail page controller function
import { showCategoriesPage, showCategoryDetailsPage } from './controllers/categories.js';
const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);

// Left untouched as requested — the controller logic swap handles this automatically!
router.get('/projects', showProjectsPage); 

router.get('/categories', showCategoriesPage);
// 2. Created the dynamic route for a single category details view
// Matches URLs like /category/1, /category/2, etc.
router.get('/category/:id', showCategoryDetailsPage);

// 2. Created the dynamic route for a single project details view
router.get('/project/:id', showProjectDetailsPage);

// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;