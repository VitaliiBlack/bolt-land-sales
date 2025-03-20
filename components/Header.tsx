'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Tag, Search, Menu, X, User, LogOut, LayoutDashboard, ChevronDown, ListFilter } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import { useAuth } from '@/context/AuthContext';
import { useCategory } from '@/context/CategoryContext';
import { CategoryType } from '@/types';

export default function Header() {
  const { t } = useTranslation();
  const { currentUser, isAdmin, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { activeCategory, setActiveCategory } = useCategory();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  
  // Hide category filter on non-homepage paths
  const showCategoryFilter = pathname === '/';

  // Check if mobile on mount and resize
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768);
      
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
        if (window.innerWidth >= 768) {
          setIsMobileMenuOpen(false);
        }
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scrolling when menu is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);
  
  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);
  
  // Close category menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
        setIsCategoryMenuOpen(false);
      }
    };
    
    if (isCategoryMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCategoryMenuOpen]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would implement search functionality here
    console.log('Searching for:', searchTerm);
    // Reset search after submission
    setSearchTerm('');
  };

  const categories = [
    { label: 'Все', value: 'all' as CategoryType },
    { label: 'Игры', value: 'games' as CategoryType },
    { label: 'Еда', value: 'food' as CategoryType },
    { label: 'Электроника', value: 'electronics' as CategoryType },
    { label: 'Одежда', value: 'products' as CategoryType },
    { label: 'Другое', value: 'other' as CategoryType },
  ];
  
  const getCategoryLabel = (value: CategoryType): string => {
    const category = categories.find(cat => cat.value === value);
    return category ? category.label : 'Категория';
  };

  return (
    <header className="bg-brand-light-white dark:bg-black border-b border-gray-200 dark:border-[#333333] transition-colors duration-300 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Tag size={24} className="text-brand-light-accent dark:text-white mr-2" />
            <span className="text-xl font-bold text-brand-light-accent dark:text-white">DealFinder</span>
          </Link>
          
          {/* Center section - search and category dropdown (desktop only) */}
          {!isMobile && (
            <div className="flex-1 flex items-center justify-center gap-3 mx-6">
              {/* Search input */}
              <div className="w-full max-w-md">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t('header.search')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full py-1.5 pl-8 pr-3 bg-gray-100 dark:bg-[#222222] dark:text-white rounded-full text-sm focus:outline-none"
                    />
                    <Search className="absolute left-2.5 top-2 text-gray-500 dark:text-gray-400" size={16} />
                  </div>
                </form>
              </div>
              
              {/* Category dropdown (desktop) */}
              {showCategoryFilter && (
                <div className="relative" ref={categoryMenuRef}>
                  <button
                    onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                    className="flex items-center gap-1 py-1.5 px-3 bg-gray-100 dark:bg-[#222222] rounded-full text-sm text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-[#333333] transition-colors"
                  >
                    <ListFilter size={16} />
                    <span className="mx-1">{getCategoryLabel(activeCategory)}</span>
                    <ChevronDown size={16} className={`transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isCategoryMenuOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-[#222222] rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-10">
                      <div className="p-1">
                        {categories.map((category) => (
                          <button
                            key={category.value}
                            onClick={() => {
                              setActiveCategory(category.value);
                              setIsCategoryMenuOpen(false);
                            }}
                            className={`flex items-center w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                              activeCategory === category.value
                                ? 'bg-brand-light-accent dark:bg-brand-dark-blue text-white'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333333]'
                            }`}
                          >
                            {category.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {/* Desktop user dropdown menu */}
            {!isMobile && (
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1 py-1.5 px-3 bg-gray-100 dark:bg-[#222222] rounded-full text-sm text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-[#333333] transition-colors"
                >
                  <User size={16} />
                  <ChevronDown size={16} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#222222] rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-10">
                    <div className="p-2">
                      {/* Theme toggle */}
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-[#333333] rounded-md">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Тема</span>
                        <ThemeToggle />
                      </div>
                      
                      {/* Language selector */}
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-[#333333] rounded-md">
                        <span className="text-sm text-gray-700 dark:text-gray-300">Язык</span>
                        <LanguageSelector />
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                      {currentUser ? (
                        <>
                          {isAdmin && (
                            <Link
                              href="/admin"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2 p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333333] rounded-md"
                            >
                              <LayoutDashboard size={16} />
                              {t('header.admin')}
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 p-2 w-full text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333333] rounded-md"
                          >
                            <LogOut size={16} />
                            {t('header.logout')}
                          </button>
                        </>
                      ) : (
                        <Link
                          href="/admin/login"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333333] rounded-md"
                        >
                          <User size={16} />
                          {t('header.login')}
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Mobile menu button */}
            {isMobile && (
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1 text-brand-light-accent dark:text-white"
                aria-label="Toggle menu"
              >
                <Menu size={24} />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div 
            ref={mobileMenuRef}
            className="w-4/5 max-w-sm bg-white dark:bg-[#111111] h-full overflow-y-auto p-4 flex flex-col"
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-medium text-brand-light-accent dark:text-white">Меню</h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 dark:text-gray-400">
                <X size={20} />
              </button>
            </div>
            
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('header.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-2 pl-9 pr-3 bg-gray-100 dark:bg-[#222222] dark:text-white rounded-lg text-sm focus:outline-none"
                />
                <Search className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-400" size={16} />
              </div>
            </form>
            
            {/* Mobile category filter */}
            {showCategoryFilter && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                  <ListFilter size={14} className="mr-1" /> Категории
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => {
                        setActiveCategory(category.value);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-3 py-2 text-sm rounded-md text-center transition-colors ${
                        activeCategory === category.value
                          ? 'bg-brand-light-accent dark:bg-brand-dark-blue text-white'
                          : 'bg-gray-100 dark:bg-[#222222] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333333]'
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Settings section */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Настройки</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-[#222222] rounded-md">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Тема</span>
                  <ThemeToggle />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-[#222222] rounded-md">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Язык</span>
                  <LanguageSelector />
                </div>
              </div>
            </div>
            
            {/* Account section */}
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
              {currentUser ? (
                <div className="space-y-2">
                  {isAdmin && (
                    <Link 
                      href="/admin" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 p-3 w-full text-left bg-gray-100 dark:bg-[#222222] text-gray-800 dark:text-white rounded-md"
                    >
                      <LayoutDashboard size={18} />
                      {t('header.admin')}
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 p-3 w-full text-left bg-gray-100 dark:bg-[#222222] text-gray-800 dark:text-white rounded-md"
                  >
                    <LogOut size={18} />
                    {t('header.logout')}
                  </button>
                </div>
              ) : (
                <Link 
                  href="/admin/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-3 w-full text-left bg-gray-100 dark:bg-[#222222] text-gray-800 dark:text-white rounded-md"
                >
                  <User size={18} />
                  {t('header.login')}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
