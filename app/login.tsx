import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter username and password");
      return;
    }

    router.push({
      pathname: "/home",
      params: { username: username },
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 30 }}>
        Login
      </Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, padding: 12, marginBottom: 15, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 12, marginBottom: 20, borderRadius: 8 }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={{ backgroundColor: "#4A90E2", padding: 15, borderRadius: 10 }}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")} style={{ marginTop: 20 }}>
        <Text style={{ color: "#4A90E2", textAlign: "center" }}>
          Create New Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}