import { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import en from "./translations/en";
import am from "./translations/am";
import om from "./translations/om";

const STORAGE_KEY = "@melad_language";
const dictionaries = { en, am, om };
const defaultLanguage = "en";

const LanguageContext = createContext({
  language: defaultLanguage,
  setLanguage: () => {},
  t: () => "",
});

function getValueByPath(object, path) {
  return path.split(".").reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), object);
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(defaultLanguage);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored && dictionaries[stored]) {
          setLanguageState(stored);
        }
      } catch (error) {
        // If storage fails, keep default language.
      }
    };
    loadLanguage();
  }, []);

  const setLanguage = async (nextLanguage) => {
    if (!dictionaries[nextLanguage]) {
      return;
    }
    setLanguageState(nextLanguage);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, nextLanguage);
    } catch (error) {
      // Ignore persistence failures and keep in-memory state.
    }
  };

  const t = (path, fallback = "") => {
    const scoped = dictionaries[language] || dictionaries[defaultLanguage];
    const value = getValueByPath(scoped, path);
    if (value !== undefined) {
      return value;
    }
    const defaultValue = getValueByPath(dictionaries[defaultLanguage], path);
    return defaultValue !== undefined ? defaultValue : fallback;
  };

  const contextValue = useMemo(() => ({ language, setLanguage, t }), [language]);

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
