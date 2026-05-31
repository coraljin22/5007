import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ResetPage() {
  const resetData = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Completed', 'Database has been reset', [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Reset failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Database</Text>
      <Text style={styles.description}>Click the button to clear all data</Text>
      
      <TouchableOpacity style={styles.button} onPress={resetData}>
        <Text style={styles.buttonText}>Clear All Data</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => router.replace('/')}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    marginBottom: 30,
    color: '#666',
  },
  button: {
    backgroundColor: '#E74C3C',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    minWidth: 200,
  },
  backButton: {
    backgroundColor: '#4A90E2',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
