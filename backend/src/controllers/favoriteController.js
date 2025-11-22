import { db } from '../config/db.js';
import { favorites, recipes } from '../db/schema.js';
import { and, eq } from 'drizzle-orm';

export const addFavorite = async (req, res) => {
  const { recipe_id } = req.body;
  const user_id = req.user.id;
  const { userId: param_user_id } = req.params;

  if (user_id !== param_user_id) {
    return res.status(403).json({ message: 'Acesso negado. Você só pode adicionar favoritos à sua própria lista.' });
  }

  if (!recipe_id) {
    return res.status(400).json({ message: 'O ID da receita é obrigatório.' });
  }

  try {
    const newFavorite = await db.insert(favorites).values({
      user_id,
      recipe_id,
    }).returning();
    res.status(201).json(newFavorite[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Esta receita já está nos seus favoritos.' });
    }
    if (error.code === '23503') {
        return res.status(404).json({ message: 'Receita não encontrada.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Erro ao adicionar favorito.' });
  }
};

export const removeFavorite = async (req, res) => {
  const { userId, recipeId } = req.params;
  const currentUserId = req.user.id;

  if (userId !== currentUserId) {
    return res.status(403).json({ message: 'Acesso negado. Você só pode remover favoritos da sua própria lista.' });
  }

  try {
    const deletedFavorite = await db.delete(favorites).where(
      and(
        eq(favorites.user_id, userId),
        eq(favorites.recipe_id, recipeId)
      )
    ).returning();

    if (deletedFavorite.length === 0) {
        return res.status(404).json({ message: 'Favorito não encontrado.' });
    }

    res.status(200).json({ message: 'Favorito removido com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao remover favorito.' });
  }
};

export const getUserFavorites = async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.id;

  if (userId !== currentUserId) {
    return res.status(403).json({ message: 'Acesso negado. Você só pode ver sua própria lista de favoritos.' });
  }

  try {
    const userFavorites = await db.select({
        recipe: recipes
    })
    .from(favorites)
    .leftJoin(recipes, eq(favorites.recipe_id, recipes.id))
    .where(eq(favorites.user_id, userId));

    const favoriteRecipes = userFavorites.map(fav => fav.recipe);

    res.status(200).json(favoriteRecipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar favoritos.' });
  }
};
