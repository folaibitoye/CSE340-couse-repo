import db from './db.js';

/**
 * Fetches the complete master list of categories ordered alphabetically.
 * Useful for populating dropdowns, filters, or creation forms.
 */
const getAllCategories = async () => {
    const query = `
        SELECT category_id, name 
        FROM public.categories
        ORDER BY name ASC;
    `;

    const result = await db.query(query);
    return result.rows;
};

/**
 * Fetches all categories associated with a specific service project.
 * @param {number} projectId - The ID of the project
 */
const getCategoriesByProject = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name
        FROM public.categories c
        JOIN public.project_categories pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name ASC;
    `;

    const result = await db.query(query, [projectId]);
    return result.rows;
};

/**
 * Fetches all categories alongside the total number of projects assigned to each.
 * Useful for dashboard statistics or navigation sidebars.
 */
const getCategoriesWithCounts = async () => {
    const query = `
        SELECT 
            c.category_id,
            c.name,
            COUNT(pc.project_id)::INT AS project_count
        FROM public.categories c
        LEFT JOIN public.project_categories pc ON c.category_id = pc.category_id
        GROUP BY c.category_id, c.name
        ORDER BY project_count DESC, c.name ASC;
    `;

    const result = await db.query(query);
    return result.rows;
};

export { 
    getAllCategories, 
    getCategoriesByProject, 
    getCategoriesWithCounts 
};