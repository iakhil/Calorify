// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ManualEntry from './components/ManualEntry';
import ImageUpload from './components/ImageUpload'; // New screen
import LabelUpload  from './components/LabelUpload';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ManualEntry">
        <Stack.Screen name="Calculate your calories" component={ManualEntry} />
        <Stack.Screen name="ImageUpload" component={ImageUpload} />
        <Stack.Screen name="LabelUpload" component={LabelUpload} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
