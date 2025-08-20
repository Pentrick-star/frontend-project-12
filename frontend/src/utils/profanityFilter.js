import { filter } from 'leo-profanity';

export const filterProfanity = (text) => {
  return filter(text);
};

export const isProfane = (text) => {
  return filter.list().some(word => 
    text.toLowerCase().includes(word.toLowerCase())
  );
};
