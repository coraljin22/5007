import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as db from '../database/sqlite';

export default function DebugPage() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const clearLogs = () => setLogs([]);

  const testDatabase = async () => {
    addLog('=== Starting Database Test ===');
    
    try {
      // test registration
      addLog('Testing user registration...');
      const userId = await db.registerUser('test123', 'password123');
      addLog(`Registration result: userId = ${userId}`);
      
      // test login
      addLog('Testing login...');
      const user = await db.loginUser('test123', 'password123');
      addLog(`Login result: ${user ? `Success - ${user.displayName}` : 'Failed'}`);
      
      if (user) {
        // test adding task
        addLog('Testing task addition...');
        const taskId = await db.addTask(user.id, 'Test Task', '2026-05-29');
        addLog(`Task addition result: taskId = ${taskId}`);
        
        // test retrieving tasks
        addLog('Testing task retrieval...');
        const tasks = await db.getTasks(user.id);
        addLog(`Task retrieval result: ${tasks.length} tasks`);
        
        // test adding friend
        addLog('Testing friend addition...');
        const friendId1 = await db.addFriend(user.id, 'Alice');
        const friendId2 = await db.addFriend(user.id, 'Bob');
        addLog(`Friend addition result: friendIds = ${friendId1}, ${friendId2}`);
        
        // test retrieving friends
        addLog('Testing friend retrieval...');
        const friends = await db.getFriends(user.id);
        addLog(`Friend retrieval result: ${friends.length} friends`);
        friends.forEach(f => addLog(`- ${f.name} (ID: ${f.id})`));
        
        // test deleting friend
        addLog('Testing friend deletion...');
        await db.deleteFriend(friendId1);
        const friendsAfterDelete = await db.getFriends(user.id);
        addLog(`Friend deletion result: ${friendsAfterDelete.length} friends remaining`);
        
        // test retrieving current user
        addLog('Testing current user retrieval...');
        const currentUser = await db.getCurrentUser();
        addLog(`Current user: ${currentUser ? currentUser.displayName : 'None'}`);
        
        // test logout
        addLog('Testing logout...');
        await db.logoutUser();
        const afterLogout = await db.getCurrentUser();
        addLog(`After logout: ${afterLogout ? 'There is a user' : 'Logged out'}`);
      }
      
      addLog('=== Test Completed ===');
      Alert.alert('Completed', 'Database test completed, please check the logs');
    } catch (error) {
      addLog(`Error: ${error}`);
      console.error(error);
    }
  };

  const resetDatabase = async () => {
    try {
      // clear AsyncStorage
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.clear();
      addLog('Database has been reset');
      Alert.alert('Completed', 'Database has been reset');
    } catch (error) {
      addLog(`Reset failed: ${error}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Database Debug Page</Text>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={testDatabase}>
          <Text style={styles.buttonText}>Run Test</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={resetDatabase}>
          <Text style={styles.buttonText}>Reset Database</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={clearLogs}>
          <Text style={styles.buttonText}>Clear Logs</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.logContainer}>
        {logs.map((log, index) => (
          <Text key={index} style={styles.logText}>{log}</Text>
        ))}
        {logs.length === 0 && (
          <Text style={styles.emptyText}>Click "Run Test" to start</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 8,
  },
  dangerButton: {
    backgroundColor: '#E74C3C',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
  },
  logText: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 5,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});
