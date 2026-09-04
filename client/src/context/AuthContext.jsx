import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const USER_STORAGE_KEY = 'afterbuy_current_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
    }
    return {
      name: 'Bhuvan',
      email: 'bhuvan@gmail.com',
      phone: '+91 98765 43210',
      city: 'Bengaluru',
    };
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      }
    } catch (e) {
      console.error('Failed to save user to localStorage', e);
    }
  }, [user]);

  // Compute initials (e.g. "Aditya Sharma" -> "AS", "Aditya" -> "AD")
  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    const parts = fullName.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  // Get first name for greetings (e.g. "Good morning, Aditya")
  const getFirstName = (fullName) => {
    if (!fullName) return 'there';
    return fullName.trim().split(' ')[0];
  };

  const login = (email, customName) => {
    // If logging in with an email, derive display name if not already provided
    let displayName = customName;
    if (!displayName) {
      // If user logs in with existing stored user of same email, preserve name
      if (user && user.email === email && user.name) {
        displayName = user.name;
      } else {
        const usernamePart = email.split('@')[0] || 'User';
        displayName = usernamePart.charAt(0).toUpperCase() + usernamePart.slice(1);
      }
    }

    const updatedUser = {
      name: displayName,
      email: email,
    };
    setUser(updatedUser);
    return updatedUser;
  };

  const signup = (name, email) => {
    const updatedUser = {
      name: name.trim(),
      email: email.trim(),
    };
    setUser(updatedUser);
    return updatedUser;
  };

  const updateUser = (fields) => {
    setUser((prev) => ({
      ...prev,
      ...fields,
    }));
  };

  const logout = () => {
    // Reset to default on logout
    const defaultUser = {
      name: 'John Doe',
      email: 'john@example.com',
    };
    setUser(defaultUser);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        initials: getInitials(user?.name),
        firstName: getFirstName(user?.name),
        login,
        signup,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
