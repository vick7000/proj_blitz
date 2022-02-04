import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();


import Login from './pages/login/login.js';
import Main from './pages/main/main.js';
import Home from './pages/home/home.js';
import User from './pages/usuario/usuario.js';

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Main" component={Main}/>
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="Usuario" component={User}/>
      </Stack.Navigator>
    </NavigationContainer> 
  );
}