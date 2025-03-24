import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './Screens/LoginScreen';
import HomeScreen from './Screens/Home';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LogIn">
        <Stack.Screen name="LogIn" component={LoginScreen} options={{title: "LogIn", headerShown: false,}}></Stack.Screen>
        <Stack.Screen name="Home" component={HomeScreen} options={{title: "Home", headerShown: false,}}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}