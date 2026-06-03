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
import {
  addFriend as addFriendToDB,
  deleteFriend as deleteFriendFromDB,
  getCurrentUser,
  getFriends,
  logoutUser,
  updateUserProfile,
} from "../database/sqlite";

type Friend = {
  id: number;
  name: string;
};

export default function Profile() {
  const { username, userId } = useLocalSearchParams();
  const uid = userId ? Number(userId) : 0;

  const [displayName, setDisplayName] = useState(String(username || "User"));
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoadingFriends, setIsLoadingFriends] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [friendName, setFriendName] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);

  // message toast
  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  useEffect(() => {
    // database load user profile
    const loadUserProfile = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser && currentUser.id === uid) {
        setDisplayName(currentUser.displayName);
        setCountry(currentUser.country);
        setGender(currentUser.gender);
        setBio(currentUser.bio);
      }
    };
    loadUserProfile().catch(console.error);
  }, [uid]);

  useEffect(() => {
    // database load friends
    const loadFriends = async () => {
      if (uid > 0) {
        const dbFriends = await getFriends(uid);
        setFriends(dbFriends);
      }
      setIsLoadingFriends(false);
    };
    loadFriends().catch(console.error);
  }, [uid]);

  const saveProfile = async () => {
    if (uid <= 0) {
      showMessage("Please login first", "error");
      return;
    }

    setIsSaving(true);
    try {
      await updateUserProfile(uid, displayName, country, gender, bio);
      showMessage("Profile saved successfully!", "success");
    } catch (error) {
      console.error(error);
      showMessage("Failed to save. Please try again", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const addFriend = async () => {
    if (!friendName.trim() || uid <= 0) {
      showMessage("Please enter friend name", "error");
      return;
    }

    try {
      const friendId = await addFriendToDB(uid, friendName);
      const newFriend: Friend = {
        id: friendId,
        name: friendName,
      };
      setFriends([...friends, newFriend]);
      setFriendName("");
      showMessage(`Friend added: ${friendName}`, "success");
    } catch (error) {
      console.error(error);
      showMessage("Failed to add friend. Please try again", "error");
    }
  };

  const deleteFriend = async (id: number, name: string) => {
    try {
      await deleteFriendFromDB(id);
      setFriends(friends.filter((friend) => friend.id !== id));
      showMessage(`Friend deleted: ${name}`, "success");
    } catch (error) {
      console.error(error);
      showMessage("Failed to delete friend. Please try again", "error");
    }
  };

  const handleLogout = async () => {
    console.log('[Profile] logging out...');
    setIsLoggingOut(true);
    try {
      await logoutUser();
      console.log('[Profile] logout successful, redirecting to home');
      router.replace("/");
    } catch (error) {
      console.error('[Profile] logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Toast message */}
      {message && (
        <View style={[styles.toast, message.type === 'success' ? styles.toastSuccess : styles.toastError]}>
          <Text style={styles.toastText}>{message.text}</Text>
        </View>
      )}
      
      <Text style={styles.title}>Profile</Text>

      <Text style={styles.sectionTitle}>User Information</Text>

      <TextInput
        placeholder="Display Name"
        value={displayName}
        onChangeText={setDisplayName}
        style={styles.input}
        editable={!isSaving && !isLoggingOut}
      />

      <TextInput
        placeholder="Country"
        value={country}
        onChangeText={setCountry}
        style={styles.input}
        editable={!isSaving && !isLoggingOut}
      />

      <TextInput
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
        style={styles.input}
        editable={!isSaving && !isLoggingOut}
      />

      <TextInput
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
        style={styles.bioInput}
        multiline
        editable={!isSaving && !isLoggingOut}
      />

      <TouchableOpacity 
        onPress={saveProfile} 
        style={[styles.saveButton, { opacity: isSaving || isLoggingOut ? 0.6 : 1 }]}
        disabled={isSaving || isLoggingOut}
      >
        {isSaving ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Save Profile</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Friends</Text>

      <TextInput
        placeholder="Enter friend name"
        value={friendName}
        onChangeText={setFriendName}
        style={styles.input}
        editable={!isSaving && !isLoggingOut}
      />

      <TouchableOpacity 
        onPress={addFriend} 
        style={[styles.friendButton, { opacity: isSaving || isLoggingOut ? 0.6 : 1 }]}
        disabled={isSaving || isLoggingOut}
      >
        <Text style={styles.buttonText}>Add Friend</Text>
      </TouchableOpacity>

      {isLoadingFriends ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Loading friends...</Text>
        </View>
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.friendCard}>
              <Text style={styles.friendName}>{item.name}</Text>

              <TouchableOpacity
                onPress={() => deleteFriend(item.id, item.name)}
                style={styles.deleteButton}
                disabled={isSaving || isLoggingOut}
              >
                <Text style={styles.deleteText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity 
        onPress={() =>
          router.push({
            pathname: "/home",
            params: { username: displayName, userId: uid },
          })
        } 
        style={styles.backButton}
        disabled={isSaving || isLoggingOut}
      >
        <Text style={styles.backText}>Back to Home</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={handleLogout} 
        style={[styles.logoutButton, { opacity: isLoggingOut || isSaving ? 0.6 : 1 }]}
        disabled={isSaving || isLoggingOut}
      >
        {isLoggingOut ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Logout</Text>
        )}
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

  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
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
