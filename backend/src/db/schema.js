import { pgTable, uuid, varchar, text, timestamp, primaryKey, customType } from "drizzle-orm/pg-core";

const textArray = customType({
    dataType() {
      return 'text[]';
    },
    toDriver(value) {
        return value;
    },
    fromDriver(value) {
        return value;
    }
  });

// Tabela de Usuários
export const users = pgTable("users", {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    password_hash: varchar('password_hash', { length: 255 }).notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Tabela de Categorias
export const categories = pgTable("categories", {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).unique().notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Tabela de Receitas
export const recipes = pgTable("recipes", {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    ingredients: textArray('ingredients').notNull(),
    instructions: text('instructions').notNull(),
    user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    category_id: uuid('category_id').notNull().references(() => categories.id, { onDelete: 'restrict' }),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Tabela de Favoritos (Tabela de Junção)
export const favorites = pgTable("favorites", {
    user_id: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    recipe_id: uuid('recipe_id').notNull().references(() => recipes.id, { onDelete: 'cascade' }),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow()
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.user_id, table.recipe_id] })
    }
});
