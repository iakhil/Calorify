// App.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ManualEntry from './components/ManualEntry';
import ImageUpload from './components/ImageUpload';
import LabelUpload from './components/LabelUpload';
import RecipeGenerator from './components/RecipeGenerator';
import AuthPage from './components/AuthPage';
import SaveFoodItem from './components/SaveFoodItems'; // Newly added component

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Manage loading state

  // Check if the user is logged in by verifying the token
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setIsLoggedIn(!!token); // Set login status based on the presence of a token
      } catch (error) {
        console.error('Failed to load token', error);
      } finally {
        setLoading(false); // Stop loading state after check
      }
    };

    checkLoginStatus();
  }, []);

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token'); // Remove the token from storage
      setIsLoggedIn(false); // Set logged-in state to false to navigate to AuthPage
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Render a loading screen while checking login status
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Render the AuthPage or the other screens based on login status */}
        {!isLoggedIn ? (
          <Stack.Screen
            name="Auth"
            options={{ headerShown: false }}
          >
            {() => <AuthPage setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen
              name="Calculate your calories"
              component={ManualEntry}
              options={{
                headerTitle: 'Calculate Your Calories',
                headerRight: () => (
                  <Button
                    onPress={handleLogout}
                    title="Logout"
                    color="#f4511e"
                  />
                ),
              }}
            />
            <Stack.Screen
              name="Generate Recipes"
              component={RecipeGenerator}
              options={{
                headerTitle: 'Generate Recipes',
                headerRight: () => (
                  <Button
                    onPress={handleLogout}
                    title="Logout"
                    color="#f4511e"
                  />
                ),
              }}
            />
            <Stack.Screen
              name="ImageUpload"
              component={ImageUpload}
              options={{
                headerTitle: 'Upload Image',
                headerRight: () => (
                  <Button
                    onPress={handleLogout}
                    title="Logout"
                    color="#f4511e"
                  />
                ),
              }}
            />
            <Stack.Screen
              name="LabelUpload"
              component={LabelUpload}
              options={{
                headerTitle: 'Upload Label',
                headerRight: () => (
                  <Button
                    onPress={handleLogout}
                    title="Logout"
                    color="#f4511e"
                  />
                ),
              }}
            />
            <Stack.Screen
              name="SaveFood"
              component={SaveFoodItem}
              options={{
                headerTitle: 'Save Food Item',
                headerRight: () => (
                  <Button
                    onPress={handleLogout}
                    title="Logout"
                    color="#f4511e"
                  />
                ),
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
