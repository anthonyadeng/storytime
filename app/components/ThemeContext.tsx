'use client';
import { createContext, useState, useContext, useEffect, useRef } from 'react';
import { ReactNode } from 'react';

interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
  scrollPos: number;
  setCurrScrollPos: (arg0: number) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  scrollPos: 0,
  setCurrScrollPos: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState('dark');
  const [scrollPos, setScrollPos] = useState(0);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    // Set initial theme
    setTheme(mediaQuery.matches ? 'dark' : 'light');

    // Listen for changes to the prefers-color-scheme media query
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  const toggleTheme = () => {
    console.log('toggle');
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  const setCurrScrollPos = (input: number) => {
    setScrollPos(input);
  };
  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, scrollPos, setCurrScrollPos }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
