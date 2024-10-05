import React, { useState } from 'react';
import { View, Button, Image, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { OPENAI_API_KEY } from '@env';

export default function ImageUpload() {
  const [imageUri, setImageUri] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const captureImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const analyzeImage = async () => {
    if (!imageUri) return;
    setLoading(true);
    setAnalysisResult(null);

    try {
      // Convert image to base64
      const base64Image = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });
      const payload = {
        "model": "gpt-4o-mini",
        "messages": [
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": "Identify the image. If it is not a food item, just output saying it is not a food item. If it is a food item, output in the format of Detected food: <food_item> C alories: <estimated_calories>. Estimate the calories on the basis of the detected food item and portion size. DO NOT OUTPUT ANY OTHER TEXT. Stick to the format prescribed."
              },
              {
                "type": "image_url",
                "image_url": {
                  "url": `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        "max_tokens": 300
      };

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      };

      const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, { headers });
      console.log('AI Response:', response.data);
      setAnalysisResult(response.data.choices[0].message.content.trim());
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Failed to analyze the image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Upload or Capture an Image</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick from Gallery</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={captureImage}>
          <Text style={styles.buttonText}>Capture from Camera</Text>
        </TouchableOpacity>
      </View>

      {imageUri ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <TouchableOpacity style={styles.analyzeButton} onPress={analyzeImage} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Analyzing...' : 'Analyze Image'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.placeholderText}>No image selected</Text>
      )}

      {loading && <ActivityIndicator size="large" color="#6200ea" />}

      {analysisResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Analysis Result:</Text>
          <Text>{analysisResult}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#6200ea',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  imageContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 5,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  placeholderText: {
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
  analyzeButton: {
    backgroundColor: '#6200ea',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  resultText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});