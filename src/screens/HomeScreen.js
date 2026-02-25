import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, ImageBackground, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLanguage } from "../i18n/LanguageProvider";
import { useAppTheme } from "../theme/ThemeProvider";

const highlightIcons = ["create-outline", "document-text-outline", "mic-outline"];

export default function HomeScreen() {
  const navigation = useNavigation();
  const { t, language } = useLanguage();
  const { palette, isDark } = useAppTheme();
  const [insightIndex, setInsightIndex] = useState(0);
  const styles = useMemo(() => createStyles(palette, isDark), [palette, isDark]);

  const highlights = t("home.highlights", []);
  const insights = t("home.insights", []);
  const timeline = t("home.timeline", "");
  const timelineText = Array.isArray(timeline) ? timeline.join(" ") : timeline || "";

  const heroFade = useRef(new Animated.Value(0)).current;
  const heroRise = useRef(new Animated.Value(22)).current;
  const sectionFade = useRef(new Animated.Value(0)).current;
  const insightFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(heroFade, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(heroRise, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(sectionFade, { toValue: 1, duration: 380, useNativeDriver: true }),
    ]).start();
  }, [heroFade, heroRise, sectionFade]);

  useEffect(() => {
    if (!Array.isArray(insights) || insights.length < 2) {
      return;
    }

    const timer = setInterval(() => {
      Animated.sequence([
        Animated.timing(insightFade, { toValue: 0, duration: 220, useNativeDriver: true }),
        Animated.timing(insightFade, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
      setInsightIndex((prev) => (prev + 1) % insights.length);
    }, 4200);

    return () => clearInterval(timer);
  }, [insightFade, insights]);

  useEffect(() => {
    setInsightIndex(0);
  }, [language]);

  const getHighlightBullets = (item) => {
    if (Array.isArray(item?.points)) {
      return item.points.filter(Boolean);
    }
    if (typeof item?.text === "string") {
      return item.text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    }
    return [];
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundShapeTop} />
      <View style={styles.backgroundShapeBottom} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.heroCard,
            {
              opacity: heroFade,
              transform: [{ translateY: heroRise }],
            },
          ]}
        >
          <ImageBackground
            source={require("../img/hero.jpg")}
            style={styles.heroImage}
            imageStyle={styles.heroImageInner}
          >
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <Text style={styles.kicker}>{t("home.kicker")}</Text>
              <Text style={styles.title}>{t("home.title")}</Text>
              <Text style={styles.tagline}>{t("home.tagline")}</Text>
            </View>
          </ImageBackground>
        </Animated.View>

        <Animated.View style={{ opacity: sectionFade }}>
          <Text style={styles.sectionTitle}>{t("home.featuredTitle")}</Text>
          {highlights.map((item, index) => (
            <View key={item.title} style={styles.highlightCard}>
              <View style={styles.iconWrap}>
                <Ionicons name={highlightIcons[index] || "sparkles-outline"} size={18} color={palette.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.highlightTitle}>{item.title}</Text>
                {getHighlightBullets(item).map((point, pointIndex) => (
                  <View key={`${item.title}_${pointIndex}`} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>{"\u2022"}</Text>
                    <Text style={styles.bulletText}>{point}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

          <Text style={styles.sectionTitle}>{t("home.insightsTitle")}</Text>
          <Animated.View style={[styles.insightCard, { opacity: insightFade }]}> 
            <Text style={styles.quoteMark}>"</Text>
            <Text style={styles.insightText}>{insights[insightIndex] || ""}</Text>
          </Animated.View>

         

          <Text style={styles.sectionTitle}>{t("home.timelineTitle")}</Text>
          <View style={styles.timelineTextCard}>
            <Text style={styles.timelineParagraph}>{timelineText}</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (palette, isDark) =>
  StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.canvas,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 22,
  },
  backgroundShapeTop: {
    position: "absolute",
    top: -60,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: isDark ? "#2B231B" : "#EBDAB8",
    opacity: 0.45,
  },
  backgroundShapeBottom: {
    position: "absolute",
    bottom: -80,
    left: -50,
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: isDark ? "#3A3025" : "#D8BE96",
    opacity: 0.22,
  },
  heroCard: {
    borderRadius: 24,
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.17,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 1,
    borderColor: isDark ? "#4C3C2D" : "#E8D5B3",
    marginBottom: 14,
    overflow: "hidden",
  },
  heroImage: {
    minHeight: 255,
    justifyContent: "flex-end",
  },
  heroImageInner: {
    borderRadius: 24,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(28, 20, 12, 0.75)",
  },
  heroContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  kicker: {
    color: "#F9E9C8",
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 10,
    fontWeight: "700",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
    marginBottom: 12,
  },
  tagline: {
    color: "#F4E8D6",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 14,
    marginBottom: 9,
  },
  highlightCard: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8D5B3",
    padding: 13,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: isDark ? "#3A2F24" : "#F4E1C2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 2,
  },
  highlightTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 3,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 3,
  },
  bulletDot: {
    color: palette.accentMuted,
    fontSize: 14,
    lineHeight: 21,
    marginRight: 7,
    marginTop: 0,
  },
  bulletText: {
    flex: 1,
    color: palette.inkSoft,
    fontSize: 14,
    lineHeight: 21,
  },
  insightCard: {
    backgroundColor: isDark ? "#2A221A" : "#FDF4E4",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: isDark ? "#5B4634" : "#E6CFA9",
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  quoteMark: {
    color: palette.accentMuted,
    fontSize: 28,
    lineHeight: 28,
    fontWeight: "700",
    marginBottom: 2,
  },
  insightText: {
    color: palette.inkSoft,
    fontSize: 15,
    lineHeight: 22,
  },
  quickRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  quickButton: {
    flex: 1,
    backgroundColor: palette.surface,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: isDark ? "#4C3C2D" : "#E8D5B3",
    paddingVertical: 10,
    alignItems: "center",
    marginRight: 8,
  },
  quickButtonLast: {
    marginRight: 0,
  },
  quickLabel: {
    color: palette.accent,
    fontSize: 14,
    fontWeight: "700",
  },
  timelineTextCard: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: isDark ? "#4C3C2D" : "#E8D5B3",
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  timelineParagraph: {
    color: palette.inkSoft,
    fontSize: 14,
    lineHeight: 22,
  },
  });
