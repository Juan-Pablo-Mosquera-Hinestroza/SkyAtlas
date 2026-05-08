import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";

const TUTORIAL_STORAGE_KEY = "skyalas-tutorial-seen";
const TUTORIAL_FILE = FileSystem.documentDirectory
  ? `${FileSystem.documentDirectory}skyalas-tutorial.json`
  : null;

const coerceBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value === "true") return true;
    if (value === "false") return false;
  }
  return false;
};

const readLocalStorageSeen = () => {
  if (!globalThis.localStorage) return false;
  return coerceBoolean(globalThis.localStorage.getItem(TUTORIAL_STORAGE_KEY));
};

const writeLocalStorageSeen = (seen) => {
  if (!globalThis.localStorage) return;
  globalThis.localStorage.setItem(TUTORIAL_STORAGE_KEY, String(!!seen));
};

const ensureTutorialFile = async () => {
  if (!TUTORIAL_FILE) return;

  const info = await FileSystem.getInfoAsync(TUTORIAL_FILE);
  if (info.exists) return;

  const payload = JSON.stringify(
    {
      hasSeenTutorial: false,
      updatedAt: new Date().toISOString(),
    },
    null,
    2,
  );

  await FileSystem.writeAsStringAsync(TUTORIAL_FILE, payload);
};

const readTutorialFileSeen = async () => {
  await ensureTutorialFile();
  if (!TUTORIAL_FILE) return false;

  try {
    const raw = await FileSystem.readAsStringAsync(TUTORIAL_FILE);
    const parsed = JSON.parse(raw);
    return !!parsed?.hasSeenTutorial;
  } catch (error) {
    return false;
  }
};

const writeTutorialFileSeen = async (seen) => {
  await ensureTutorialFile();
  if (!TUTORIAL_FILE) return;

  const payload = JSON.stringify(
    {
      hasSeenTutorial: !!seen,
      updatedAt: new Date().toISOString(),
    },
    null,
    2,
  );

  await FileSystem.writeAsStringAsync(TUTORIAL_FILE, payload);
};

export const hasSeenTutorial = async () => {
  if (Platform.OS === "web") {
    return readLocalStorageSeen();
  }

  return await readTutorialFileSeen();
};

export const setHasSeenTutorial = async (seen) => {
  if (Platform.OS === "web") {
    writeLocalStorageSeen(seen);
    return;
  }

  await writeTutorialFileSeen(seen);
};

export const resetTutorial = async () => {
  await setHasSeenTutorial(false);
};
