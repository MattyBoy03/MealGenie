// context/ThemeContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Appearance } from 'react-native';

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: (value: boolean) => void;
  setDarkMode: (value: boolean) => void;
};

// Add type for ThemeProvider props to accept `initialDarkMode`
type ThemeProviderProps = {
  children: ReactNode;
  initialDarkMode?: boolean;
};

export const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
  setDarkMode: () => {},
});

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initialDarkMode = false }) => {
  const colorScheme = Appearance.getColorScheme();
  const [darkMode, setDarkModeState] = useState(initialDarkMode || colorScheme === 'dark');

  useEffect(() => {
    // Update darkMode based on system color scheme if no initial value is provided
    if (initialDarkMode === undefined) {
      setDarkModeState(colorScheme === 'dark');
    }
  }, [colorScheme, initialDarkMode]);

  const toggleDarkMode = (value: boolean) => {
    setDarkModeState(value);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, setDarkMode: setDarkModeState }}>
      {children}
    </ThemeContext.Provider>
  );
};
