import { db } from '../config/db.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// Apenas para fins de administração, pode ser removido ou restrito a admins
export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.created_at
    }).from(users);
    res.status(200).json(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar usuários.' });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.created_at
    }).from(users).where(eq(users.id, id));

    if (user.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.status(200).json(user[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar usuário.' });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user.id;
  const { name, email, password } = req.body;

  if (id !== currentUserId) {
      return res.status(403).json({ message: 'Acesso negado. Você só pode atualizar seu próprio perfil.' });
  }

  const fieldsToUpdate = {};
  if (name) fieldsToUpdate.name = name;
  if (email) fieldsToUpdate.email = email;
  if (password) {
      fieldsToUpdate.password_hash = await bcrypt.hash(password, 10);
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({ message: 'Nenhum campo fornecido para atualização.' });
  }

  try {
    const updatedUser = await db.update(users)
      .set(fieldsToUpdate)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.created_at
      });

    if (updatedUser.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.status(200).json(updatedUser[0]);
  } catch (error) {
    // Unique constraint violation for email
    if (error.code === '23505') {
        return res.status(409).json({ message: 'Email já está em uso.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar usuário.' });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user.id;

  if (id !== currentUserId) {
    return res.status(403).json({ message: 'Acesso negado. Você só pode deletar seu próprio perfil.' });
  }

  try {
    const deletedUser = await db.delete(users).where(eq(users.id, id)).returning();
    if (deletedUser.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.status(200).json({ message: 'Usuário deletado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao deletar usuário.' });
  }
};
