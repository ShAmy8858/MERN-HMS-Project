import { apiRequest } from './httpClient.js';

export const userService = {
  list(token) {
    return apiRequest('/users', { token });
  },

  create(token, payload) {
    return apiRequest('/users', {
      method: 'POST',
      token,
      body: payload
    });
  }
};
