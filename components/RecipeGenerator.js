import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { OPENAI_API_KEY } from '@env';

const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateRecipes = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            { role: "system", content: "You are a helpful assistant for food calorie counting. You only provide recipes. Think of unique variety of recipes from the given ingredients. STRICTLY USE THE GIVEN INGREDIENTS. DO NOT SAY ANYTHING ELSE. ONLY PROVIDE THE RECIPES, THAT IS IT!" },
            { role: "user", content: `Please provide a recipe using ${ingredients}` }
          ],
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      setRecipes(response.data.choices[0].message.content.split('\n').filter((item) => item));
    } catch (error) {
      console.error('Error generating recipes:', error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe Generator</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter ingredients (e.g., tomatoes, onions, garlic)"
        value={ingredients}
        onChangeText={setIngredients}
      />
      <TouchableOpacity style={styles.button} onPress={generateRecipes} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Generating...' : 'Generate Recipes'}</Text>
      </TouchableOpacity>
      <FlatList
        data={recipes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.recipeItem}>
            <Text style={styles.recipeText}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  recipeItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeText: {
    fontSize: 16,
  },
});

export default RecipeGenerator;
