import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";
import seedUsers from "../data/users.json";

const USERS_STORAGE_KEY = "skyalas-users";
const USERS_FILE = FileSystem.documentDirectory
  ? `${FileSystem.documentDirectory}skyalas-users.json`
  : null;

const ensureUsersFile = async () => {
  if (Platform.OS === "web") {
    if (!globalThis.localStorage) {
      return;
    }

    if (!globalThis.localStorage.getItem(USERS_STORAGE_KEY)) {
      const initial = Array.isArray(seedUsers) ? seedUsers : [];
      globalThis.localStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify(initial, null, 2),
      );
    }
    return;
  }

  if (!USERS_FILE) {
    return;
  }

  const info = await FileSystem.getInfoAsync(USERS_FILE);
  if (!info.exists) {
    const initial = Array.isArray(seedUsers) ? seedUsers : [];
    await FileSystem.writeAsStringAsync(USERS_FILE, JSON.stringify(initial, null, 2));
  }
};

export const loadUsers = async () => {
  if (Platform.OS === "web") {
    if (!globalThis.localStorage) {
      return Array.isArray(seedUsers) ? seedUsers : [];
    }

    const raw = globalThis.localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      return Array.isArray(seedUsers) ? seedUsers : [];
    }

    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return Array.isArray(seedUsers) ? seedUsers : [];
    }
  }

  await ensureUsersFile();
  if (!USERS_FILE) {
    return Array.isArray(seedUsers) ? seedUsers : [];
  }
  const raw = await FileSystem.readAsStringAsync(USERS_FILE);
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return Array.isArray(seedUsers) ? seedUsers : [];
  }
};

export const saveUsers = async (users) => {
  if (Platform.OS === "web") {
    if (!globalThis.localStorage) {
      return;
    }

    const payload = JSON.stringify(users, null, 2);
    globalThis.localStorage.setItem(USERS_STORAGE_KEY, payload);
    return;
  }

  await ensureUsersFile();
  if (!USERS_FILE) {
    return;
  }
  const payload = JSON.stringify(users, null, 2);
  await FileSystem.writeAsStringAsync(USERS_FILE, payload);
};

export const findUserByEmailOrUsername = (users, identifier) => {
  const normalized = identifier.trim().toLowerCase();
  return users.find(
    (user) =>
      user.email.toLowerCase() === normalized ||
      user.username.toLowerCase() === normalized,
  );
};

export const createUser = ({ name, email, username, password }) => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  name: name.trim(),
  email: email.trim(),
  username: username.trim(),
  password,
  createdAt: new Date().toISOString(),
});
