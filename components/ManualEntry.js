// components/ManualEntry.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { OPENAI_API_KEY } from '@env';

export default function ManualEntry() {
  const [foodItem, setFoodItem] = useState('');
  const [calories, setCalories] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateCalories = async () => {
    try {
      setLoading(true);


      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',  // Use GPT-3.5-turbo or GPT-4 models
          messages: [
            { role: "system", content: "You are a helpful assistant for food calorie counting. You only provide the number of calories. Nothing else. STRICTLY, just provide the expected number of calories. Do not append any text whatsoever. " },
            { role: "user", content: `How many calories are in ${foodItem}?` }
          ],
          max_tokens: 50,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`, // Replace with your actual API key
          },
        }
      );

      const resultText = response.data.choices[0].message.content.trim();
      setCalories(resultText);  // Assuming the API returns the calorie count
    } catch (error) {
      console.error('Error fetching calories:', error);
      alert('Error calculating calories');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Enter food item"
        value={foodItem}
        onChangeText={setFoodItem}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
      />
      <Button title="Calculate Calories" onPress={calculateCalories} />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        calories && <Text style={{ marginTop: 20 }}>Calories: {calories}</Text>
      )}
    </View>
  );
}
