import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import favoriteRoutes from './favoriteRoutes.js';

const router = express.Router();

// Protege todas as rotas de usuários
router.use(authMiddleware);

// Aninha as rotas de favoritos sob /users/:userId/favorites
// O :userId será acessível dentro do favoriteRoutes graças ao mergeParams
router.use('/:userId/favorites', favoriteRoutes);

router.get('/', getAllUsers); // Pode ser restrito a administradores no futuro
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
