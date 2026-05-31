import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ResetPage() {
  const resetData = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('成功', '数据库已清空！', [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);
    } catch (error) {
      Alert.alert('错误', '重置失败');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>重置数据库</Text>
      <Text style={styles.description}>点击按钮清除所有数据</Text>
      
      <TouchableOpacity style={styles.button} onPress={resetData}>
        <Text style={styles.buttonText}>清空所有数据</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => router.replace('/')}>
        <Text style={styles.buttonText}>返回首页</Text>
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
