import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthUser } from '../types';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface AuthContextType {
  currentUser: AuthUser;
  users: User[];
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (username: string, password: string, isAdmin: boolean) => Promise<boolean>;
  deleteUser: (id: string) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  favouriteLenders: string[];
  toggleFavourite: (lenderId: string) => Promise<void>;
  isFavourite: (lenderId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [favouriteLenders, setFavouriteLenders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('last_login', { ascending: false, nullsLast: true });
        
        if (error) {
          console.error('Error fetching users:', error);
          return;
        }
        
        if (data) {
          setUsers(data as User[]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as AuthUser;
        setCurrentUser(parsedUser);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser?.is_admin || false);
        
        fetchFavourites(parsedUser.id);
      } catch (error) {
        console.error('Failed to parse saved user', error);
        localStorage.removeItem('currentUser');
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchFavourites = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('lender_id')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching favourites:', error);
        return;
      }
      
      if (data) {
        setFavouriteLenders(data.map(fav => fav.lender_id));
      }
    } catch (error) {
      console.error('Error fetching favourites:', error);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username.toLowerCase())
        .eq('password', password)
        .single();
      
      if (error || !data) {
        return false;
      }

      const user = data as User;
      const { password: _, ...userWithoutPassword } = user;
      
      // Update last_login timestamp
      const now = new Date().toISOString();
      await supabase
        .from('users')
        .update({ last_login: now })
        .eq('id', user.id);
      
      setCurrentUser({ ...userWithoutPassword, last_login: new Date(now) });
      setIsAuthenticated(true);
      setIsAdmin(user.is_admin);
      localStorage.setItem('currentUser', JSON.stringify({ ...userWithoutPassword, last_login: now }));
      
      await fetchFavourites(user.id);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setFavouriteLenders([]);
    localStorage.removeItem('currentUser');
  };

  const addUser = async (username: string, password: string, isAdmin: boolean): Promise<boolean> => {
    try {
      const { data: existingUsers, error: queryError } = await supabase
        .from('users')
        .select('id')
        .eq('username', username.toLowerCase());
      
      if (queryError) {
        console.error('Error checking existing user:', queryError);
        return false;
      }
      
      if (existingUsers && existingUsers.length > 0) {
        return false;
      }

      const newUser = {
        id: uuidv4(),
        username: username.toLowerCase(),
        password,
        is_admin: isAdmin,
      };

      const { error } = await supabase
        .from('users')
        .insert(newUser);
      
      if (error) {
        console.error('Error adding user:', error);
        return false;
      }

      const { data: updatedUsers } = await supabase
        .from('users')
        .select('*')
        .order('last_login', { ascending: false, nullsLast: true });
      
      if (updatedUsers) {
        setUsers(updatedUsers as User[]);
      }
      
      return true;
    } catch (error) {
      console.error('Error adding user:', error);
      return false;
    }
  };

  const deleteUser = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting user:', error);
        return;
      }

      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const toggleFavourite = async (lenderId: string): Promise<void> => {
    if (!currentUser) return;
    
    const isFav = favouriteLenders.includes(lenderId);
    
    try {
      if (isFav) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('lender_id', lenderId);
        
        if (error) {
          console.error('Error removing favorite:', error);
          return;
        }
        
        setFavouriteLenders(prev => prev.filter(id => id !== lenderId));
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: currentUser.id,
            lender_id: lenderId
          });
        
        if (error) {
          console.error('Error adding favorite:', error);
          return;
        }
        
        setFavouriteLenders(prev => [...prev, lenderId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const isFavourite = (lenderId: string): boolean => {
    return favouriteLenders.includes(lenderId);
  };

  const value = {
    currentUser,
    users,
    login,
    logout,
    addUser,
    deleteUser,
    isAuthenticated,
    isAdmin,
    favouriteLenders,
    toggleFavourite,
    isFavourite
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};