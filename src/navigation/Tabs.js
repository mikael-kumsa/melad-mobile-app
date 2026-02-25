import { useMemo, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Linking, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HomeScreen from "../screens/HomeScreen";
import AboutScreen from "../screens/AboutScreen";
import ServicesScreen from "../screens/ServicesScreen";
import MediaScreen from "../screens/MediaScreen";
import ContactScreen from "../screens/ContactScreen";
import AppHeader from "../components/AppHeader";
import { floatingActions } from "../content";
import { useLanguage } from "../i18n/LanguageProvider";
import { useAppTheme } from "../theme/ThemeProvider";

const Tab = createBottomTabNavigator();

const iconMap = {
  Home: ["home-outline", "home"],
  About: ["book-outline", "book"],
  Services: ["layers-outline", "layers"],
  Media: ["play-circle-outline", "play-circle"],
  Contact: ["call-outline", "call"],
};

export default function Tabs() {
  const { t } = useLanguage();
  const { palette, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [fabOpen, setFabOpen] = useState(false);
  const styles = useMemo(() => createStyles(palette, isDark), [palette, isDark]);

  const openAction = async (url) => {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
    setFabOpen(false);
  };

  return (
    <View style={styles.root}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: true,
          header: () => <AppHeader title={t(`tabs.${route.name.toLowerCase()}`, route.name)} />,
          tabBarLabel: t(`tabs.${route.name.toLowerCase()}`, route.name),
          tabBarActiveTintColor: palette.accent,
          tabBarInactiveTintColor: palette.inkSoft,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
            marginBottom: 3,
          },
          tabBarStyle: {
            backgroundColor: palette.surface,
            borderTopColor: palette.tabBorder,
            height: 56 + insets.bottom,
            paddingTop: 4,
            paddingBottom: Math.max(insets.bottom, 6),
          },
          tabBarIcon: ({ focused, color, size }) => {
            const [inactiveIcon, activeIcon] = iconMap[route.name];
            return <Ionicons name={focused ? activeIcon : inactiveIcon} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="About" component={AboutScreen} />
        <Tab.Screen name="Services" component={ServicesScreen} />
        <Tab.Screen name="Media" component={MediaScreen} />
        <Tab.Screen name="Contact" component={ContactScreen} />
      </Tab.Navigator>

      <Pressable style={[styles.fab, { bottom: 74 + insets.bottom }]} onPress={() => setFabOpen(true)}>
        <Ionicons name="add" size={26} color="#FFF" />
      </Pressable>

      <Modal visible={fabOpen} transparent animationType="fade" onRequestClose={() => setFabOpen(false)}>
        <Pressable style={[styles.modalOverlay, { paddingBottom: 140 + insets.bottom }]} onPress={() => setFabOpen(false)}>
          <View style={styles.sheet}>
            {floatingActions.map((action) => (
              <Pressable key={action.id} style={styles.sheetItem} onPress={() => openAction(action.url)}>
                <View style={styles.sheetIconWrap}>
                  <Ionicons name={action.icon} size={18} color={palette.accent} />
                </View>
                <Text style={styles.sheetLabel}>{action.label}</Text>
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
    root: {
      flex: 1,
    },
    fab: {
      position: "absolute",
      right: 18,
      bottom: 74,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: palette.accent,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: palette.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.22,
      shadowRadius: 12,
      elevation: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(9, 7, 5, 0.32)",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      paddingRight: 16,
      paddingBottom: 140,
    },
    sheet: {
      width: 210,
      backgroundColor: palette.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: isDark ? "#4D3C2D" : "#E8D5B3",
      paddingVertical: 8,
    },
    sheetItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    sheetIconWrap: {
      width: 28,
      height: 28,
      borderRadius: 9,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? "#3A2F24" : "#F5E4C7",
      marginRight: 10,
    },
    sheetLabel: {
      color: palette.text,
      fontSize: 14,
      fontWeight: "700",
    },
  });
