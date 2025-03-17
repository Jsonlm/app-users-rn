import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './auth/login';
import Index from './tabs/home';
import EditScreen from './tabs/home/edit';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="login" 
                component={LoginScreen} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen
                name="index" 
                component={Index} 
                options={{ headerShown: false }} 
            ></Stack.Screen>
            <Stack.Screen
                name="edit" 
                component={EditScreen} 
                options={{ headerShown: false }} 
            ></Stack.Screen>
        </Stack.Navigator>
    );
}