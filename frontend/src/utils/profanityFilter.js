import { filter } from 'leo-profanity';

// Фильтрация нецензурных слов
export const filterProfanity = (text) => {
  if (!text) return text;
  try {
    return filter.clean(text, '*');
  } catch (error) {
    console.warn('Profanity filter error:', error);
    return text; // Возвращаем исходный текст при ошибке
  }
};

// Проверка наличия нецензурных слов
export const hasProfanity = (text) => {
  if (!text) return false;
  try {
    return filter.check(text);
  } catch (error) {
    console.warn('Profanity check error:', error);
    return false; // Возвращаем false при ошибке
  }
};
