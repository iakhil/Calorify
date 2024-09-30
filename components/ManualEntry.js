// components/ManualEntry.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';  
import axios from 'axios';
import { OPENAI_API_KEY } from '@env';

export default function ManualEntry() {
  const [foodItem, setFoodItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [calories, setCalories] = useState(null);
  const [loading, setLoading] = useState(false);

  // Physical activity state
  const [selectedActivity, setSelectedActivity] = useState('running');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState(null);

  // Hardcoded average calories burned per minute for 5 activities
  const activityCalories = {
    running: 10,
    cycling: 8,
    swimming: 11,
    walking: 5,
    jumpingRope: 12,
  };

  const calculateCalories = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            { role: "system", content: "You are a helpful assistant for food calorie counting. You only provide the number of calories. Nothing else. STRICTLY, just provide the expected number of calories. Do not append any text whatsoever." },
            { role: "user", content: `How many calories are in ${quantity} of ${foodItem}?` }
          ],
          max_tokens: 50,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const resultText = response.data.choices[0].message.content.trim();
      setCalories(resultText);
    } catch (error) {
      console.error('Error fetching calories:', error);
      alert('Error calculating calories');
    } finally {
      setLoading(false);
    }
  };

  const calculateCaloriesBurned = () => {
    const caloriesPerMinute = activityCalories[selectedActivity] || 0;
    const totalCaloriesBurned = caloriesPerMinute * parseFloat(duration);
    setCaloriesBurned(totalCaloriesBurned.toFixed(2));
  };

  return (
    <View style={{ padding: 20 }}>
      {/* Food entry section */}
      <TextInput
        placeholder="Enter food item"
        value={foodItem}
        onChangeText={setFoodItem}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Enter quantity (e.g., 100g, 1 cup)"
        value={quantity}
        onChangeText={setQuantity}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
      />
      <Button title="Calculate Calories" onPress={calculateCalories} />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        calories && <Text style={{ marginTop: 20 }}>Calories: {calories}</Text>
      )}

      {/* Physical activity section */}
      <Text style={{ marginTop: 20 }}>Select Physical Activity</Text>
      <View style={{ borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}>
    <Picker
    selectedValue={selectedActivity}
    style={{ height: 50, width: '100%', backgroundColor: '#f0f0f0', marginBottom: 10 }}

    onValueChange={(itemValue) => setSelectedActivity(itemValue)}
    >
    <Picker.Item label="Running" value="running" />
    <Picker.Item label="Cycling" value="cycling" />
    <Picker.Item label="Swimming" value="swimming" />
    <Picker.Item label="Walking" value="walking" />
    <Picker.Item label="Jumping Rope" value="jumpingRope" />
    </Picker>
    </View>
    
      <TextInput
        placeholder="Enter duration (minutes)"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
      />
      <Button title="Calculate Calories Burnt" onPress={calculateCaloriesBurned} />

      {caloriesBurned && (
        <Text style={{ marginTop: 20 }}>Calories Burned: {caloriesBurned}</Text>
      )}
    </View>
  );
}
