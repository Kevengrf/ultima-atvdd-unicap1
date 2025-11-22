import { db } from '../config/db.js';
import { categories } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'O nome da categoria é obrigatório.' });
  }

  try {
    const newCategory = await db.insert(categories).values({ name }).returning();
    res.status(201).json(newCategory[0]);
  } catch (error) {
    // Unique constraint violation
    if (error.code === '23505') {
        return res.status(409).json({ message: 'Categoria já existe.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar categoria.' });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const allCategories = await db.select().from(categories);
    res.status(200).json(allCategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar categorias.' });
  }
};

export const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await db.select().from(categories).where(eq(categories.id, id));
    if (category.length === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada.' });
    }
    res.status(200).json(category[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar categoria.' });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'O nome da categoria é obrigatório.' });
  }

  try {
    const updatedCategory = await db.update(categories)
      .set({ name })
      .where(eq(categories.id, id))
      .returning();

    if (updatedCategory.length === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada.' });
    }
    res.status(200).json(updatedCategory[0]);
  } catch (error)
 {
    // Unique constraint violation
    if (error.code === '23505') {
        return res.status(409).json({ message: 'Já existe uma categoria com este nome.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar categoria.' });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCategory = await db.delete(categories).where(eq(categories.id, id)).returning();
    if (deletedCategory.length === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada.' });
    }
    res.status(200).json({ message: 'Categoria deletada com sucesso.' });
  } catch (error) {
    // Foreign key violation
    if (error.code === '23503') {
        return res.status(400).json({ message: 'Não é possível deletar a categoria, pois existem receitas associadas a ela.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Erro ao deletar categoria.' });
  }
};
