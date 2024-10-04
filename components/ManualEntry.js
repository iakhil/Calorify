import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { OPENAI_API_KEY } from '@env';
import { useNavigation } from '@react-navigation/native'; // For navigation to ImageUpload

export default function ManualEntry() {
  const [foodItems, setFoodItems] = useState([{ food: '', quantity: '' }]);
  const [calories, setCalories] = useState(null);
  const [loading, setLoading] = useState(false);

  // Physical activity state
  const [selectedActivity, setSelectedActivity] = useState('running');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState(null);

  // Navigation setup
  const navigation = useNavigation();

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

      // Loop through each food item and quantity to get calories
      for (const { food, quantity } of foodItems) {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4',
            messages: [
              { role: "system", content: "You are a helpful assistant for food calorie counting. You only provide the number of calories. Nothing else. STRICTLY, just provide the expected number of calories. Do not append any text whatsoever." },
              { role: "user", content: `How many calories are in ${quantity} of ${food}?` }
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
        setCalories((prev) => prev ? `${prev}, ${food}: ${resultText}` : `${food}: ${resultText}`);
      }
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

  // Add more food items
  const addFoodItem = () => {
    setFoodItems([...foodItems, { food: '', quantity: '' }]);
  };

  // Update food item details
  const updateFoodItem = (index, field, value) => {
    const newFoodItems = [...foodItems];
    newFoodItems[index][field] = value;
    setFoodItems(newFoodItems);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        {/* Food entry section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Food Entry</Text>

          {foodItems.map((item, index) => (
            <View key={index} style={styles.foodItemContainer}>
              <TextInput
                placeholder="Enter food item"
                value={item.food}
                onChangeText={(value) => updateFoodItem(index, 'food', value)}
                style={styles.input}
              />
              <TextInput
                placeholder="Enter quantity (e.g., 100g, 1 cup)"
                value={item.quantity}
                onChangeText={(value) => updateFoodItem(index, 'quantity', value)}
                style={styles.input}
              />
            </View>
          ))}

          <TouchableOpacity style={styles.button} onPress={addFoodItem}>
            <Text style={styles.buttonText}>Add Another Food Item</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={calculateCalories}>
            <Text style={styles.buttonText}>Calculate Calories</Text>
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator size="large" color="#6200ea" style={styles.loader} />
          ) : (
            calories && <Text style={styles.resultText}>Calories: {calories}</Text>
          )}
        </View>

        {/* Physical activity section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Physical Activity</Text>
          <Picker
            selectedValue={selectedActivity}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedActivity(itemValue)}
          >
            <Picker.Item label="Running" value="running" />
            <Picker.Item label="Cycling" value="cycling" />
            <Picker.Item label="Swimming" value="swimming" />
            <Picker.Item label="Walking" value="walking" />
            <Picker.Item label="Jumping Rope" value="jumpingRope" />
          </Picker>

          <TextInput
            placeholder="Enter duration (minutes)"
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={calculateCaloriesBurned}>
            <Text style={styles.buttonText}>Calculate Calories Burnt</Text>
          </TouchableOpacity>

          {caloriesBurned && (
            <Text style={styles.resultText}>Calories Burned: {caloriesBurned}</Text>
          )}
        </View>

        {/* Button to navigate to ImageUpload */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ImageUpload')}>
          <Text style={styles.buttonText}>Go to Image Upload</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LabelUpload')}>
          <Text style={styles.buttonText}>Label Reader</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  foodItemContainer: {
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  button: {
    backgroundColor: '#6200ea',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 20,
  },
  resultText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});
