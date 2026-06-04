
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categories.controller');

router.post('/create', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);
router.post('/search', categoryController.searchCategories);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

module.exports = router;
