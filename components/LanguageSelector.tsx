'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, Copy, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang as any);
    setIsOpen(false); // Close dropdown after selection
  };

  const copyLink = async (lang: string) => {
    try {
      // Get current URL and append language parameter
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', lang);
        
        await navigator.clipboard.writeText(url.toString());
        
        // Set copy status for this language
        setCopyStatus({ ...copyStatus, [lang]: true });
        
        // Reset after 2 seconds
        setTimeout(() => {
          setCopyStatus({ ...copyStatus, [lang]: false });
        }, 2000);
        
        // Close dropdown after copying
        setIsOpen(false);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        className="p-2 rounded-full bg-brand-light-gray dark:bg-[#222222] text-brand-light-accent dark:text-white hover:bg-gray-300 dark:hover:bg-[#333333] transition-colors duration-300 flex items-center"
      >
        <Globe size={20} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white dark:bg-[#222222] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {languages.map((lang) => (
              <div key={lang.code} className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-[#333333] last:border-0">
                <button
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`text-sm ${
                    language === lang.code
                      ? 'font-medium text-brand-light-accent dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:text-brand-light-accent dark:hover:text-white'
                  }`}
                >
                  {lang.name}
                </button>
                
                <button 
                  onClick={() => copyLink(lang.code)}
                  className="ml-2 p-1 text-gray-500 dark:text-gray-400 hover:text-brand-light-accent dark:hover:text-white"
                  title="Copy link with this language"
                >
                  {copyStatus[lang.code] ? (
                    <Check size={14} className="text-green-500" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
