import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Calendar } from "react-native-calendars";
import { addTask, deleteTask as deleteTaskFromDB, getTasks } from "../database/sqlite";

type Task = {
  id: string;
  title: string;
  date: string;
};

export default function Home() {
  const { username, userId } = useLocalSearchParams();
  const uid = userId ? Number(userId) : 0;

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Helper function to show toast messages
  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  useEffect(() => {
    const loadTasks = async () => {
      if (uid > 0) {
        const dbTasks = await getTasks(uid);
        setTasks(dbTasks.map(t => ({
          id: t.id.toString(),
          title: t.title,
          date: t.date,
        })));
      }
      setIsLoading(false);
    };
    
    loadTasks().catch(console.error);
  }, [uid]);

  const addTaskHandler = async () => {
    if (!task.trim() || uid <= 0) {
      showMessage("Please enter task description", "error");
      return;
    }

    setIsAdding(true);
    try {
      const taskDate = selectedDate || "No date selected";
      const taskId = await addTask(uid, task, taskDate);

      const newTask: Task = {
        id: taskId.toString(),
        title: task,
        date: taskDate,
      };

      setTasks([...tasks, newTask]);
      setTask("");
      setSelectedDate("");
      showMessage("Task added successfully!", "success");
    } catch (error) {
      console.error(error);
      showMessage("Failed to add task. Please try again", "error");
    } finally {
      setIsAdding(false);
    }
  };

  const deleteTaskHandler = async (id: string, taskTitle: string) => {
    setIsAdding(true);
    try {
      await deleteTaskFromDB(Number(id));
      setTasks(tasks.filter((item) => item.id !== id));
      showMessage(`"${taskTitle}" deleted`, "success");
    } catch (error) {
      console.error(error);
      showMessage("Failed to delete. Please try again", "error");
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Toast Message */}
      {message && (
        <View style={[styles.toast, message.type === 'success' ? styles.toastSuccess : styles.toastError]}>
          <Text style={styles.toastText}>{message.text}</Text>
        </View>
      )}
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Hello, {username || "User"}
        </Text>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/profile",
              params: {
                username: username || "User",
                userId: uid,
              },
            })
          }
          style={styles.profileButton}
          disabled={isAdding}
        >
          <Text style={styles.profileText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Task Input */}
      <TextInput
        placeholder="Enter Task"
        value={task}
        onChangeText={setTask}
        style={styles.input}
        editable={!isAdding}
      />

      {/* Calendar */}
      <Text style={styles.label}>Select Date</Text>

      <Calendar
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: "#4A90E2",
          },
        }}
        style={styles.calendar}
      />

      <Text style={styles.selectedText}>
        Selected Date: {selectedDate || "None"}
      </Text>

      {/* Add Task Button */}
      <TouchableOpacity 
        style={[styles.button, { opacity: isAdding ? 0.6 : 1 }]} 
        onPress={addTaskHandler}
        disabled={isAdding}
      >
        {isAdding ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Add Task</Text>
        )}
      </TouchableOpacity>

      {/* Task List */}
      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tasks yet. Add your first task!</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <View>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskDate}>{item.date}</Text>
              </View>

              <TouchableOpacity
                onPress={() => deleteTaskHandler(item.id, item.title)}
                style={styles.deleteButton}
                disabled={isAdding}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    marginTop: 50,
  },

  toast: {
    position: "absolute",
    top: 60,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    zIndex: 1000,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  toastSuccess: {
    backgroundColor: "#10B981",
  },
  toastError: {
    backgroundColor: "#EF4444",
  },
  toastText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
    textAlign: "center",
  },

  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
  },

  profileButton: {
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },

  profileText: {
    color: "white",
    fontWeight: "bold",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },

  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  calendar: {
    borderRadius: 10,
    marginBottom: 15,
  },

  selectedText: {
    fontSize: 16,
    marginBottom: 15,
  },

  button: {
    backgroundColor: "#4A90E2",
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

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
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
