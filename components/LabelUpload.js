// LabelUpload.js

import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { OPENAI_API_KEY } from '@env';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';

const LabelUpload = () => {
  const [imageUri, setImageUri] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log('Image URI:', result.assets[0].uri);
      setImageUri(result.assets[0].uri);
    }
  };

  
const processImage = async () => {
  if (!imageUri) return;
  setLoading(true);

  try {
    // Convert the image to a base64 string
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log('Base64 Image Length:', base64Image.length);

    // Send the API request
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'You are an expert dietician. Analyse this nutrition label. Provide the summary of the analysis. Highlight if any macronturient is particularly high or stands out. Give the whole response under 3 sentences.' },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`, // Embed the base64 string in the payload
                },
              },
            ],
          },
        ],
        max_tokens: 300,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    console.log('AI Response:', response.data);

    // Assuming the response contains text content
    setAnalysisResult({
      summary: response.data.choices[0].message.content.trim(),
      remarks: 'AI analysis completed successfully.',
    });
  } catch (error) {
    console.error('Failed to analyze the label:', error.response?.data || error.message);
    alert('Failed to analyze the label. Please try again.');
  } finally {
    setLoading(false);
  }
};



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.uploadSection}>
        <Button title="Upload Nutrition Label" onPress={pickImage} />
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
        <Button title="Analyze Label" onPress={processImage} disabled={!imageUri || loading} />
      </View>
      {loading && <Text>Analyzing label...</Text>}
      {analysisResult && (
        <View style={styles.resultSection}>
          <Text style={styles.resultTitle}>Analysis Summary:</Text>
          <Text>{analysisResult.summary}</Text>
          <Text style={styles.remarkTitle}>Remarks:</Text>
          <Text>{analysisResult.remarks}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  uploadSection: {
    marginBottom: 16,
    width: '100%',
  },
  image: {
    width: 300,
    height: 200,
    marginVertical: 8,
  },
  resultSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  resultTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  remarkTitle: {
    marginTop: 8,
    fontWeight: 'bold',
  },
});

export default LabelUpload;
