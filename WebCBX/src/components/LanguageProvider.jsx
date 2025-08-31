import React, { useState, useEffect } from 'react';
import { LanguageContext, translations } from '../contexts/LanguageContext';

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('vi');

  useEffect(() => {
    // Load saved language from localStorage
    const savedLang = localStorage.getItem('lang') || 'vi';
    setLanguage(savedLang);
  }, []);

  const switchLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;