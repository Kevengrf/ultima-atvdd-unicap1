import express from 'express';
import { getRecipesByCategoryId } from '../controllers/recipeController.js';

const router = express.Router({ mergeParams: true });

router.get('/', getRecipesByCategoryId);

export default router;
