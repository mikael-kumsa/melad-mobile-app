import { useMemo, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLanguage } from "../i18n/LanguageProvider";
import { useAppTheme } from "../theme/ThemeProvider";

const languageOptions = [
  { id: "en", key: "language.english", short: "EN" },
  { id: "am", key: "language.amharic", short: "AM" },
  { id: "om", key: "language.oromo", short: "OM" },
];

export default function AppHeader({ title }) {
  const { t, language, setLanguage } = useLanguage();
  const { palette, isDark, toggleMode } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const styles = useMemo(() => createStyles(palette, isDark), [palette, isDark]);

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top, height: 58 + insets.top }]}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.actions}>
        <Pressable style={styles.themeButton} onPress={toggleMode}>
          <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={16} color={palette.accent} />
        </Pressable>

        <Pressable style={styles.langButton} onPress={() => setOpen(true)}>
          <Text style={styles.langButtonText}>{language.toUpperCase()}</Text>
          <Ionicons name="chevron-down" size={15} color={palette.accent} />
        </Pressable>
      </View>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={[styles.backdrop, { paddingTop: 62 + insets.top }]} onPress={() => setOpen(false)}>
          <View style={styles.menu}>
            {languageOptions.map((option) => (
              <Pressable
                key={option.id}
                onPress={async () => {
                  await setLanguage(option.id);
                  setOpen(false);
                }}
                style={[styles.menuItem, language === option.id && styles.menuItemActive]}
              >
                <Text style={[styles.menuItemText, language === option.id && styles.menuItemTextActive]}>
                  {t(option.key)}
                </Text>
                <Text style={[styles.menuShort, language === option.id && styles.menuItemTextActive]}>
                  {option.short}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const createStyles = (palette, isDark) =>
  StyleSheet.create({
    wrapper: {
      height: 58,
      paddingHorizontal: 16,
      backgroundColor: palette.surface,
      borderBottomWidth: 1,
      borderBottomColor: palette.tabBorder,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      color: palette.text,
      fontSize: 20,
      fontWeight: "800",
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
    },
    themeButton: {
      width: 34,
      height: 34,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 8,
      borderWidth: 1,
      borderColor: isDark ? "#604A37" : "#E6CFA9",
      backgroundColor: isDark ? "#2A221A" : "#F8E9CF",
    },
    langButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: isDark ? "#604A37" : "#E6CFA9",
      backgroundColor: isDark ? "#2A221A" : "#F8E9CF",
    },
    langButtonText: {
      color: palette.accent,
      fontWeight: "700",
      fontSize: 12,
      marginRight: 4,
    },
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(10, 8, 4, 0.28)",
      justifyContent: "flex-start",
      alignItems: "flex-end",
      paddingTop: 62,
      paddingRight: 16,
    },
    menu: {
      width: 210,
      backgroundColor: palette.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: isDark ? "#4D3C2D" : "#E8D5B3",
      paddingVertical: 6,
    },
    menuItem: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 10,
      marginHorizontal: 6,
    },
    menuItemActive: {
      backgroundColor: isDark ? "#3A2F24" : "#F4E1C2",
    },
    menuItemText: {
      color: palette.text,
      fontSize: 14,
      fontWeight: "600",
    },
    menuItemTextActive: {
      color: palette.accent,
      fontWeight: "700",
    },
    menuShort: {
      color: palette.inkSoft,
      fontSize: 12,
      fontWeight: "700",
    },
  });
