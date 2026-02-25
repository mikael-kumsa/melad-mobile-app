import { useEffect, useMemo, useRef } from "react";
import { Animated, Image, Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { managerProfile, socialLinks } from "../content";
import { useLanguage } from "../i18n/LanguageProvider";
import { useAppTheme } from "../theme/ThemeProvider";

export default function AboutScreen() {
  const { t } = useLanguage();
  const { palette, isDark } = useAppTheme();
  const fade = useRef(new Animated.Value(0)).current;
  const styles = useMemo(() => createStyles(palette, isDark), [palette, isDark]);

  const aboutSections = t("about.sections", []);

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 550,
      useNativeDriver: true,
    }).start();
  }, [fade]);

  const handleOpenLink = async (url) => {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fade }}>
          <Text style={styles.kicker}>{t("about.kicker")}</Text>
          <Text style={styles.title}>{t("about.title")}</Text>
          <Text style={styles.lead}>{t("about.lead")}</Text>

          {aboutSections.map((section) => (
            <View key={section.title} style={styles.card}>
              <Text style={styles.cardTitle}>{section.title}</Text>
              <Text style={styles.cardBody}>{section.body}</Text>
            </View>
          ))}

          <View style={styles.managerCard}>
            <Text style={styles.managerHeader}>{t("about.managerHeader")}</Text>
            <View style={styles.managerTopRow}>
              <Image source={managerProfile.image} style={styles.managerImage} />
              <View style={styles.managerMeta}>
                <Text style={styles.managerName}>{t("about.managerName")}</Text>
                <Text style={styles.managerTitle}>{t("about.managerTitle")}</Text>
              </View>
            </View>
            <Text style={styles.managerBody}>{t("about.managerBody")}</Text>
          </View>

          <View style={styles.socialCard}>
            <Text style={styles.socialHeader}>Follow Melad</Text>
            <View style={styles.socialGrid}>
              {socialLinks.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => handleOpenLink(item.url)}
                  style={({ pressed }) => [styles.socialButton, pressed && styles.socialButtonPressed]}
                >
                  <View style={[styles.socialIconWrap, { backgroundColor: item.color }]}>
                    <MaterialCommunityIcons name={item.icon} size={18} color="#FFF" />
                  </View>
                  <Text style={styles.socialLabel}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },
  kicker: {
    color: palette.accentMuted,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.1,
    fontWeight: "700",
    marginBottom: 10,
  },
  title: {
    color: palette.text,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
    marginBottom: 12,
  },
  lead: {
    color: palette.inkSoft,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 18,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: isDark ? "#4C3C2D" : "#E8D5B3",
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  cardBody: {
    color: palette.inkSoft,
    fontSize: 15,
    lineHeight: 23,
  },
  managerCard: {
    marginTop: 6,
    backgroundColor: isDark ? "#2A221A" : "#FDF4E4",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: isDark ? "#5B4634" : "#E6CFA9",
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  managerHeader: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  managerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  managerImage: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: isDark ? "#4C3C2D" : "#E8D5B3",
    marginRight: 12,
  },
  managerMeta: {
    flex: 1,
  },
  managerName: {
    color: palette.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 3,
  },
  managerTitle: {
    color: palette.accentMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  managerBody: {
    color: palette.inkSoft,
    fontSize: 15,
    lineHeight: 23,
  },
  socialCard: {
    marginTop: 10,
    backgroundColor: palette.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: isDark ? "#4C3C2D" : "#E8D5B3",
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  socialHeader: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  socialGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  socialButton: {
    width: "48.3%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: isDark ? "#2B231B" : "#F8E9CF",
    borderWidth: 1,
    borderColor: isDark ? "#5B4634" : "#E5CEA7",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 8,
  },
  socialButtonPressed: {
    opacity: 0.86,
  },
  socialIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  socialLabel: {
    color: palette.text,
    fontSize: 14,
    fontWeight: "700",
  },
  });
