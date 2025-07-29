"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isChanging, setIsChanging] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const currentLocale = pathname.split('/')[1] || 'en';

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ne', name: 'नेपाली', flag: '🇳🇵' }
  ];

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  const changeLanguage = async (locale: string) => {
    if (locale === currentLocale) {
      setIsOpen(false);
      return;
    }

    setIsChanging(true);
    setIsOpen(false);
    
    const segments = pathname.split('/');
    segments[1] = locale;
    const newPath = segments.join('/') || `/${locale}`;
    
    router.push(newPath);
    
    setTimeout(() => setIsChanging(false), 500);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isChanging}
        className="flex items-center gap-2 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-primary/30 hover:text-primary transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <Globe className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-300" />
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="hidden sm:block">{currentLanguage.name}</span>
        {isChanging ? (
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 w-48 rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-primary/5 hover:text-primary ${
                  currentLocale === language.code 
                    ? 'bg-primary/10 text-primary border-r-2 border-primary' 
                    : 'text-gray-700'
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span>{language.name}</span>
                {currentLocale === language.code && (
                  <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
