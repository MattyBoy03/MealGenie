import React, { createContext, useState } from 'react';

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: (value: boolean) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode; initialDarkMode: boolean }> = ({
  children,
  initialDarkMode,
}) => {
  const [darkMode, setDarkMode] = useState(initialDarkMode);

  const toggleDarkMode = (value: boolean) => {
    setDarkMode(value);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
