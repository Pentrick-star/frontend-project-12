import filter from 'leo-profanity';

filter.add(filter.getDictionary('en'));
filter.add(filter.getDictionary('ru'));

export const filterProfanity = (text) => {
  if (!text) return text;
  return filter.clean(text);
};

export const isProfane = (text) => {
  if (!text) return false;
  return filter.check(text);
};