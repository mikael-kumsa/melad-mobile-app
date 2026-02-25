import { useMemo, useState } from "react";
import { Linking, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { contactInfo, developerLinks } from "../content";
import { useLanguage } from "../i18n/LanguageProvider";
import { useAppTheme } from "../theme/ThemeProvider";

export default function ContactScreen() {
  const { t } = useLanguage();
  const { palette, isDark } = useAppTheme();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const styles = useMemo(() => createStyles(palette, isDark), [palette, isDark]);

  const contactCards = [
    {
      title: t("contact.cards.call"),
      value: contactInfo.callLabel,
      icon: "call-outline",
      action: contactInfo.callLink,
    },
    {
      title: t("contact.cards.email"),
      value: contactInfo.emailLabel,
      icon: "mail-outline",
      action: contactInfo.emailLink,
    },
    {
      title: t("contact.cards.website"),
      value: contactInfo.websiteLabel,
      icon: "globe-outline",
      action: contactInfo.websiteLink,
    },
  ];

  const handleOpen = async (url) => {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.kicker}>{t("contact.kicker")}</Text>
        <Text style={styles.title}>{t("contact.title")}</Text>
        <Text style={styles.lead}>{t("contact.lead")}</Text>

        {contactCards.map((item) => (
          <Pressable
            key={item.title}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => handleOpen(item.action)}
          >
            <View style={styles.iconWrap}>
              <Ionicons name={item.icon} size={20} color={palette.accent} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardValue}>{item.value}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={palette.accentMuted} />
          </Pressable>
        ))}

        <View style={styles.developerCard}>
          <Text style={styles.developerHeader}>{t("contact.developerHeader")}</Text>
          <Text style={styles.developerName}>{t("contact.developerName")}</Text>
          <Text style={styles.developerRole}>{t("contact.developerRole")}</Text>
          <Text style={styles.developerBio}>{t("contact.developerBio")}</Text>

          <Pressable onPress={() => handleOpen(developerLinks.emailLink)} style={styles.devLink}>
            <Ionicons name="mail-outline" size={16} color={palette.accent} />
            <Text style={styles.devLinkText}>{developerLinks.emailLabel}</Text>
          </Pressable>

          <Pressable onPress={() => handleOpen(developerLinks.websiteLink)} style={styles.devLink}>
            <Ionicons name="globe-outline" size={16} color={palette.accent} />
            <Text style={styles.devLinkText}>{developerLinks.websiteLabel}</Text>
          </Pressable>
        </View>

        <Pressable style={styles.privacyButton} onPress={() => setPrivacyOpen(true)}>
          <Ionicons name="shield-checkmark-outline" size={16} color={palette.accent} />
          <Text style={styles.privacyButtonText}>{t("contact.privacyButton")}</Text>
        </Pressable>
      </View>

      <Modal visible={privacyOpen} transparent animationType="fade" onRequestClose={() => setPrivacyOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t("contact.privacyTitle")}</Text>
              <Pressable style={styles.closeIcon} onPress={() => setPrivacyOpen(false)}>
                <Ionicons name="close" size={20} color={palette.text} />
              </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalBody}>{t("contact.privacyBody")}</Text>
            </ScrollView>
          </View>
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
    paddingHorizontal: 20,
    paddingTop: 16,
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
    marginBottom: 10,
  },
  lead: {
    color: palette.inkSoft,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 16,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: isDark ? "#4C3C2D" : "#E8D5B3",
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.11,
    shadowRadius: 10,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.995 }],
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: isDark ? "#3A2F24" : "#F4E1C2",
    marginRight: 12,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  cardValue: {
    color: palette.inkSoft,
    fontSize: 14,
  },
  developerCard: {
    marginTop: 6,
    backgroundColor: isDark ? "#2A221A" : "#FDF4E4",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: isDark ? "#5B4634" : "#E6CFA9",
    padding: 14,
    marginBottom: 10,
  },
  developerHeader: {
    color: palette.text,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
  },
  developerName: {
    color: palette.text,
    fontSize: 15,
    fontWeight: "700",
  },
  developerRole: {
    color: palette.accentMuted,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
    marginBottom: 8,
  },
  developerBio: {
    color: palette.inkSoft,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 10,
  },
  devLink: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  devLinkText: {
    color: palette.accent,
    fontSize: 14,
    marginLeft: 8,
    fontWeight: "600",
  },
  privacyButton: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: isDark ? "#5B4634" : "#E2CAA2",
    backgroundColor: isDark ? "#2B231B" : "#F8E9CF",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  privacyButtonText: {
    color: palette.accent,
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 7,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(12, 8, 5, 0.42)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  modalCard: {
    width: "100%",
    maxHeight: "72%",
    backgroundColor: palette.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: isDark ? "#4C3C2D" : "#E8D5B3",
    padding: 14,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  modalTitle: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "800",
  },
  closeIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: isDark ? "#3A2F24" : "#F4E1C2",
  },
  modalBody: {
    color: palette.inkSoft,
    fontSize: 14,
    lineHeight: 22,
  },
  });
