import express from 'express';
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipeController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protege todas as rotas de receitas
router.use(authMiddleware);

router.post('/', createRecipe);
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);

export default router;
