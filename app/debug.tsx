import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import * as db from '../database/sqlite';

export default function DebugPage() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const clearLogs = () => setLogs([]);

  const testDatabase = async () => {
    addLog('=== 开始测试数据库 ===');
    
    try {
      // 测试注册
      addLog('测试注册用户 test123...');
      const userId = await db.registerUser('test123', 'password123');
      addLog(`注册结果: userId = ${userId}`);
      
      // 测试登录
      addLog('测试登录...');
      const user = await db.loginUser('test123', 'password123');
      addLog(`登录结果: ${user ? `成功 - ${user.displayName}` : '失败'}`);
      
      if (user) {
        // 测试添加任务
        addLog('测试添加任务...');
        const taskId = await db.addTask(user.id, '测试任务', '2026-05-29');
        addLog(`添加任务结果: taskId = ${taskId}`);
        
        // 测试获取任务
        addLog('测试获取任务...');
        const tasks = await db.getTasks(user.id);
        addLog(`获取任务结果: ${tasks.length} 个任务`);
        
        // 测试添加好友
        addLog('测试添加好友...');
        const friendId1 = await db.addFriend(user.id, 'Alice');
        const friendId2 = await db.addFriend(user.id, 'Bob');
        addLog(`添加好友结果: friendIds = ${friendId1}, ${friendId2}`);
        
        // 测试获取好友
        addLog('测试获取好友...');
        const friends = await db.getFriends(user.id);
        addLog(`获取好友结果: ${friends.length} 个好友`);
        friends.forEach(f => addLog(`- ${f.name} (ID: ${f.id})`));
        
        // 测试删除好友
        addLog('测试删除好友...');
        await db.deleteFriend(friendId1);
        const friendsAfterDelete = await db.getFriends(user.id);
        addLog(`删除后好友数量: ${friendsAfterDelete.length}`);
        
        // 测试获取当前用户
        addLog('测试获取当前用户...');
        const currentUser = await db.getCurrentUser();
        addLog(`当前用户: ${currentUser ? currentUser.displayName : '无'}`);
        
        // 测试退出登录
        addLog('测试退出登录...');
        await db.logoutUser();
        const afterLogout = await db.getCurrentUser();
        addLog(`退出后: ${afterLogout ? '还有用户' : '已退出'}`);
      }
      
      addLog('=== 测试完成 ===');
      Alert.alert('完成', '数据库测试完成，请查看日志');
    } catch (error) {
      addLog(`错误: ${error}`);
      console.error(error);
    }
  };

  const resetDatabase = async () => {
    try {
      // 清空 AsyncStorage
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.clear();
      addLog('数据库已重置');
      Alert.alert('完成', '数据库已重置');
    } catch (error) {
      addLog(`重置失败: ${error}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>数据库调试页面</Text>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={testDatabase}>
          <Text style={styles.buttonText}>运行测试</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={resetDatabase}>
          <Text style={styles.buttonText}>重置数据库</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={clearLogs}>
          <Text style={styles.buttonText}>清除日志</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.logContainer}>
        {logs.map((log, index) => (
          <Text key={index} style={styles.logText}>{log}</Text>
        ))}
        {logs.length === 0 && (
          <Text style={styles.emptyText}>点击"运行测试"开始</Text>
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
