import { API_URL } from '../constants/api';
import { authService } from './authService';

const getAuthHeaders = async () => {
  const token = await authService.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const mealAPI = {
  async getAllRecipes() {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/recipes`, { headers });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch recipes');
      }
      return data;
    } catch (error) {
      console.error('Error fetching all recipes:', error);
      throw error;
    }
  },

  async getRecipeById(id) {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/recipes/${id}`, { headers });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch recipe by ID');
      }
      return data;
    } catch (error) {
      console.error('Error fetching recipe by ID:', error);
      throw error;
    }
  },

  async getAllCategories() {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/categories`, { headers });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch categories');
      }
      return data;
    } catch (error) {
      console.error('Error fetching all categories:', error);
      throw error;
    }
  },

  async getRecipesByCategoryId(categoryId) {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/categories/${categoryId}/recipes`, { headers });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch recipes by category ID');
      }
      return data;
    } catch (error) {
      console.error('Error fetching recipes by category ID:', error);
      throw error;
    }
  },

  async getUserFavorites(userId) {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/users/${userId}/favorites`, { headers });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user favorites');
      }
      return data;
    } catch (error) {
      console.error('Error fetching user favorites:', error);
      throw error;
    }
  },

  async addFavorite(userId, recipeId) {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/users/${userId}/favorites`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ recipe_id: recipeId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add favorite');
      }
      return data;
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  },

  async removeFavorite(userId, recipeId) {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/users/${userId}/favorites/${recipeId}`, {
        method: 'DELETE',
        headers,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove favorite');
      }
      return data;
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  },
};