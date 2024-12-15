import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import EventFormScreen from './src/screens/EventFormScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Мои события' }} />
          <Stack.Screen name="EventForm" component={EventFormScreen} options={{ title: 'Новое событие' }} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
