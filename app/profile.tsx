import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

type Friend = {
  id: string;
  name: string;
};

export default function Profile() {
  const { username } = useLocalSearchParams();

  const [displayName, setDisplayName] = useState(String(username || "User"));
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");

  const [friendName, setFriendName] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);

  const saveProfile = () => {
    Alert.alert("Success", "Profile information saved");
  };

  const addFriend = () => {
    if (!friendName.trim()) {
      Alert.alert("Error", "Please enter a friend name");
      return;
    }

    const newFriend: Friend = {
      id: Date.now().toString(),
      name: friendName,
    };

    setFriends([...friends, newFriend]);
    setFriendName("");
  };

  const deleteFriend = (id: string) => {
    setFriends(friends.filter((friend) => friend.id !== id));
  };

  const handleLogout = () => {
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <Text style={styles.sectionTitle}>User Information</Text>

      <TextInput
        placeholder="Username"
        value={displayName}
        onChangeText={setDisplayName}
        style={styles.input}
      />

      <TextInput
        placeholder="Country"
        value={country}
        onChangeText={setCountry}
        style={styles.input}
      />

      <TextInput
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
        style={styles.input}
      />

      <TextInput
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
        style={styles.bioInput}
        multiline
      />

      <TouchableOpacity onPress={saveProfile} style={styles.saveButton}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Friends</Text>

      <TextInput
        placeholder="Enter friend name"
        value={friendName}
        onChangeText={setFriendName}
        style={styles.input}
      />

      <TouchableOpacity onPress={addFriend} style={styles.friendButton}>
        <Text style={styles.buttonText}>Add Friend</Text>
      </TouchableOpacity>

      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.friendCard}>
            <Text style={styles.friendName}>{item.name}</Text>

            <TouchableOpacity
              onPress={() => deleteFriend(item.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity onPress={() => router.push("/home")} style={styles.backButton}>
        <Text style={styles.backText}>Back to Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
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

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },

  bioInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
    height: 80,
    textAlignVertical: "top",
  },

  saveButton: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  friendButton: {
    backgroundColor: "#50C878",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  friendCard: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  friendName: {
    fontSize: 16,
    fontWeight: "bold",
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

  backButton: {
    padding: 12,
    marginTop: 10,
  },

  backText: {
    color: "#4A90E2",
    textAlign: "center",
    fontSize: 16,
  },

  logoutButton: {
    backgroundColor: "#E74C3C",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "bold",
  },
});