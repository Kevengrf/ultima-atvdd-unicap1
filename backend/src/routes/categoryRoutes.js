import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import categoryRecipeRoutes from './categoryRecipeRoutes.js';

const router = express.Router();

// Todas as rotas de categorias são protegidas
router.use(authMiddleware);

router.use('/:categoryId/recipes', categoryRecipeRoutes);

router.post('/', createCategory);
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
