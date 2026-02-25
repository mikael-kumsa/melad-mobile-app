import { useEffect, useMemo, useRef } from "react";
import { Animated, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { serviceItems } from "../content";
import { useLanguage } from "../i18n/LanguageProvider";
import { useAppTheme } from "../theme/ThemeProvider";

export default function ServicesScreen() {
  const { t } = useLanguage();
  const { palette, isDark } = useAppTheme();
  const rise = useRef(new Animated.Value(10)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const styles = useMemo(() => createStyles(palette, isDark), [palette, isDark]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(rise, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [fade, rise]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>{t("services.kicker")}</Text>
        <Text style={styles.title}>{t("services.title")}</Text>

        <Animated.View style={{ opacity: fade, transform: [{ translateY: rise }] }}>
          {serviceItems.map((item) => {
            const translated = t(`services.items.${item.id}`, {});
            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.iconWrap}>
                  <Ionicons name={item.icon} size={21} color={palette.accent} />
                </View>
                <View style={styles.textWrap}>
                  <Text style={styles.cardTitle}>{translated.title || ""}</Text>
                  <Text style={styles.cardSubtitle}>{translated.subtitle || ""}</Text>
                  <Text style={styles.cardBody}>{translated.description || ""}</Text>
                </View>
              </View>
            );
          })}
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
    paddingBottom: 26,
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
    marginBottom: 16,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: isDark ? "#4C3C2D" : "#E8D5B3",
    marginBottom: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.11,
    shadowRadius: 10,
    elevation: 3,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: isDark ? "#3A2F24" : "#F4E1C2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 3,
  },
  textWrap: {
    flex: 1,
  },
  cardTitle: {
    color: palette.text,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 2,
  },
  cardSubtitle: {
    color: palette.accentMuted,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  cardBody: {
    color: palette.inkSoft,
    fontSize: 14,
    lineHeight: 21,
  },
  });
