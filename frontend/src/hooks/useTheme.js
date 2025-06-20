import { useState, useEffect, useCallback } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then system preference, default to 'light'
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  const applyTheme = useCallback((newTheme) => {
    // Remove existing theme classes
    document.documentElement.classList.remove('light', 'dark');
    
    // Apply new theme
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.classList.add(newTheme);
    
    // Force a repaint to ensure immediate visual update
    document.documentElement.style.colorScheme = newTheme;
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: newTheme }));
    
    console.log('Theme applied:', newTheme);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log('Toggling theme from', theme, 'to', newTheme);
    
    // Apply theme immediately before state update
    applyTheme(newTheme);
    setTheme(newTheme);
    
    // Force re-render of the entire app by triggering a small DOM change
    const event = new Event('resize');
    window.dispatchEvent(event);
  }, [theme, applyTheme]);

  const setLightTheme = useCallback(() => {
    applyTheme('light');
    setTheme('light');
  }, [applyTheme]);
  
  const setDarkTheme = useCallback(() => {
    applyTheme('dark');
    setTheme('dark');
  }, [applyTheme]);

  return {
    theme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };
};