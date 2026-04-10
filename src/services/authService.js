import { apiRequest } from './httpClient.js';

const STORAGE_KEY = 'pulsecare.auth';

function ensureWindow() {
  if (typeof window === 'undefined') {
    throw new Error('Auth storage is only available in the browser');
  }
}

function decodeToken(token) {
  if (!token) {
    return null;
  }

  const segments = token.split('.');
  if (segments.length !== 3) {
    return null;
  }

  try {
    if (typeof window === 'undefined') {
      return null;
    }
    const base64 = segments[1].replaceAll('-', '+').replaceAll('_', '/');
    const json = window.atob(base64);
    return JSON.parse(json);
  } catch (_error) {
    return null;
  }
}

function isTokenValid(token) {
  const payload = decodeToken(token);
  if (!payload?.exp) {
    return false;
  }
  return payload.exp * 1000 > Date.now();
}

function persist(session, rememberDevice = true) {
  try {
    ensureWindow();
    const storage = rememberDevice ? window.localStorage : window.sessionStorage;
    storage.setItem(STORAGE_KEY, JSON.stringify(session));
    const alternate = rememberDevice ? window.sessionStorage : window.localStorage;
    alternate.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to persist auth data', error);
  }
}

function readPersisted() {
  try {
    ensureWindow();
    const storages = [window.localStorage, window.sessionStorage];
    for (const storage of storages) {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) {
        continue;
      }
      const parsed = JSON.parse(raw);
      if (!isTokenValid(parsed?.token)) {
        storage.removeItem(STORAGE_KEY);
        continue;
      }
      return {
        ...parsed,
        rememberDevice: parsed?.rememberDevice ?? storage === window.localStorage
      };
    }
    return null;
  } catch (error) {
    console.warn('Failed to read auth data', error);
    return null;
  }
}

export const authService = {
  async login({ email, password }) {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password }
    });

    return response;
  },

  async signup({ name, email, password, department, role }) {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: { name, email, password, department, role }
    });
  },

  logout() {
    try {
      ensureWindow();
      window.localStorage.removeItem(STORAGE_KEY);
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear auth data', error);
    }
  },

  getStoredAuth() {
    return readPersisted();
  },

  persistAuth(session, rememberDevice = true) {
    persist({ ...session, rememberDevice }, rememberDevice);
  },

  clearStoredAuth() {
    try {
      ensureWindow();
      window.localStorage.removeItem(STORAGE_KEY);
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear auth data', error);
    }
  },

  decodeToken,
  isTokenValid,

  hasAdminAccess(sessionOrToken) {
    if (!sessionOrToken) {
      return false;
    }
    const token = typeof sessionOrToken === 'string' ? sessionOrToken : sessionOrToken.token;
    const payload = decodeToken(token);
    return payload?.role === 'admin' || payload?.role === 'manager';
  }
};
