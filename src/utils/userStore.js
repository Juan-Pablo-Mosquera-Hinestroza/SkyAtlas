import * as FileSystem from "expo-file-system";
import seedUsers from "../data/users.json";

const USERS_FILE = `${FileSystem.documentDirectory}skyalas-users.json`;

const ensureUsersFile = async () => {
  const info = await FileSystem.getInfoAsync(USERS_FILE);
  if (!info.exists) {
    const initial = Array.isArray(seedUsers) ? seedUsers : [];
    await FileSystem.writeAsStringAsync(USERS_FILE, JSON.stringify(initial, null, 2));
  }
};

export const loadUsers = async () => {
  await ensureUsersFile();
  const raw = await FileSystem.readAsStringAsync(USERS_FILE);
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return Array.isArray(seedUsers) ? seedUsers : [];
  }
};

export const saveUsers = async (users) => {
  await ensureUsersFile();
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
