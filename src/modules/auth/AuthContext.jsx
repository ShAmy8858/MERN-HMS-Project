import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { authService } from '../../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => authService.getStoredAuth());
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    if (authState?.token) {
      authService.persistAuth(authState, authState.rememberDevice !== false);
    } else {
      authService.clearStoredAuth();
    }
  }, [authState]);

  const login = useCallback(async (credentials) => {
    setIsAuthenticating(true);
    try {
      const { rememberMe = true, ...authPayload } = credentials;
      const session = await authService.login(authPayload);
      const completeSession = { ...session, rememberDevice: rememberMe };
      setAuthState(completeSession);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed'
      };
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const signup = useCallback(async (credentials) => {
    setIsAuthenticating(true);
    try {
      const { rememberMe = true, ...authPayload } = credentials;
      const session = await authService.signup(authPayload);
      const completeSession = { ...session, rememberDevice: rememberMe };
      setAuthState(completeSession);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Signup failed'
      };
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setAuthState(null);
  }, []);

  const value = useMemo(
    () => ({
      user: authState?.user ?? null,
      token: authState?.token ?? null,
      rememberDevice: authState?.rememberDevice ?? true,
      login,
      signup,
      logout,
      isAuthenticating,
      isAuthenticated: Boolean(authState?.token)
    }),
    [authState, login, signup, logout, isAuthenticating]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
