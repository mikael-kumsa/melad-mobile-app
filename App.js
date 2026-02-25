import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Tabs from "./src/navigation/Tabs";
import { LanguageProvider } from "./src/i18n/LanguageProvider";
import { ThemeProvider, useAppTheme } from "./src/theme/ThemeProvider";

function AppShell() {
  const { palette, isDark } = useAppTheme();

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: palette.canvas,
      card: palette.surface,
      text: palette.text,
      border: palette.tabBorder,
      primary: palette.accent,
    },
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
        <StatusBar style={isDark ? "light" : "dark"} translucent={false} backgroundColor={palette.canvas} />
        <Tabs />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppShell />
      </ThemeProvider>
    </LanguageProvider>
  );
}
