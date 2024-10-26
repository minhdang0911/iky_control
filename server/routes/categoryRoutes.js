const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

// Định nghĩa route để tạo danh mục
router.post('/create-category', verifyAccessToken, categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.delete('/:id', verifyAccessToken, categoryController.deleteCategory);
router.put('/:id', verifyAccessToken, categoryController.updateCategory);
router.post('/import-categories', categoryController.importCategories);

module.exports = router;
