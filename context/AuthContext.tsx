'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Load user from localStorage on client side only
  useEffect(() => {
    // Check if user is logged in from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('dealfinder_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
        setIsAdmin(parsedUser.isAdmin);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // For demo purposes, any valid email/password combination works
      // In a real app, you would validate credentials against a backend
      if (email && password && password.length >= 6) {
        const user = {
          email,
          isAdmin: true // For demo purposes, any logged-in user is an admin
        };
        
        setCurrentUser(user);
        setIsAdmin(true);
        
        // Store user in localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('dealfinder_user', JSON.stringify(user));
        }
        
        return Promise.resolve();
      } else {
        return Promise.reject(new Error('Invalid email or password'));
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setCurrentUser(null);
    setIsAdmin(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dealfinder_user');
    }
    return Promise.resolve();
  };

  const value = {
    currentUser,
    loading,
    login,
    signOut,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
