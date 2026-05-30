import db from './db.js';

/**
 * Retrieves all projects from the database
 */
const getAllProjects = async () => {
    const query = `
        SELECT project_id, title, description, status, start_date, end_date
        FROM public.project;
    `;
    const result = await db.query(query);
    return result.rows;
};

/**
 * Retrieves projects filtered by organization ID
 */
const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT project_id, organization_id, title, description, location, date
        FROM public.project
        WHERE organization_id = $1
        ORDER BY date;
    `;
    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);
    return result.rows;
};

/**
 * Retrieves a limited number of upcoming service projects including the organization name
 */
const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM public.projects p   /* Changed from project to projects */
        INNER JOIN public.organization o ON p.organization_id = o.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date ASC
        LIMIT $1;
    `;

    const queryParams = [number_of_projects];
    const result = await db.query(query, queryParams);
    return result.rows;
};

/**
 * Retrieves details for a specific service project by its ID
 */
const getProjectDetails = async (id) => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM public.projects p   /* Changed from project to projects */
        INNER JOIN public.organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;
    const queryParams = [id];
    const result = await db.query(query, queryParams);
    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Retrieves a single category by its ID
 * @param {number|string} categoryId
 * @returns {Promise<Object|null>} The category object, or null if not found
 */
const getCategoryById = async (categoryId) => {
    const query = `
        SELECT category_id, category_name 
        FROM public.categories
        WHERE category_id = $1;
    `;
    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);
    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Retrieves all categories associated with a specific service project
 * @param {number|string} projectId
 * @returns {Promise<Array>} List of category objects
 */
const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.category_name
        FROM public.categories c
        INNER JOIN public.project_categories pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.category_name ASC;
    `;
    const queryParams = [projectId];
    const result = await db.query(query, queryParams);
    return result.rows;
};

/**
 * Retrieves all service projects associated with a specific category
 * Includes the partner organization name via an extra JOIN
 * @param {number|string} categoryId
 * @returns {Promise<Array>} List of project objects
 */
const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.date,
            p.location,
            p.organization_id,
            o.name AS organization_name
        FROM public.projects p
        INNER JOIN public.organization o ON p.organization_id = o.organization_id
        INNER JOIN public.project_categories pc ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.date ASC;
    `;
    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);
    return result.rows;
};


// Export all model functions (Make sure all names here match the functions above!)
export { 
    getAllProjects, 
    getProjectsByOrganizationId, 
    getUpcomingProjects,
    getProjectDetails,
    // New additions:
    getCategoryById,
    getCategoriesByProjectId,
    getProjectsByCategoryId
};