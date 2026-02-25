import { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { darkPalette, lightPalette } from "./colors";

const STORAGE_KEY = "@melad_theme_mode";

const ThemeContext = createContext({
  mode: "light",
  palette: lightPalette,
  isDark: false,
  toggleMode: () => {},
  setMode: async () => {},
});

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState("light");

  useEffect(() => {
    const loadMode = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === "dark" || saved === "light") {
          setModeState(saved);
        }
      } catch (error) {
        // keep default light mode
      }
    };
    loadMode();
  }, []);

  const setMode = async (nextMode) => {
    const safeMode = nextMode === "dark" ? "dark" : "light";
    setModeState(safeMode);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, safeMode);
    } catch (error) {
      // non-blocking persistence
    }
  };

  const toggleMode = async () => {
    await setMode(mode === "dark" ? "light" : "dark");
  };

  const value = useMemo(
    () => ({
      mode,
      palette: mode === "dark" ? darkPalette : lightPalette,
      isDark: mode === "dark",
      toggleMode,
      setMode,
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
