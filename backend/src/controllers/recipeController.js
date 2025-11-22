import { db } from '../config/db.js';
import { recipes } from '../db/schema.js';
import { and, eq } from 'drizzle-orm';

export const createRecipe = async (req, res) => {
  const { name, description, ingredients, instructions, category_id } = req.body;
  const user_id = req.user.id;

  if (!name || !ingredients || !instructions || !category_id) {
    return res.status(400).json({ message: 'Campos obrigatórios não preenchidos.' });
  }

  try {
    const newRecipe = await db.insert(recipes).values({
      name,
      description,
      ingredients,
      instructions,
      category_id,
      user_id,
    }).returning();
    res.status(201).json(newRecipe[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar receita.' });
  }
};

export const getAllRecipes = async (req, res) => {
  try {
    const allRecipes = await db.select().from(recipes);
    res.status(200).json(allRecipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar receitas.' });
  }
};

export const getRecipeById = async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await db.select().from(recipes).where(eq(recipes.id, id));
    if (recipe.length === 0) {
      return res.status(404).json({ message: 'Receita não encontrada.' });
    }
    res.status(200).json(recipe[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar receita.' });
  }
};

export const getRecipesByCategoryId = async (req, res) => {
    const { categoryId } = req.params;
    try {
      const recipesByCategory = await db.select().from(recipes).where(eq(recipes.category_id, categoryId));
      res.status(200).json(recipesByCategory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar receitas por categoria.' });
    }
  };

export const updateRecipe = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  const { name, description, ingredients, instructions, category_id } = req.body;

  try {
    const recipeToUpdate = await db.select().from(recipes).where(eq(recipes.id, id));
    if (recipeToUpdate.length === 0) {
      return res.status(404).json({ message: 'Receita não encontrada.' });
    }

    if (recipeToUpdate[0].user_id !== user_id) {
      return res.status(403).json({ message: 'Acesso negado. Você não pode editar a receita de outro usuário.' });
    }

    const updatedRecipe = await db.update(recipes)
      .set({ name, description, ingredients, instructions, category_id })
      .where(eq(recipes.id, id))
      .returning();

    res.status(200).json(updatedRecipe[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar receita.' });
  }
};

export const deleteRecipe = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const recipeToDelete = await db.select().from(recipes).where(eq(recipes.id, id));
    if (recipeToDelete.length === 0) {
      return res.status(404).json({ message: 'Receita não encontrada.' });
    }

    if (recipeToDelete[0].user_id !== user_id) {
      return res.status(403).json({ message: 'Acesso negado. Você não pode deletar a receita de outro usuário.' });
    }

    await db.delete(recipes).where(eq(recipes.id, id));
    res.status(200).json({ message: 'Receita deletada com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao deletar receita.' });
  }
};
