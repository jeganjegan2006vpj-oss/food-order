import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser } from '../types';
import { api } from '../utils/api';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string, phone?: string) => Promise<boolean>;
  quickLogin: (type: 'customer' | 'admin') => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('freshcart_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { addToast } = useToast();

  const refreshProfile = async () => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const res = await api.getProfile();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        // Invalid token
        logout();
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, [token]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await api.login(email, pass);
      if (res.success && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('freshcart_token', res.token);
        addToast({
          type: 'success',
          title: 'Welcome Back',
          message: `Logged in as ${res.user.name} (${res.user.role})`
        });
        setIsAuthModalOpen(false);
        return true;
      } else {
        addToast({
          type: 'error',
          title: 'Login Failed',
          message: res.message || 'Check your email and password'
        });
        return false;
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Error',
        message: err.message || 'Server connection error'
      });
      return false;
    }
  };

  const register = async (name: string, email: string, pass: string, phone?: string): Promise<boolean> => {
    try {
      const res = await api.register({ name, email, password: pass, phone });
      if (res.success && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('freshcart_token', res.token);
        addToast({
          type: 'success',
          title: 'Account Created',
          message: `Welcome to FreshCart 3D, ${res.user.name}!`
        });
        setIsAuthModalOpen(false);
        return true;
      } else {
        addToast({
          type: 'error',
          title: 'Registration Failed',
          message: res.message || 'Unable to register'
        });
        return false;
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Error',
        message: err.message || 'Registration error'
      });
      return false;
    }
  };

  const quickLogin = async (type: 'customer' | 'admin') => {
    if (type === 'admin') {
      await login('admin@freshcart.com', 'adminpassword123');
    } else {
      await login('sarah@example.com', 'password123');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('freshcart_token');
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been logged out safely.'
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        register,
        quickLogin,
        logout,
        refreshProfile,
        isAuthModalOpen,
        setIsAuthModalOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
