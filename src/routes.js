import express from 'express';

import { showHomePage } from './controllers/index.js';

// Organization controllers
import {
    showOrganizationsPage,
    showOrganizationDetailsPage
} from './controllers/organizations.js';

// Project controllers
import {
    showProjectsPage,
    showProjectDetailsPage
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

/**
 * Projects routes
 */
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

/**
 * Categories routes
 */
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

/**
 * Test error route
 */
router.get('/test-error', testErrorPage);

export default router;