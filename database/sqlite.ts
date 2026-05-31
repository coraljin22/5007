import AsyncStorage from '@react-native-async-storage/async-storage';

export type User = {
  id: number;
  username: string;
  password: string;
  displayName: string;
  country: string;
  gender: string;
  bio: string;
};

export type Task = {
  id: number;
  userId: number;
  title: string;
  date: string;
};

export type Friend = {
  id: number;
  userId: number;
  name: string;
};

type StorageData = {
  users: User[];
  tasks: Task[];
  friends: Friend[];
  currentUserId: number | null;
};

const STORAGE_KEY = '@tasktisk_data';

// 获取下一个可用ID
function getNextId(data: StorageData): number {
  const allIds = [
    ...data.users.map(u => u.id),
    ...data.tasks.map(t => t.id),
    ...data.friends.map(f => f.id),
    0 // 确保至少有一个值
  ];
  return Math.max(...allIds) + 1;
}

async function getStorage(): Promise<StorageData> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // 确保数据结构正确
      return {
        users: parsed.users || [],
        tasks: parsed.tasks || [],
        friends: parsed.friends || [],
        currentUserId: parsed.currentUserId || null
      };
    }
  } catch (e) {
    console.error('Error reading storage:', e);
  }
  return {
    users: [],
    tasks: [],
    friends: [],
    currentUserId: null
  };
}

async function saveStorage(data: StorageData): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving storage:', e);
  }
}

export async function initDatabase(): Promise<void> {
  await getStorage();
}

export async function registerUser(username: string, password: string): Promise<number> {
  console.log('[DB] Registering user:', username);
  const data = await getStorage();
  const existing = data.users.find(u => u.username === username);
  if (existing) {
    console.log('[DB] User already exists');
    return 0;
  }
  
  const newUser: User = {
    id: getNextId(data),
    username,
    password,
    displayName: username,
    country: '',
    gender: '',
    bio: ''
  };
  
  data.users.push(newUser);
  await saveStorage(data);
  console.log('[DB] User registered successfully, ID:', newUser.id);
  return newUser.id;
}

export async function loginUser(username: string, password: string): Promise<User | null> {
  console.log('[DB] Logging in user:', username);
  const data = await getStorage();
  console.log('[DB] Current user count:', data.users.length);
  
  const user = data.users.find(u => u.username === username && u.password === password);
  if (user) {
    data.currentUserId = user.id;
    await saveStorage(data);
    console.log('[DB] Login successful, User ID:', user.id);
    return user;
  }
  console.log('[DB] Login failed, user does not exist or incorrect password');
  return null;
}

export async function logoutUser(): Promise<void> {
  console.log('[DB] Logging out');
  const data = await getStorage();
  data.currentUserId = null;
  await saveStorage(data);
  console.log('[DB] Login state cleared');
}

export async function getCurrentUser(): Promise<User | null> {
  const data = await getStorage();
  if (!data.currentUserId) {
    console.log('[DB] No current logged-in user');
    return null;
  }
  const user = data.users.find(u => u.id === data.currentUserId) || null;
  console.log('[DB] Current user:', user?.displayName);
  return user;
}

export async function updateUserProfile(
  userId: number,
  displayName: string,
  country: string,
  gender: string,
  bio: string
): Promise<void> {
  console.log('[DB] Updating user profile:', userId);
  const data = await getStorage();
  const user = data.users.find(u => u.id === userId);
  if (user) {
    user.displayName = displayName;
    user.country = country;
    user.gender = gender;
    user.bio = bio;
    await saveStorage(data);
    console.log('[DB] User profile updated');
  }
}

export async function addTask(userId: number, title: string, date: string): Promise<number> {
  console.log('[DB] Adding task:', title);
  const data = await getStorage();
  const newTask: Task = {
    id: getNextId(data),
    userId,
    title,
    date
  };
  data.tasks.push(newTask);
  await saveStorage(data);
  console.log('[DB] Task added successfully, ID:', newTask.id);
  return newTask.id;
}

export async function getTasks(userId: number): Promise<Task[]> {
  const data = await getStorage();
  return data.tasks.filter(t => t.userId === userId);
}

export async function deleteTask(taskId: number): Promise<void> {
  const data = await getStorage();
  data.tasks = data.tasks.filter(t => t.id !== taskId);
  await saveStorage(data);
}

// Friend Functions
export async function addFriend(userId: number, name: string): Promise<number> {
  console.log('[DB] Adding friend:', name);
  const data = await getStorage();
  const newFriend: Friend = {
    id: getNextId(data),
    userId,
    name
  };
  data.friends.push(newFriend);
  await saveStorage(data);
  console.log('[DB] Friend added, ID:', newFriend.id);
  return newFriend.id;
}

export async function getFriends(userId: number): Promise<Friend[]> {
  const data = await getStorage();
  return data.friends.filter(f => f.userId === userId);
}

export async function deleteFriend(friendId: number): Promise<void> {
  console.log('[DB] Deleting friend, ID:', friendId);
  const data = await getStorage();
  data.friends = data.friends.filter(f => f.id !== friendId);
  await saveStorage(data);
}
