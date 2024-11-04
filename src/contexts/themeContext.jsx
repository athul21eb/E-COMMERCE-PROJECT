// ThemeContext.js
import React, { createContext, useState, useContext } from "react";


// theme.js
const lightTheme = {
  background: "#e0e0e0",        // Light warm background
  textPrimary: "#1e1e1e",       // Dark neutral for primary text
  textSecondary: "#6b7280",     // Muted gray for secondary text
  surface: "#ffffff",           // Pure white surface
  border: "#d1d5db",            // Light gray for borders
  accent: "#2563eb",            // Bright blue accent color
};

const darkTheme = {
  background: "#18181b",        // Dark gray-blue background
  textPrimary: "#e5e7eb",       // Light gray for primary text
  textSecondary: "#9ca3af",     // Muted gray for secondary text
  surface: "#27272a",           // Slightly lighter gray for surfaces
  border: "#3f3f46",            // Dark gray for borders
  accent: "#3b82f6",            // Bright blue accent color
};


const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const themeStyles = theme === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeStyles }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
