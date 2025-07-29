import React, { createContext, useContext } from 'react';
import { useMantineColorScheme } from '@mantine/core';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Stable theme data that doesn't change structure
  const themeData = {
    isDark,
    colors: {
      background: isDark ? '#121212' : '#f9fafb',          // Deeper dark, cleaner light
      surface: isDark ? '#1e1e1e' : '#ffffff',             // Smooth contrast
      text: isDark ? '#e5e7eb' : '#111827',                // Softer white / darker gray
      textSecondary: isDark ? '#9ca3af' : '#6b7280',       // Subtle tone
      primary: '#6366f1',                                  // Indigo-500 for better vibe
      border: isDark ? '#2c2c2c' : '#e5e7eb',              // Subtle edge separation
      particle: isDark ? '#2d2d2d' : '#f3f4f6',            // Visual detail background
      shadow: isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.05)', // Subtle depth
      gradient: {
        from: isDark ? '#4f46e5' : '#6366f1',              // Gradient shift to purple-indigo
        to: isDark ? '#818cf8' : '#4f46e5'
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ themeData, mounted: true }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};