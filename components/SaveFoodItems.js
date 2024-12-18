import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const SaveFoodItem = () => {
    const [foodName, setFoodName] = useState('');
    const [calories, setCalories] = useState('');
    const [quantity, setQuantity] = useState('');

    const handleSave = async () => {
        if (!foodName || !calories || !quantity) {
            Alert.alert("Error", "Please fill all the fields.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/food', {
                food_name: foodName,
                calories: parseInt(calories),
                quantity: parseFloat(quantity),
            });

            Alert.alert("Success", "Food item saved successfully!");
            setFoodName('');
            setCalories('');
            setQuantity('');
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to save the food item.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Save Food Item</Text>
            <TextInput
                style={styles.input}
                placeholder="Food Name"
                value={foodName}
                onChangeText={setFoodName}
            />
            <TextInput
                style={styles.input}
                placeholder="Estimated Calories"
                keyboardType="numeric"
                value={calories}
                onChangeText={setCalories}
            />
            <TextInput
                style={styles.input}
                placeholder="Quantity"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
            />
            <Button title="Save" onPress={handleSave} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
});

export default SaveFoodItem;
