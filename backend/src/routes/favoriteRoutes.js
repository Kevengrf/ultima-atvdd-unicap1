import express from 'express';
import {
  addFavorite,
  removeFavorite,
  getUserFavorites,
} from '../controllers/favoriteController.js';

// Note: O `mergeParams: true` é crucial para que as rotas aninhadas recebam os parâmetros da rota pai (ex: /users/:userId)
const router = express.Router({ mergeParams: true });

// O authMiddleware já foi aplicado no userRoutes, então estas rotas já estão protegidas
router.post('/', addFavorite);
router.get('/', getUserFavorites);
router.delete('/:recipeId', removeFavorite);

export default router;
