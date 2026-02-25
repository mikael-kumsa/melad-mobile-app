import { useMemo, useState } from "react";
import { Dimensions, FlatList, Image, Modal, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { galleryItems } from "../content";
import { useLanguage } from "../i18n/LanguageProvider";
import { palette } from "../theme/colors";

const gap = 12;
const cardSize = (Dimensions.get("window").width - 20 * 2 - gap) / 2;

export default function GalleryScreen() {
  const { t } = useLanguage();
  const [activeItem, setActiveItem] = useState(null);
  const data = useMemo(() => galleryItems, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.kicker}>{t("gallery.kicker")}</Text>
        <Text style={styles.title}>{t("gallery.title")}</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable onPress={() => setActiveItem(item)} style={styles.imageCard}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.captionBar}>
              <Text style={styles.caption} numberOfLines={1}>
                {t(`gallery.items.${item.id}`)}
              </Text>
            </View>
          </Pressable>
        )}
      />

      <Modal visible={!!activeItem} animationType="fade" transparent onRequestClose={() => setActiveItem(null)}>
        <View style={styles.modalBackdrop}>
          <Pressable style={styles.closeButton} onPress={() => setActiveItem(null)}>
            <Ionicons name="close" size={22} color="#FFF" />
          </Pressable>

          {activeItem ? (
            <View style={styles.modalCard}>
              <Image source={{ uri: activeItem.image }} style={styles.modalImage} resizeMode="cover" />
              <Text style={styles.modalTitle}>{t(`gallery.items.${activeItem.id}`)}</Text>
            </View>
          ) : null}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.canvas,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
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
  },
  grid: {
    paddingHorizontal: 20,
    paddingBottom: 22,
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
    borderColor: "#E8D5B3",
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
    borderColor: "#E8D5B3",
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