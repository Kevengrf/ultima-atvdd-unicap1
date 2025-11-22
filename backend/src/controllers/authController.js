import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import 'dotenv/config';
import { logError } from '../utils/logger.js';

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
  }

  try {
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Email já cadastrado.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await db.insert(users).values({ name, email, password_hash: passwordHash }).returning({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.created_at
      });

    const token = jwt.sign({ id: newUser[0].id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ user: newUser[0], token });
  } catch (error) {
    console.error(error);
    await logError(error);
    res.status(500).json({ message: 'Erro ao registrar usuário.' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  try {
    const userResult = await db.select().from(users).where(eq(users.email, email));
    if (userResult.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const user = userResult[0];
    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at
    }

    res.status(200).json({ user: userResponse, token });
  } catch (error) {
    console.error(error);
    await logError(error);
    res.status(500).json({ message: 'Erro ao fazer login.' });
  }
};
