import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import Main from '../components/Main';
import Profile from '../components/profile/Profile';

const Stack = createStackNavigator();
const AppNavigator = () => (
    <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" component={Main} options={{
            headerShown: false
        }}></Stack.Screen>
        <Stack.Screen name="Profile" component={Profile} options={{
            headerShown: false
        }}></Stack.Screen>
    </Stack.Navigator>
)
export default AppNavigator