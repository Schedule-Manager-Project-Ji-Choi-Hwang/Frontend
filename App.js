import React from 'react';
import Login from './Login';
import Navigation from './Navigation';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {

  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRoutName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Navigation" component={Navigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}