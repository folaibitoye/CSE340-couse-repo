import { body, validationResult } from 'express-validator';

import {
  getAllCategories,
  getCategoryById
} from '../models/categories.js';

import {
  getProjectsByCategoryId
} from '../models/projects.js';

const categoryValidation = [
  body('category_name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Category name must be between 3 and 100 characters')
];

const showNewCategoryForm = (req, res) => {
  res.render('new-category', {
    title: 'Create New Category'
  });
};

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

const processNewCategoryForm = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    errors.array().forEach(err => req.flash('error', err.msg));
    return res.redirect('/categories/new');
  }

  const { category_name } = req.body;

  try {
    await getAllCategories(); // (not needed but keeps structure clean)

    await require('../models/db.js').default.query(
      `INSERT INTO categories (category_name) VALUES ($1)`,
      [category_name]
    );

    req.flash('success', 'Category created successfully!');
    res.redirect('/categories');

  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to create category');
    res.redirect('/categories/new');
  }
};

const showEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;

  const result = await require('../models/db.js').default.query(
    `SELECT * FROM categories WHERE category_id = $1`,
    [categoryId]
  );

  if (result.rows.length === 0) {
    return res.status(404).render('404', {
      title: 'Category Not Found'
    });
  }

  res.render('edit-category', {
    title: 'Edit Category',
    category: result.rows[0]
  });
};

const processEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    errors.array().forEach(err => req.flash('error', err.msg));
    return res.redirect(`/categories/edit/${categoryId}`);
  }

  const { category_name } = req.body;

  try {
    await require('../models/db.js').default.query(
      `UPDATE categories
       SET category_name = $1
       WHERE category_id = $2`,
      [category_name, categoryId]
    );

    req.flash('success', 'Category updated successfully!');
    res.redirect('/categories');

  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to update category');
    res.redirect(`/categories/edit/${categoryId}`);
  }
};

export {
  showCategoriesPage,
  showCategoryDetailsPage,
  showNewCategoryForm,
  processNewCategoryForm,
  categoryValidation,
  showEditCategoryForm,
  processEditCategoryForm
};