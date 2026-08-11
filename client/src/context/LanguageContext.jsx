import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../i18n/en';
import ta from '../i18n/ta';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('smartcare_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('smartcare_lang', lang);
  }, [lang]);

  const dictionary = lang === 'ta' ? ta : en;

  const t = (key) => {
    return dictionary[key] || en[key] || key;
  };

  const toggleLanguage = (newLang) => {
    setLang(newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
