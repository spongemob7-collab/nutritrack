import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  goal: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Hardcoded guest user so the entire app skips auth checks
  const [user, setUser] = useState<User | null>({ 
    _id: 'guest', 
    name: 'Guest User', 
    email: 'guest@example.com', 
    goal: 'maintain' 
  });
  const [token, setToken] = useState<string | null>('dummy-token');
  const loading = false;

  const login = (newToken: string, newUser: User) => {};
  const logout = () => {};

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
