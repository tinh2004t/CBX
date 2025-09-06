import { createContext } from 'react';

// Import translation files
import viTranslations from '../data/translations/vi.json';
import enTranslations from '../data/translations/en.json';

export const LanguageContext = createContext();

export const translations = {
  vi: viTranslations,
  en: enTranslations
};