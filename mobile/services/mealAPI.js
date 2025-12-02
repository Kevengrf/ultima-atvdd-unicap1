import { recipes } from '../mock/recipes';
import { categories } from '../mock/categories';
import { favorites } from '../mock/favorites';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mealAPI = {
  async getAllRecipes() {
    await delay(500);
    return recipes;
  },

  async getRecipeById(id) {
    await delay(500);
    const recipe = recipes.find(r => r.id === parseInt(id));
    return recipe;
  },

  async getAllCategories() {
    await delay(500);
    return categories;
  },

  async getRecipesByCategoryId(categoryId) {
    await delay(500);
    return recipes.filter(r => r.category_id === categoryId);
  },

  async getUserFavorites(userId) {
    await delay(500);
    return recipes.filter(r => favorites.includes(r.id));
  },

  async addFavorite(userId, recipeId) {
    await delay(500);
    if (!favorites.includes(recipeId)) {
      favorites.push(recipeId);
    }
    return { success: true };
  },

  async removeFavorite(userId, recipeId) {
    await delay(500);
    const index = favorites.indexOf(recipeId);
    if (index > -1) {
      favorites.splice(index, 1);
    }
    return { success: true };
  },

  async searchMealsByName(query) {
    await delay(500);
    if (!query) return [];
    return recipes.filter(r => r.name.toLowerCase().includes(query.toLowerCase()));
  },

  async filterByIngredient(query) {
    await delay(500);
    if (!query) return [];
    return recipes.filter(r => r.ingredients.some(i => i.toLowerCase().includes(query.toLowerCase())));
  },

  async getRandomMeals(count) {
    await delay(500);
    const shuffled = recipes.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  },

  transformMealData(meal) {
    // This function is now mostly a pass-through since our mock data is already in the desired format.
    // However, we'll keep it for consistency in case of any minor transformations needed.
    return meal;
  }
};