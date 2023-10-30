import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
    const [darkMode, setDarkMode] = useState(() => {
      const existingPreference = localStorage.getItem('dark-mode');
      return existingPreference ? JSON.parse(existingPreference) : false;
    });
  
    useEffect(() => {
      localStorage.setItem('dark-mode', JSON.stringify(darkMode));
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, [darkMode]);
  return (
    <button className="text-black  dark:text-white"onClick={() => setDarkMode(!darkMode)}>
      {darkMode ? 'Light' : 'Dark'} Mode
    </button>
  );
}

export {ThemeToggle};