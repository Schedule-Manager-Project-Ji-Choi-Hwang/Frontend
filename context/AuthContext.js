import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authEvents  from '../events';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('AccessToken');
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkToken();
    const tokenExpiredListener = () => {
      logout();
    };
    authEvents.on('tokenExpired', tokenExpiredListener);

    return () => {
      authEvents.off('tokenExpired', tokenExpiredListener);
    };
  }, []);

  const logout = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
