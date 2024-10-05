// LabelUpload.js

import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { OPENAI_API_KEY } from '@env';
import axios from 'axios';
import { readAsStringAsync } from 'expo-file-system';

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
      console.log('Image URI:', result.uri);
      setImageUri(result.uri);
    }
  };

  const processImage = async () => {
    if (!imageUri) return;
    setLoading(true);

    try {
      // Convert the image to base64
      const base64Image = await readAsStringAsync(imageUri, { encoding: 'base64' });
      console.log('Base64 Image Length:', base64Image.length);

      // Send the image to OpenAI's API for OCR and analysis
      const aiResponse = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an assistant that extracts nutritional information from an image.',
            },
            {
              role: 'user',
              content: `Extract nutritional information from the following image: ${base64Image}`,
            },
            {
                "type": "image_url",
                "image_url": `data:image/jpeg;based64,${base64_image}`
            }
          ],
          max_tokens: 200,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      console.log('AI Response:', aiResponse.data);

      // Assuming the response contains a summary and remarks
      setAnalysisResult({ summary: aiResponse.data.choices[0].message.content.trim(), remarks: 'Suggested consumption remarks based on nutritional information.' });
    } catch (error) {
      console.error('Failed to analyze the label:', error);
      alert('Failed to analyze the label. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.uploadSection}>
        <Button title="Upload Nutrition Label" onPress={pickImage} />
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.image} />
        )}
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