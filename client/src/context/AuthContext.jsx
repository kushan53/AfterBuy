import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';

const AuthContext = createContext(null);
const USER_STORAGE_KEY = 'afterbuy_current_user';
const TOKEN_STORAGE_KEY = 'afterbuy_auth_token';

const sanitizeUser = (userData) => {
  if (!userData || typeof userData !== 'object') return userData;
  const clean = { ...userData };
  if (
    clean.avatar &&
    (typeof clean.avatar !== 'string' ||
      clean.avatar.trim() === '' ||
      clean.avatar === 'null' ||
      clean.avatar === 'undefined' ||
      (!clean.avatar.startsWith('http://') &&
        !clean.avatar.startsWith('https://') &&
        !clean.avatar.startsWith('data:image/')))
  ) {
    delete clean.avatar;
  }
  return clean;
};

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
        return sanitizeUser(JSON.parse(stored));
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
          let cached = null;
          try {
            cached = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || sessionStorage.getItem(USER_STORAGE_KEY));
          } catch (e) {}

          const resolvedName = res.user.name || cached?.name || (res.user.email || cached?.email ? (res.user.email || cached?.email).split('@')[0] : 'User');
          const resolvedEmail = res.user.email || cached?.email || '';

          const merged = {
            ...cached,
            ...res.user,
            name: resolvedName,
            email: resolvedEmail,
          };

          const sanitized = sanitizeUser(merged);
          setUser(sanitized);
          if (localStorage.getItem(TOKEN_STORAGE_KEY)) {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(sanitized));
          } else {
            sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(sanitized));
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

  // Compute initials (e.g. "Kushan Garg" -> "KG", "kushangarg41@gmail.com" -> "KG")
  const getInitials = (fullName) => {
    const target = fullName || user?.name || (user?.email ? user.email.split('@')[0].replace(/[._-]/g, ' ') : '');
    if (!target) return 'KG';
    const parts = target.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return target.slice(0, 2).toUpperCase();
  };

  // Get first name for greetings (e.g. "Good morning, Kushan")
  const getFirstName = (fullName) => {
    if (fullName && fullName.trim() && fullName.trim() !== 'there' && fullName.trim() !== 'User') {
      return fullName.trim().split(' ')[0];
    }
    if (user?.name && user.name.trim() && user.name.trim() !== 'there' && user.name.trim() !== 'User') {
      return user.name.trim().split(' ')[0];
    }
    if (user?.email) {
      const emailPrefix = user.email.split('@')[0];
      return emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
    }
    return 'there';
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
      const sanitized = sanitizeUser(data.user);
      setUser(sanitized);
      if (remember) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(sanitized));
      } else {
        sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(sanitized));
      }
      return sanitized;
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
      const sanitized = sanitizeUser(data.user);
      setUser(sanitized);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(sanitized));
      return sanitized;
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
      const sanitized = sanitizeUser(data.user);
      setUser(sanitized);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(sanitized));
      return sanitized;
    }
  };

  const sendLoginOtp = async (email) => {
    return await apiRequest('/auth/send-login-otp', {
      method: 'POST',
      body: JSON.stringify({ email: email.toLowerCase().trim() }),
    });
  };

  const loginWithOtp = async (email, otp) => {
    const data = await apiRequest('/auth/verify-login-otp', {
      method: 'POST',
      body: JSON.stringify({ email: email.toLowerCase().trim(), otp }),
    });

    if (data.token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      setToken(data.token);
    }

    if (data.user) {
      const sanitized = sanitizeUser(data.user);
      setUser(sanitized);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(sanitized));
      return sanitized;
    }
  };

  const setSession = (newToken, newUser) => {
    if (newToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
      setToken(newToken);
    }
    if (newUser) {
      const sanitized = sanitizeUser(newUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(sanitized));
      setUser(sanitized);
    }
  };

  const updateUser = async (fields) => {
    // Industry Security: Do not allow erasing core account identity with empty strings
    const sanitized = { ...fields };
    if (sanitized.name !== undefined && !sanitized.name.trim()) {
      delete sanitized.name;
    }
    if (sanitized.email !== undefined && !sanitized.email.trim()) {
      delete sanitized.email;
    }

    setUser((prev) => (prev ? sanitizeUser({ ...prev, ...sanitized }) : sanitizeUser(sanitized)));

    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      try {
        const data = await apiRequest('/auth/profile', {
          method: 'PUT',
          body: JSON.stringify(sanitized),
        });
        if (data.user) {
          setUser(sanitizeUser(data.user));
        }
      } catch (error) {
        console.warn('Backend profile update warning:', error.message);
      }
    }
  };

  const deleteAccount = async () => {
    try {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY) || sessionStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        await apiRequest('/auth/account', {
          method: 'DELETE',
        });
      }
    } catch (err) {
      console.warn('Backend delete account error:', err.message);
    } finally {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem('afterbuy_purchases_v1');
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      sessionStorage.removeItem(USER_STORAGE_KEY);
      setToken(null);
      setUser(null);
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
        sendLoginOtp,
        loginWithOtp,
        updateUser,
        deleteAccount,
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
