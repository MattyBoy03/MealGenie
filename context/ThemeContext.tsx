// context/ThemeContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: (value: boolean) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  darkMode: false, // default to light mode until we get the user's preference
  toggleDarkMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode; initialDarkMode: boolean }> = ({
  children,
  initialDarkMode,
}) => {
  const [darkMode, setDarkMode] = useState(initialDarkMode);

  useEffect(() => {
    if (initialDarkMode !== undefined) {
      setDarkMode(initialDarkMode);
    }
  }, [initialDarkMode]);

  const toggleDarkMode = (value: boolean) => {
    setDarkMode(value);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
