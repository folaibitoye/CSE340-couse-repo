import {
  getAllCategories,
  getCategoryById
} from '../models/categories.js';

import {
  getProjectsByCategoryId
} from '../models/projects.js';

const showCategoriesPage = async (req, res) => {
  const categories = await getAllCategories();

  res.render('categories', {
    title: 'Service Categories',
    
    categories
  });
};

const showCategoryDetailsPage = async (req, res) => {
  const categoryId = req.params.id;

  const category =
    await getCategoryById(categoryId);

  const projects =
    await getProjectsByCategoryId(categoryId);

  if (!category) {
    return res.status(404).render('404', {
      title: 'Category Not Found'
    });
  }

  res.render('category', {
    title: category.category_name,
    category,
    projects
  });
};

export {
    showCategoriesPage,
    showCategoryDetailsPage
};