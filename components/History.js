import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function History() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const entriesJson = await AsyncStorage.getItem('foodEntries');
      if (entriesJson) {
        const parsedEntries = JSON.parse(entriesJson);
        setEntries(parsedEntries);
      }
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.entryCard}>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleDateString()}
      </Text>
      <Text style={styles.calories}>{item.calories}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food History</Text>
      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={(item) => item.timestamp}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  entryCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  timestamp: {
    fontSize: 16,
    color: '#666',
  },
  calories: {
    fontSize: 16,
    marginTop: 5,
  },
});
