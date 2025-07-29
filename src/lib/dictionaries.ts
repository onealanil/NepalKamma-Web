import 'server-only';

const dictionaries = {
  en: () => import('../dictionaries/en.json').then((module) => module.default),
  ne: () => import('../dictionaries/ne.json').then((module) => module.default),
};

export const getDictionary = async (locale: 'en' | 'ne') => {
  const validLocale = locale in dictionaries ? locale : 'en';
  return dictionaries[validLocale]();
};
