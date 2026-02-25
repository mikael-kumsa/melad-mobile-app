import AsyncStorage from "@react-native-async-storage/async-storage";
import { galleryItems as fallbackGalleryItems, onlineVideos as fallbackOnlineVideos } from "../content";

const FEED_URL = "https://meladmedia.michaelkumsa.com/media-feed.php";
const CACHE_KEY = "@melad_media_feed_v1";

function normalizeGalleryItems(items) {
  if (!Array.isArray(items)) {
    return [];
  }
  return items
    .filter((item) => item && typeof item.image === "string")
    .map((item, index) => ({
      id: String(item.id || `img_${index + 1}`),
      image: item.image,
      title: typeof item.title === "string" ? item.title : "",
    }));
}

function normalizeOnlineVideos(items) {
  if (!Array.isArray(items)) {
    return [];
  }
  return items
    .filter((item) => item && typeof item.url === "string")
    .map((item, index) => ({
      id: String(item.id || `v_${index + 1}`),
      url: item.url,
      poster: typeof item.poster === "string" ? item.poster : "",
      title: typeof item.title === "string" ? item.title : "",
    }));
}

function withFallback(feed) {
  const gallery = normalizeGalleryItems(feed.galleryItems);
  const videos = normalizeOnlineVideos(feed.onlineVideos);
  return {
    galleryItems: gallery.length ? gallery : fallbackGalleryItems,
    onlineVideos: videos.length ? videos : fallbackOnlineVideos,
  };
}

export async function loadMediaFeed() {
  let lastError = "";

  try {
    const response = await fetch(FEED_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const raw = await response.text();
    const clean = raw.replace(/^\uFEFF/, "").trim();
    const json = JSON.parse(clean);
    const normalized = withFallback(json || {});
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(normalized));
    return { data: normalized, source: "remote", error: "" };
  } catch (error) {
    lastError = "Could not refresh from server. Showing saved content.";
  }

  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      const normalized = withFallback(parsed || {});
      return { data: normalized, source: "cache", error: lastError };
    }
  } catch (error) {
    // ignore cache parsing issues
  }

  return {
    data: { galleryItems: fallbackGalleryItems, onlineVideos: fallbackOnlineVideos },
    source: "fallback",
    error: lastError || "",
  };
}
