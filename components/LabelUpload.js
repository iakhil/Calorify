// LabelUpload.js

import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, ScrollView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { OPENAI_API_KEY } from '@env';
import axios from 'axios';

const LabelUpload = () => {
  const [imageUri, setImageUri] = useState(null);
  const [base64Image, setBase64Image] = useState(null); // Store the base64 string
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: Platform.OS === 'web', // Request base64 directly on web
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setImageUri(selectedImageUri);

      if (Platform.OS === 'web') {
        // For web, directly use the base64 from result
        setBase64Image(result.assets[0].base64);
      } else {
        // For native platforms, convert the image to base64
        const fileReader = new FileReader();
        fileReader.onload = () => {
          setBase64Image(fileReader.result.split(',')[1]); // Extract the base64 part
        };
        fileReader.readAsDataURL(await fetch(selectedImageUri).then((res) => res.blob()));
      }
    }
  };

  const processImage = async () => {
    if (!base64Image) return;
    setLoading(true);

    try {
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
                { type: 'text', text: 'You are an expert dietician. Analyse this nutrition label. Provide the summary of the analysis. Highlight if any macronutrient is particularly high or stands out. Give the whole response under 3 sentences.' },
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
        remarks: 'Analysis completed.',
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
        <Button title="Analyze Label" onPress={processImage} disabled={!base64Image || loading} />
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
