import 'server-only';

const dictionaries = {
  ne: () => import('../dictionaries/ne.json').then((module) => module.default),
  en: () => import('../dictionaries/en.json').then((module) => module.default),
};

export const getDictionary = async (locale: 'en' | 'ne') => {
  const validLocale = locale in dictionaries ? locale : 'ne';
  return dictionaries[validLocale]();
};
