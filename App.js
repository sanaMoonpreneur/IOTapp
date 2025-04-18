import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './Screens/LoginScreen';
import DrawerScreen from './Navigation/Drawer';
import AddDevice from './Screens/AddDevice';
import DeviceDetail from './Screens/DeviceDetail';
import DeviceControl from './Screens/DeviceControl';
import SensorControl from './Screens/SensorControl';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LogIn">
        <Stack.Screen name="LogIn" component={LoginScreen} options={{title: "LogIn", headerShown: false,}}></Stack.Screen>
        <Stack.Screen name="Drawer" component={DrawerScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="AddDevice" component={AddDevice} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="DeviceDetail" component={DeviceDetail} options={{
          title: "DeviceDetail",
          headerShown: false,
        }}></Stack.Screen>
        <Stack.Screen name="DeviceControl" component={DeviceControl} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="SensorControl" component={SensorControl} options={{ headerShown: false }}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}