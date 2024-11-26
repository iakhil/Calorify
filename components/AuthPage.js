import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthPage = ({ setIsLoggedIn }) => {
  // State to toggle between Login and Register
  const [isRegistering, setIsRegistering] = useState(false);

  // State to manage form inputs
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle both login and register
  const handleAuth = async () => {
    try {
      const endpoint = isRegistering
        ? 'http://192.168.1.67:4000/api/auth/register'
        : 'http://192.168.1.67:4000/api/auth/login';

      const payload = isRegistering
        ? { username, email, password }  // Register needs username, email, password
        : { email, password };           // Login needs email, password only

      // Make the request to the backend API
      const response = await axios.post(endpoint, payload);

      if (isRegistering) {
        Alert.alert('Success', 'Registration completed. Please log in.');
        setIsRegistering(false); // Switch to login after successful registration
      } else {
        // Save JWT token and log in the user
        await AsyncStorage.setItem('token', response.data.token);
        setIsLoggedIn(true);
      }
    } catch (error) {
        console.log(error);
      Alert.alert(
        'Error',
        error.response?.data?.error || 'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegistering ? 'Register' : 'Login'}</Text>

      {isRegistering && (
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title={isRegistering ? 'Register' : 'Login'} onPress={handleAuth} />
      <Text
        style={styles.toggleText}
        onPress={() => setIsRegistering(!isRegistering)}
      >
        {isRegistering ? 'Already have an account? Login' : 'No account? Register'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  toggleText: {
    marginTop: 12,
    color: '#0066cc',
    textAlign: 'center',
  },
});

export default AuthPage;
