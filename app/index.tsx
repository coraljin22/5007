import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { getCurrentUser } from "../database/sqlite";

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // check if user is already logged in by querying the local SQLite database
    const checkLoginStatus = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        // if user is logged in, navigate to home screen with user info
        router.replace({
          pathname: "/home",
          params: {
            username: currentUser.displayName,
            userId: currentUser.id,
          },
        });
      }
      setIsLoading(false);
    };

    checkLoginStatus().catch(console.error);
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

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
