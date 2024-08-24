'use client';
import { createContext, useState, useContext, useEffect, useRef } from 'react';
import { ReactNode } from 'react';

interface GlobalContextType {
  colorMode: string;
  toggleColorMode: () => void;
  scrollPos: number;
  setCurrScrollPos: (arg0: number) => void;
}

const GlobalContext = createContext<GlobalContextType>({
  colorMode: 'dark',
  toggleColorMode: () => {},
  scrollPos: 0,
  setCurrScrollPos: () => {},
});

export const GlobalContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [colorMode, setColorMode] = useState('dark');
  const [scrollPos, setScrollPos] = useState(0);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setColorMode(e.matches ? 'dark' : 'light');
    };

    // Set initial theme
    setColorMode(mediaQuery.matches ? 'dark' : 'light');

    // Listen for changes to the prefers-color-scheme media query
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  const toggleColorMode = () => {
    console.log('toggle');
    setColorMode((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  const setCurrScrollPos = (input: number) => {
    setScrollPos(input);
  };
  return (
    <GlobalContext.Provider
      value={{ colorMode, toggleColorMode, scrollPos, setCurrScrollPos }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
