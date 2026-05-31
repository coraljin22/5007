import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { loginUser } from "../database/sqlite";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // show toast message
  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleLogin = async () => {
    console.log('[Login] Starting login...');
    
    if (!username.trim() || !password.trim()) {
      showMessage("Please enter username and password", "error");
      return;
    }

    setIsLoading(true);
    try {
      const user = await loginUser(username.trim(), password.trim());
      console.log('[Login] Login result:', user);
      
      if (user) {
        showMessage("Login successful!", "success");
        // delay navigation to allow user to see the success message
        setTimeout(() => {
          router.replace({
            pathname: "/home",
            params: { username: user.displayName, userId: user.id },
          });
        }, 800);
      } else {
        showMessage("Invalid username or password. Please check or register first", "error");
      }
    } catch (error) {
      console.error('[Login] Error:', error);
      showMessage("Error occurred during login. Please try again", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Toast Message */}
      {message && (
        <View style={[styles.toast, message.type === 'success' ? styles.toastSuccess : styles.toastError]}>
          <Text style={styles.toastText}>{message.text}</Text>
        </View>
      )}
      
      <Text style={styles.title}>
        Login
      </Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        editable={!isLoading}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        editable={!isLoading}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={[styles.button, { opacity: isLoading ? 0.6 : 1 }]}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>
            Login
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/Register")} style={styles.registerLink} disabled={isLoading}>
        <Text style={styles.registerText}>
          Create New Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
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

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: 'center',
  },

  input: {
    borderWidth: 1,
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    fontSize: 16,
    borderColor: '#ccc',
  },

  button: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },

  registerLink: {
    marginTop: 20,
  },

  registerText: {
    color: "#4A90E2",
    textAlign: "center",
    fontSize: 16,
  },
});
