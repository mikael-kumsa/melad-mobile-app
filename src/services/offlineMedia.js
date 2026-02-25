import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";

const STORAGE_KEY = "@melad_offline_media_v1";
const CACHE_DIR = `${FileSystem.documentDirectory}media-cache/`;

function safeFilenameFromUrl(url) {
  const base = url.split("?")[0].split("#")[0];
  const extMatch = base.match(/\.([a-zA-Z0-9]{2,6})$/);
  const ext = extMatch ? extMatch[1].toLowerCase() : "bin";
  const slug = base
    .replace(/^https?:\/\//, "")
    .replace(/[^a-zA-Z0-9]/g, "_")
    .slice(-80);
  return `${slug}.${ext}`;
}

async function ensureCacheDir() {
  const info = await FileSystem.getInfoAsync(CACHE_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
  }
}

async function readMap() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    return {};
  }
}

async function writeMap(map) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

async function validateExistingMap(map) {
  const valid = {};
  const entries = Object.entries(map);
  for (const [remoteUrl, meta] of entries) {
    if (!meta || typeof meta.localUri !== "string") {
      continue;
    }
    const info = await FileSystem.getInfoAsync(meta.localUri);
    if (info.exists) {
      valid[remoteUrl] = meta;
    }
  }
  return valid;
}

export async function loadOfflineMap() {
  const map = await readMap();
  const validMap = await validateExistingMap(map);
  if (Object.keys(validMap).length !== Object.keys(map).length) {
    await writeMap(validMap);
  }
  return validMap;
}

export async function downloadToOffline(remoteUrl) {
  await ensureCacheDir();
  const filename = safeFilenameFromUrl(remoteUrl);
  const localUri = `${CACHE_DIR}${filename}`;
  await FileSystem.downloadAsync(remoteUrl, localUri);

  const map = await loadOfflineMap();
  const next = {
    ...map,
    [remoteUrl]: { localUri, downloadedAt: Date.now() },
  };
  await writeMap(next);
  return next;
}
