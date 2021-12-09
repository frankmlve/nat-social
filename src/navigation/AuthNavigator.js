import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import RegisterScreen from '../components/auth/register/Register'
import LoginScreen from '../components/auth/login/Login'

const Stack = createStackNavigator();

const AuthNavigator = ({ data, buttonDisabled, natSocial, navigation }) => (
    <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" children={() =>
            <LoginScreen
                data={data}
                buttonDisabled={buttonDisabled}
                navigation={navigation}
                natSocial={natSocial}
            />} options={{
                headerShown: false
            }}></Stack.Screen>
        <Stack.Screen name="Register" children={() =>
            <RegisterScreen
                data={data} />}
            options={{
                headerShown: false
            }}></Stack.Screen>
    </Stack.Navigator>
);
export default AuthNavigator;