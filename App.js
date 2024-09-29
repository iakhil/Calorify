// App.js
import React from 'react';
import { View, Text } from 'react-native';
import ImageUpload from './components/ImageUpload';
import ManualEntry from './components/ManualEntry';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Calorie Tracker</Text>

      {/* Image Upload Component */}
      <ImageUpload />

      {/* Manual Entry Component */}
      <ManualEntry />
    </View>
  );
}
