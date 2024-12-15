// src/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import EventFormScreen from './src/screens/EventFormScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import AboutScreen from './src/screens/AboutScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Welcome">
                <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ title: 'Приветствие' }} />
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Мои события' }} />
                <Stack.Screen name="EventForm" component={EventFormScreen} options={{ title: 'Добавить событие' }} />
                <Stack.Screen name="About" component={AboutScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
