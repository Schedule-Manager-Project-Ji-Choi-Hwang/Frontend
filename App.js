import React from 'react';
import Login from './screens/Login';
import index from './screens/index';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {

  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRoutName="Login">
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
        <Stack.Screen name="index" component={index} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}