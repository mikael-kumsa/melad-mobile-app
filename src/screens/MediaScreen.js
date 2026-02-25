import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, FlatList, Image, Modal, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { galleryItems as fallbackGalleryItems, onlineVideos as fallbackOnlineVideos } from "../content";
import { useLanguage } from "../i18n/LanguageProvider";
import { localVideoSource } from "../media/localVideoSource";
import { loadMediaFeed } from "../services/mediaFeed";
import { downloadToOffline, loadOfflineMap } from "../services/offlineMedia";
import { useAppTheme } from "../theme/ThemeProvider";

const gap = 12;
const cardSize = (Dimensions.get("window").width - 20 * 2 - gap) / 2;

export default function MediaScreen() {
  const { t } = useLanguage();
  const { palette, isDark } = useAppTheme();
  const [activeTab, setActiveTab] = useState("images");
  const [activeImage, setActiveImage] = useState(null);
  const [galleryItems, setGalleryItems] = useState(fallbackGalleryItems);
  const [onlineVideos, setOnlineVideos] = useState(fallbackOnlineVideos);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [feedError, setFeedError] = useState("");
  const [feedSource, setFeedSource] = useState("fallback");
  const [offlineMap, setOfflineMap] = useState({});
  const [downloadingByUrl, setDownloadingByUrl] = useState({});

  const imageData = useMemo(() => galleryItems, [galleryItems]);
  const styles = useMemo(() => createStyles(palette, isDark), [palette, isDark]);

  useEffect(() => {
    const hydrate = async () => {
      setLoadingFeed(true);
      const result = await loadMediaFeed();
      // Images are bundled locally for guaranteed offline access.
      setGalleryItems(fallbackGalleryItems);
      setOnlineVideos(result.data.onlineVideos);
      setFeedError(result.error);
      setFeedSource(result.source);
      setLoadingFeed(false);
    };
    hydrate();
  }, []);

  useEffect(() => {
    const hydrateOffline = async () => {
      const map = await loadOfflineMap();
      setOfflineMap(map);
    };
    hydrateOffline();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    const result = await loadMediaFeed();
    setGalleryItems(fallbackGalleryItems);
    setOnlineVideos(result.data.onlineVideos);
    setFeedError(result.error);
    setFeedSource(result.source);
    setRefreshing(false);
  };

  const getImageTitle = (item) => item.title || t(`gallery.items.${item.id}`, item.id);
  const getVideoTitle = (item) => item.title || t(`media.onlineTitles.${item.id}`, item.id);
  const getImageSource = (item) => {
    if (typeof item.image === "string") {
      return { uri: offlineMap[item.image]?.localUri || item.image };
    }
    return item.image;
  };
  const isOffline = (url) => !!offlineMap[url]?.localUri;

  const handleDownload = async (url) => {
    if (!url || downloadingByUrl[url] || isOffline(url)) {
      return;
    }
    setDownloadingByUrl((prev) => ({ ...prev, [url]: true }));
    try {
      const map = await downloadToOffline(url);
      setOfflineMap(map);
      Alert.alert("Downloaded", "Saved for offline viewing.");
    } catch (error) {
      Alert.alert("Download failed", "Could not save this file offline.");
    } finally {
      setDownloadingByUrl((prev) => ({ ...prev, [url]: false }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.kicker}>{t("media.kicker")}</Text>
        <Text style={styles.title}>{t("media.title")}</Text>

        <View style={styles.segment}>
          <Pressable
            style={[styles.segmentButton, activeTab === "images" && styles.segmentButtonActive]}
            onPress={() => setActiveTab("images")}
          >
            <Text style={[styles.segmentText, activeTab === "images" && styles.segmentTextActive]}>{t("media.imagesTab")}</Text>
          </Pressable>
          <Pressable
            style={[styles.segmentButton, activeTab === "videos" && styles.segmentButtonActive]}
            onPress={() => setActiveTab("videos")}
          >
            <Text style={[styles.segmentText, activeTab === "videos" && styles.segmentTextActive]}>{t("media.videosTab")}</Text>
          </Pressable>
        </View>
        <View style={styles.feedRow}>
          {feedError ? <Text style={styles.feedError}>{feedError}</Text> : <View />}
          <Pressable style={styles.refreshButton} onPress={handleRefresh} disabled={refreshing}>
            {refreshing ? (
              <ActivityIndicator color={palette.accent} size="small" />
            ) : (
              <>
                <Ionicons name="refresh" size={14} color={palette.accent} />
                <Text style={styles.refreshText}>Refresh</Text>
              </>
            )}
          </Pressable>
        </View>
        <Text style={styles.feedSourceText}>Video source: {feedSource}</Text>

        {loadingFeed ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={palette.accent} size="large" />
          </View>
        ) : activeTab === "images" ? (
          <FlatList
            key="media-images-grid"
            data={imageData}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.grid}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.imageCard}>
                <Pressable onPress={() => setActiveImage(item)}>
                  <Image source={getImageSource(item)} style={styles.image} />
                </Pressable>
                <View style={styles.captionBar}>
                  <Text style={styles.caption} numberOfLines={1}>
                    {getImageTitle(item)}
                  </Text>
                </View>
              </View>
            )}
          />
        ) : (
          <FlatList
            key="media-videos-list"
            data={[{ id: "local" }, ...onlineVideos]}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.videoList}
            renderItem={({ item }) =>
              item.id === "local" ? (
                <View style={styles.videoCard}>
                  <Text style={styles.videoTitle}>{t("media.localVideoTitle")}</Text>
                  <Text style={styles.localHint}>{t("media.localVideoDescription")}</Text>
                  {localVideoSource ? (
                    <Video
                      source={localVideoSource}
                      style={styles.video}
                      useNativeControls
                      resizeMode={ResizeMode.COVER}
                      shouldPlay={false}
                      isLooping={false}
                    />
                  ) : (
                    <View style={styles.videoPlaceholder}>
                      <Ionicons name="videocam-outline" size={22} color={palette.accentMuted} />
                      <Text style={styles.videoPlaceholderText}>{t("media.localVideoPlaceholder")}</Text>
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.videoCard}>
                  <Text style={styles.videoTitle}>{getVideoTitle(item)}</Text>
                  <View style={styles.videoActionRow}>
                    <Pressable
                      style={[styles.videoDownloadButton, isOffline(item.url) && styles.videoDownloadButtonDone]}
                      onPress={() => handleDownload(item.url)}
                    >
                      {downloadingByUrl[item.url] ? (
                        <ActivityIndicator color={palette.accent} size="small" />
                      ) : (
                        <>
                          <Ionicons
                            name={isOffline(item.url) ? "checkmark-circle" : "download-outline"}
                            size={14}
                            color={isOffline(item.url) ? "#2F7D32" : palette.accent}
                          />
                          <Text style={[styles.videoDownloadText, isOffline(item.url) && styles.videoDownloadTextDone]}>
                            {isOffline(item.url) ? "Offline" : "Download"}
                          </Text>
                        </>
                      )}
                    </Pressable>
                  </View>
                  <Video
                    source={{ uri: offlineMap[item.url]?.localUri || item.url }}
                    style={styles.video}
                    useNativeControls
                    resizeMode={ResizeMode.COVER}
                    shouldPlay={false}
                    isLooping={false}
                    usePoster={!!item.poster}
                    posterSource={item.poster ? { uri: item.poster } : undefined}
                  />
                </View>
              )
            }
          />
        )}
      </View>

      <Modal visible={!!activeImage} animationType="fade" transparent onRequestClose={() => setActiveImage(null)}>
        <View style={styles.modalBackdrop}>
          <Pressable style={styles.closeButton} onPress={() => setActiveImage(null)}>
            <Ionicons name="close" size={22} color="#FFF" />
          </Pressable>
          {activeImage ? (
            <View style={styles.modalCard}>
              <Image source={getImageSource(activeImage)} style={styles.modalImage} resizeMode="cover" />
              <Text style={styles.modalTitle}>{getImageTitle(activeImage)}</Text>
            </View>
          ) : null}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (palette, isDark) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.canvas,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  kicker: {
    color: palette.accentMuted,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.1,
    fontWeight: "700",
    marginBottom: 8,
  },
  title: {
    color: palette.text,
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 12,
  },
  segment: {
    flexDirection: "row",
    backgroundColor: isDark ? "#2A221A" : "#F7E8CB",
    borderRadius: 999,
    padding: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: isDark ? "#5B4634" : "#E5CEA7",
  },
  segmentButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    paddingVertical: 8,
  },
  segmentButtonActive: {
    backgroundColor: palette.accent,
  },
  segmentText: {
    color: palette.accent,
    fontSize: 13,
    fontWeight: "700",
  },
  segmentTextActive: {
    color: "#FFF",
  },
  feedRow: {
    minHeight: 26,
    marginBottom: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feedError: {
    color: "#9B3F27",
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: isDark ? "#5B4634" : "#E2CAA2",
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: isDark ? "#2B231B" : "#F8E9CF",
  },
  refreshText: {
    color: palette.accent,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 5,
  },
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  feedSourceText: {
    color: palette.inkSoft,
    fontSize: 11,
    marginBottom: 4,
  },
  grid: {
    paddingBottom: 16,
  },
  row: {
    justifyContent: "space-between",
  },
  imageCard: {
    width: cardSize,
    borderRadius: 16,
    overflow: "hidden",
    marginTop: gap,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: isDark ? "#4C3C2D" : "#E8D5B3",
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: cardSize + 4,
  },
  captionBar: {
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  caption: {
    color: palette.text,
    fontSize: 13,
    fontWeight: "600",
  },
  videoList: {
    paddingTop: 4,
    paddingBottom: 16,
  },
  videoCard: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: isDark ? "#4C3C2D" : "#E8D5B3",
    padding: 12,
    marginTop: 10,
  },
  videoTitle: {
    color: palette.text,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
  },
  videoActionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  videoDownloadButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: isDark ? "#5B4634" : "#E2CAA2",
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: isDark ? "#2B231B" : "#F8E9CF",
  },
  videoDownloadButtonDone: {
    borderColor: isDark ? "#5E8F60" : "#8BC38C",
    backgroundColor: isDark ? "#1F2B20" : "#EAF7EB",
  },
  videoDownloadText: {
    color: palette.accent,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 5,
  },
  videoDownloadTextDone: {
    color: "#2F7D32",
  },
  localHint: {
    color: palette.inkSoft,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
  },
  video: {
    width: "100%",
    height: 190,
    borderRadius: 12,
    backgroundColor: "#000",
  },
  videoPlaceholder: {
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDark ? "#5B4634" : "#E0C79E",
    backgroundColor: isDark ? "#2B231B" : "#F8E9CF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  videoPlaceholderText: {
    color: palette.inkSoft,
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 19,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(18, 12, 8, 0.76)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 22,
    zIndex: 2,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  modalCard: {
    width: "100%",
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: isDark ? "#4C3C2D" : "#E8D5B3",
  },
  modalImage: {
    width: "100%",
    height: 420,
  },
  modalTitle: {
    color: palette.text,
    fontSize: 17,
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  });
