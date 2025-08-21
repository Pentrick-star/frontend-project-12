// Временно отключаем фильтрацию нецензурных слов из-за проблем с библиотекой
export const filterProfanity = (text) => {
  return text; // Возвращаем исходный текст без фильтрации
};

export const isProfane = () => {
  return false; // Всегда возвращаем false
};
