import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          marginBottom: 50,
        }}
      >
        Welcome to TaskTick
      </Text>

      {/* Login Button */}
      <TouchableOpacity
        onPress={() => router.push("/login")}
        style={{
          backgroundColor: "#4A90E2",
          padding: 15,
          borderRadius: 10,
          width: "80%",
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontSize: 18,
          }}
        >
          Login / Register
        </Text>
      </TouchableOpacity>

      {/* Offline Button */}
      <TouchableOpacity
        onPress={() => router.push("/offlinehome")}
        style={{
          backgroundColor: "#50C878",
          padding: 15,
          borderRadius: 10,
          width: "80%",
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontSize: 18,
          }}
        >
          Continue Offline
        </Text>
      </TouchableOpacity>
    </View>
  );
}