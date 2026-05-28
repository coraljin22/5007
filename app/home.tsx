import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

type Task = {
  id: string;
  title: string;
  date: string;
  completed: boolean;
};

export default function Home() {
  // Get username from login page
  const { username } = useLocalSearchParams();

  // States
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  // Add Task
  const addTask = () => {
    if (!task.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: task,
      date: date,
      completed: false,
    };

    setTasks([...tasks, newTask]);

    // Clear input fields
    setTask("");
    setDate("");
  };

  // Delete Task
  const deleteTask = (id: string) => {
    setTasks(tasks.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Welcome */}
      <Text style={styles.welcomeText}>
        Hello, {username || "User"}
      </Text>

      {/* Task Input */}
      <TextInput
        placeholder="Enter Task"
        value={task}
        onChangeText={setTask}
        style={styles.input}
      />

      {/* Date Input */}
      <TextInput
        placeholder="Enter Date / Time"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />

      {/* Add Task Button */}
      <TouchableOpacity style={styles.button} onPress={addTask}>
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>

      {/* Profile Button */}
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/profile",
            params: {
              username: username || "User",
            },
          })
        }
        style={styles.profileButton}
      >
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>

      {/* Task List */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <View>
              <Text style={styles.taskTitle}>{item.title}</Text>

              <Text style={styles.taskDate}>
                {item.date || "No Date"}
              </Text>
            </View>

            {/* Delete Button */}
            <TouchableOpacity
              onPress={() => deleteTask(item.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    marginTop: 50,
  },

  welcomeText: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 25,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  profileButton: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },

  taskCard: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  taskDate: {
    color: "gray",
    marginTop: 5,
  },

  deleteButton: {
    backgroundColor: "#E74C3C",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
});