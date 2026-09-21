import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';

const AuthContext = createContext(null);
const USER_STORAGE_KEY = 'afterbuy_current_user';
const TOKEN_STORAGE_KEY = 'afterbuy_auth_token';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_STORAGE_KEY) || sessionStorage.getItem(TOKEN_STORAGE_KEY) || null
  );
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY) || sessionStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse user from storage', e);
    }
    return null;
  });

  // Verify / hydrate user from backend if token exists
  useEffect(() => {
    const hydrateUser = async () => {
      const currentToken = localStorage.getItem(TOKEN_STORAGE_KEY) || sessionStorage.getItem(TOKEN_STORAGE_KEY);
      if (!currentToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await apiRequest('/auth/me');
        if (res?.success && res.user) {
          setUser(res.user);
          if (localStorage.getItem(TOKEN_STORAGE_KEY)) {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
          } else {
            sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
          }
        } else {
          // Token invalid or expired
          setUser(null);
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(USER_STORAGE_KEY);
          sessionStorage.removeItem(TOKEN_STORAGE_KEY);
          sessionStorage.removeItem(USER_STORAGE_KEY);
        }
      } catch (err) {
        console.warn('Could not verify session with backend:', err.message);
      } finally {
        setLoading(false);
      }
    };

    hydrateUser();
  }, [token]);

  // Keep localStorage user in sync
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save user to localStorage', e);
    }
  }, [user]);

  // Compute initials (e.g. "Bhuvan Garg" -> "BG")
  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    const parts = fullName.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  // Get first name for greetings (e.g. "Good morning, Bhuvan")
  const getFirstName = (fullName) => {
    if (!fullName) return 'there';
    return fullName.trim().split(' ')[0];
  };

  const login = async (email, password, remember = true) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.token) {
      if (remember) {
        localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      } else {
        sessionStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      }
      setToken(data.token);
    }

    if (data.user) {
      setUser(data.user);
      if (remember) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      } else {
        sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      }
      return data.user;
    }
  };

  const signup = async (name, email, password) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (data.token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      setToken(data.token);
    }

    if (data.user) {
      setUser(data.user);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      return data.user;
    }
  };

  const loginWithGoogle = async (googlePayload) => {
    const data = await apiRequest('/auth/google', {
      method: 'POST',
      body: JSON.stringify(googlePayload),
    });

    if (data.token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      setToken(data.token);
    }

    if (data.user) {
      setUser(data.user);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      return data.user;
    }
  };

  const setSession = (newToken, newUser) => {
    if (newToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
      setToken(newToken);
    }
    if (newUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
    }
  };

  const updateUser = async (fields) => {
    setUser((prev) => (prev ? { ...prev, ...fields } : fields));

    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      try {
        const data = await apiRequest('/auth/profile', {
          method: 'PUT',
          body: JSON.stringify(fields),
        });
        if (data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.warn('Backend profile update warning:', error.message);
      }
    }
  };

  const logout = () => {
    setIsLoggingOut(true);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem('afterbuy_purchases_v1');
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
    setTimeout(() => {
      setIsLoggingOut(false);
    }, 600);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isLoggingOut,
        isAuthenticated: !!token && !!user,
        initials: getInitials(user?.name),
        firstName: getFirstName(user?.name),
        login,
        signup,
        loginWithGoogle,
        updateUser,
        setSession,
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
