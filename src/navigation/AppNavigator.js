import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import Main from '../components/Main';
import Profile from '../components/profile/Profile';
import AddScreen from '../components/add/Add'
import Edit from '../components/edit/Edit';

const Stack = createStackNavigator();
const AppNavigator = ({ navigation }) => (
    <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" component={Main} options={{
            headerShown: false
        }}></Stack.Screen>
        <Stack.Screen name="Add" component={AddScreen} navigation={navigation}></Stack.Screen>
        <Stack.Screen name="Profile" component={Profile} options={{
            headerShown: false
        }} navigation={navigation}></Stack.Screen>
        <Stack.Screen name='Edit' component={Edit} navigation={navigation}></Stack.Screen>
    </Stack.Navigator>
)
export default AppNavigator