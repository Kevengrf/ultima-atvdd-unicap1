import * as SecureStore from 'expo-secure-store';
import { user } from '../mock/user';

const TOKEN_KEY = 'jwt_token';
const USER_ID_KEY = 'user_id';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async login(email, password) {
    await delay(500);
    // In a real mock, you might want to check credentials, but for a demo, we'll just succeed.
    await SecureStore.setItemAsync(TOKEN_KEY, 'mock_jwt_token');
    await SecureStore.setItemAsync(USER_ID_KEY, user.id);
    return user;
  },

  async signup(name, email, password) {
    await delay(500);
    // Simulate a successful signup
    await SecureStore.setItemAsync(TOKEN_KEY, 'mock_jwt_token');
    await SecureStore.setItemAsync(USER_ID_KEY, user.id);
    return user;
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


