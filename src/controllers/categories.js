// Create or update this file: src/controllers/categories.js

import { 
    getCategoryById, 
    getProjectsByCategoryId 
} from '../models/projects.js';

/**
 * Handles rendering the main overview of all categories (Existing function)
 */
const showCategoriesPage = async (req, res) => {
    try {
        // Your existing logic to get all categories for the main directory page...
        res.render('categories', { title: 'Service Categories' });
    } catch (error) {
        console.error("Error in showCategoriesPage:", error);
        res.status(500).send("Server Error");
    }
};

/**
 * NEW: Handles rendering the details page for a specific category
 * Shows the category name and lists all projects matching this category tag
 */
const showCategoryDetailsPage = async (req, res) => {
    try {
        const categoryId = req.params.id;

        // Fetch data concurrently from the database models
        const category = await getCategoryById(categoryId);
        const projects = await getProjectsByCategoryId(categoryId);

        // Guard clause in case the category ID does not exist
        if (!category) {
            return res.status(404).render('404', { title: 'Category Not Found' });
        }

        // Render a new view (category.ejs) passing the dynamic title, category info, and projects list
        res.render('category', { 
            title: `${category.category_name} Projects`, 
            category, 
            projects 
        });
    } catch (error) {
        console.error("Error in showCategoryDetailsPage:", error);
        res.status(500).send("Server Error");
    }
};

export { 
    showCategoriesPage, 
    showCategoryDetailsPage 
};