import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../constants/api';

const TOKEN_KEY = 'jwt_token';
const USER_ID_KEY = 'user_id';

export const authService = {
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      await SecureStore.setItemAsync(TOKEN_KEY, data.token);
      await SecureStore.setItemAsync(USER_ID_KEY, String(data.user.id));
      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async signup(name, email, password) {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      await SecureStore.setItemAsync(TOKEN_KEY, data.token);
      await SecureStore.setItemAsync(USER_ID_KEY, String(data.user.id));
      return data.user;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  async getToken() {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },

  async getUserId() {
    return await SecureStore.getItemAsync(USER_ID_KEY);
  },

  async removeToken() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },

  async removeUserId() {
    await SecureStore.deleteItemAsync(USER_ID_KEY);
  },
};
