import { recipes } from '../mock/recipes';
import { categories } from '../mock/categories';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const transformRecipeData = (recipe) => {
  if (!recipe) return null;
  // The frontend components expect a 'title' field and an 'image' object with a URI
  return {
    ...recipe,
    title: recipe.name,
    image: { uri: recipe.image },
  };
};

export const mealAPI = {
  async getAllRecipes() {
    await delay(50);
    return recipes.map(transformRecipeData);
  },

  async getRecipeById(id) {
    await delay(50);
    const recipe = recipes.find(r => r.id.toString() === id.toString());
    return transformRecipeData(recipe);
  },

  async getAllCategories() {
    await delay(50);
    return categories;
  },

  async getRecipesByCategoryId(categoryId) {
    await delay(50);
    const filtered = recipes.filter(r => r.category_id.toString() === categoryId.toString());
    return filtered.map(transformRecipeData);
  },

  // Restore search functions for search.jsx
  async searchMealsByName(query) {
    await delay(50);
    if (!query) return [];
    return recipes
      .filter(r => r.name.toLowerCase().includes(query.toLowerCase()))
      .map(transformRecipeData);
  },

  async filterByIngredient(query) {
    await delay(50);
    if (!query) return [];
    // The mock data's ingredients is an array of strings
    return recipes
      .filter(r => r.ingredients.some(i => i.toLowerCase().includes(query.toLowerCase())))
      .map(transformRecipeData);
  },

  async getRandomMeals(count) {
    await delay(50);
    const shuffled = [...recipes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(transformRecipeData);
  },

  // Kept for backwards compatibility with original search screen code
  transformMealData(meal) {
    return transformRecipeData(meal);
  }
};