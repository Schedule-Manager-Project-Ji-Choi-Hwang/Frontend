import React, { useState, useEffect, useRef } from 'react';
import SignInScreen from './screens/Auth/SignInScreen';
import SplashScreen from './screens/SplashScreen';
import Navigation from './screens/Navigation';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { registerTranslation } from 'react-native-paper-dates';
import { AuthProvider } from './context/AuthContext';
import 'react-native-get-random-values';
import './axiosConfig';
import authEvents from './events';

const Stack = createStackNavigator();

export default function App() {
  const navigationRef = useRef();
  const [signInModal, setSignInModal] = useState(false);

  useEffect(() => {
    const handleRefreshTokenExpired = () => {
      alert('세션이 만료되었습니다. 다시 로그인해주세요.')
      setSignInModal(true);
    };
    authEvents.on('tokenExpired', handleRefreshTokenExpired);

    return () => {
      authEvents.off('tokenExpired', handleRefreshTokenExpired);
    };
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="SplashScreen">
          <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Navigation" component={Navigation} options={{ headerShown: false }} />
          </Stack.Navigator>
        {signInModal && <SignInScreen isVisible={signInModal} onClose={() => setSignInModal(false)} />}
      </NavigationContainer>
    </AuthProvider>
  );
}

