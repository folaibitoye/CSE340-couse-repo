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

const showCategoryDetailsPage = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    const category =
      await getCategoryById(categoryId);

    if (!category) {
      return res.status(404).render('404', {
        title: 'Category Not Found'
      });
    }

    const projects =
      await getProjectsByCategoryId(categoryId);

    res.render('category', {
      title: category.category_name,
      category,
      projects
    });

  } catch (error) {
    console.error('Category Details Error:', error);
    next(error);
  }
};

export {
    showCategoriesPage,
    showCategoryDetailsPage
};