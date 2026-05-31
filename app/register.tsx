import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { registerUser } from "../database/sqlite";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // show toast message
  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRegister = async () => {
    console.log('[Register] Starting registration...');
    
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      showMessage("Please fill in all required fields", "error");
      return;
    }

    if (password !== confirmPassword) {
      showMessage("Passwords do not match", "error");
      return;
    }

    if (password.length < 4) {
      showMessage("Password must be at least 4 characters", "error");
      return;
    }

    setIsLoading(true);
    try {
      const userId = await registerUser(username.trim(), password.trim());
      console.log('[Register] Registration result, userId:', userId);
      
      if (userId > 0) {
        showMessage("Account created successfully!", "success");
        setTimeout(() => {
          router.replace("/login");
        }, 1500);
      } else {
        showMessage("Username already exists. Please choose another username", "error");
      }
    } catch (error) {
      console.error('[Register] Error:', error);
      showMessage("An error occurred during registration. Please try again", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Toast Message */}
      {message && (
        <View style={[styles.toast, message.type === 'success' ? styles.toastSuccess : styles.toastError]}>
          <Text style={styles.toastText}>{message.text}</Text>
        </View>
      )}
      
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Username *"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        editable={!isLoading}
      />

      <TextInput
        placeholder="Password *"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        editable={!isLoading}
      />

      <TextInput
        placeholder="Confirm Password *"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
        editable={!isLoading}
      />

      <TouchableOpacity style={[styles.button, { opacity: isLoading ? 0.6 : 1 }]} onPress={handleRegister} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")} disabled={isLoading}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  toast: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    paddingHorizontal: 20,
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
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
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
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginText: {
    textAlign: "center",
    color: "#4A90E2",
    fontSize: 16,
  },
});
