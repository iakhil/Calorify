// components/SavedData.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const SavedData = () => {
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    const fetchSavedData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/get-saved-food-items');
        const data = await response.json();
        setSavedItems(data);
      } catch (error) {
        console.error('Error fetching saved data:', error);
      }
    };

    fetchSavedData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.calories}>{item.calories} kcal</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Food Items</Text>
      <FlatList
        data={savedItems}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  name: {
    fontSize: 18,
  },
  calories: {
    fontSize: 16,
    color: '#555',
  },
});

export default SavedData;
