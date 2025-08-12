import { filter } from 'leo-profanity';

// Фильтрация нецензурных слов
export const filterProfanity = (text) => {
  if (!text) return text;
  return filter.clean(text, '*');
};

// Проверка наличия нецензурных слов
export const hasProfanity = (text) => {
  if (!text) return false;
  return filter.check(text);
};
