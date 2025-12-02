import { API_URL } from "../constants/api";

const api = {
  async getAllCategories() {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  async getAllRecipes() {
    try {
      const response = await fetch(`${API_URL}/api/recipes`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching all recipes:", error);
      throw error;
    }
  },

  async getRecipesByCategoryId(categoryId) {
    try {
      const response = await fetch(`${API_URL}/api/categories/${categoryId}/recipes`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching recipes for category ${categoryId}:`, error);
      throw error;
    }
  },

  async getRecipeById(id) {
    try {
      const response = await fetch(`${API_URL}/api/recipes/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching recipe with id ${id}:`, error);
      throw error;
    }
  },
};

export default api;
