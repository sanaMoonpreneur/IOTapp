import { createDrawerNavigator, NavigationContainer } from '@react-navigation/drawer';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from "@expo/vector-icons";
import HomeNew from '../Screens/Home';
import CustomDrawer from '../Components/CustomDrawer';


const Drawer = createDrawerNavigator();

export default function DrawerScreen() {

    return (

        <Drawer.Navigator initialRouteName='Home' drawerContent={(props) => <CustomDrawer{...props} />}
            screenOptions={{
                drawerActiveBackgroundColor: '#f58084', drawerActiveTintColor: 'white',
                drawerInactiveTintColor: '#f58084', drawerLabelStyle: { marginLeft: -25, fontWeight: "bold", }
            }}
        >
            <Drawer.Screen name="Home" component={HomeNew} initialParams={{ initialRoute: true }} options={{
                headerShown: false,
                drawerIcon: ({ color }) => (<MaterialIcons name="home" size={24} color={color} />)
            }}></Drawer.Screen>
            


        </Drawer.Navigator>

    )
}
