'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import { Deal, DealMedia, Translation } from '@/types';
import FileUploader from './FileUploader';
import { X, Plus, Eye } from 'lucide-react';
import Link from 'next/link';

interface DealFormProps {
  initialData?: Partial<Deal>;
  onSubmit: (data: Partial<Deal>) => void;
  onPreview?: (data: Partial<Deal>) => void;
  isEditing?: boolean;
  previewId?: string;
}

const DealForm: React.FC<DealFormProps> = ({ 
  initialData = {}, 
  onSubmit,
  onPreview,
  isEditing = false,
  previewId
}) => {
  const { t } = useTranslation();
  const { language, languages } = useLanguage();
  
  const [formData, setFormData] = useState<Partial<Deal>>({
    title: '',
    description: '',
    originalPrice: 0,
    discountedPrice: 0,
    discountPercentage: 0,
    imageUrl: '',
    category: 'other',
    source: '',
    link: '',
    date: new Date().toISOString().split('T')[0],
    translations: {},
    media: [],
    ...initialData
  });
  
  const [activeTranslations, setActiveTranslations] = useState<string[]>(
    Object.keys(initialData.translations || {})
  );
  
  const [currentLanguage, setCurrentLanguage] = useState<string>(language);

  // Update form fields when current language changes
  useEffect(() => {
    if (currentLanguage !== language && currentLanguage !== 'none') {
      // If switching to a non-primary language, store current values as translations
      if (formData.title || formData.description) {
        const translationData = {
          title: formData.title || '',
          description: formData.description || ''
        };
        
        setFormData(prev => ({
          ...prev,
          translations: {
            ...prev.translations,
            [language]: translationData
          }
        }));
        
        if (!activeTranslations.includes(language) && language !== currentLanguage) {
          setActiveTranslations([...activeTranslations, language]);
        }
      }
      
      // If switching to a new language that's not in translations yet, clear fields
      if (!activeTranslations.includes(currentLanguage) && currentLanguage !== 'none') {
        setFormData(prev => ({
          ...prev,
          title: '',
          description: ''
        }));
      }
      // If switching to an existing translation, load those values
      else if (currentLanguage !== 'none' && formData.translations && formData.translations[currentLanguage]) {
        setFormData(prev => ({
          ...prev,
          title: prev.translations?.[currentLanguage]?.title || '',
          description: prev.translations?.[currentLanguage]?.description || ''
        }));
      }
      // If switching to primary language, load the main values
      else if (currentLanguage === language) {
        setFormData(prev => ({
          ...prev,
          title: initialData.title || '',
          description: initialData.description || ''
        }));
      }
    }
  }, [currentLanguage, language, activeTranslations, formData.translations, initialData.title, initialData.description]);
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'originalPrice' || name === 'discountedPrice') {
      const originalPrice = name === 'originalPrice' 
        ? parseFloat(value) 
        : formData.originalPrice as number;
        
      const discountedPrice = name === 'discountedPrice' 
        ? parseFloat(value) 
        : formData.discountedPrice as number;
      
      // Calculate discount percentage
      const discountPercentage = originalPrice > 0 
        ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) 
        : 0;
      
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value),
        discountPercentage
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleTranslationChange = (
    lang: string,
    field: keyof Translation,
    value: string
  ) => {
    // If we're editing the current language input fields
    if (lang === currentLanguage) {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      // Otherwise we're editing a translation in the translations list
      setFormData(prev => ({
        ...prev,
        translations: {
          ...prev.translations,
          [lang]: {
            ...(prev.translations?.[lang] || {}),
            [field]: value
          }
        }
      }));
    }
  };
  
  const addTranslation = (langCode: string) => {
    if (!activeTranslations.includes(langCode)) {
      setActiveTranslations([...activeTranslations, langCode]);
      
      // Initialize empty translation
      setFormData(prev => ({
        ...prev,
        translations: {
          ...prev.translations,
          [langCode]: { title: '', description: '' }
        }
      }));
    }
    
    // Switch to this language
    setCurrentLanguage(langCode);
  };
  
  const removeTranslation = (langCode: string) => {
    setActiveTranslations(activeTranslations.filter(l => l !== langCode));
    
    // Remove translation from formData
    const updatedTranslations = { ...formData.translations };
    if (updatedTranslations && langCode in updatedTranslations) {
      delete updatedTranslations[langCode];
      
      setFormData(prev => ({
        ...prev,
        translations: updatedTranslations
      }));
    }
    
    // If we were on this language, switch to primary
    if (currentLanguage === langCode) {
      setCurrentLanguage(language);
    }
  };
  
  const handleMediaUpdate = (media: DealMedia[]) => {
    // In a real app, you would upload these files to storage and get URLs back
    // First image is primary by default
    const primaryMedia = media.find(m => m.isPrimary && m.type === 'image');
    
    setFormData(prev => ({
      ...prev,
      media,
      imageUrl: primaryMedia?.url || prev.imageUrl
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Make sure current edits are saved to translations if needed
    const finalFormData = { ...formData };
    
    // If we're currently editing a translation language, save those changes
    if (currentLanguage !== language && currentLanguage !== 'none' && (formData.title || formData.description)) {
      finalFormData.translations = {
        ...finalFormData.translations,
        [currentLanguage]: {
          title: formData.title || '',
          description: formData.description || ''
        }
      };
    }
    
    onSubmit(finalFormData);
  };
  
  const handlePreview = () => {
    if (onPreview) {
      // Same logic as handleSubmit but for preview
      const previewData = { ...formData };
      
      if (currentLanguage !== language && currentLanguage !== 'none' && (formData.title || formData.description)) {
        previewData.translations = {
          ...previewData.translations,
          [currentLanguage]: {
            title: formData.title || '',
            description: formData.description || ''
          }
        };
      }
      
      onPreview(previewData);
    }
  };
  
  // Get available languages (ones not already added to translations)
  const availableLanguages = languages.filter(
    lang => !activeTranslations.includes(lang.code) && lang.code !== language
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Language selector */}
      <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#333333] rounded-lg p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-medium text-brand-light-accent dark:text-white">
              {t('admin.mainLanguage')}: {languages.find(l => l.code === language)?.name}
            </h3>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <label className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('admin.currentLanguage')}:
              </label>
              <select
                value={currentLanguage}
                onChange={(e) => setCurrentLanguage(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-[#222222] text-gray-900 dark:text-white"
              >
                <option value={language}>{languages.find(l => l.code === language)?.name} ({t('admin.primary')})</option>
                {activeTranslations.map(langCode => (
                  <option key={langCode} value={langCode}>
                    {languages.find(l => l.code === langCode)?.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              {onPreview && (
                <button
                  type="button"
                  onClick={handlePreview}
                  className="flex items-center px-4 py-2 bg-brand-light-gray dark:bg-[#333333] hover:bg-gray-300 dark:hover:bg-[#444444] text-gray-800 dark:text-white rounded-md"
                >
                  <Eye size={16} className="mr-2" />
                  {t('admin.preview')}
                </button>
              )}
              
              {previewId && (
                <Link
                  href={`/deal/${previewId}`}
                  target="_blank"
                  className="flex items-center px-4 py-2 bg-brand-light-gray dark:bg-[#333333] hover:bg-gray-300 dark:hover:bg-[#444444] text-gray-800 dark:text-white rounded-md"
                >
                  <Eye size={16} className="mr-2" />
                  {t('admin.view')}
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Add language buttons */}
        {availableLanguages.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {availableLanguages.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => addTranslation(lang.code)}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#222222] hover:bg-gray-50 dark:hover:bg-[#333333]"
                >
                  <Plus size={16} className="mr-1" />
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Current language fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('admin.title')}
            </label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleInputChange}
              required={currentLanguage === language} // Only require for primary language
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-[#222222] text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('admin.description')}
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              required={currentLanguage === language} // Only require for primary language
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-[#222222] text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>
      
      {/* Media Uploader */}
      <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#333333] rounded-lg p-6">
        <h3 className="text-lg font-medium text-brand-light-accent dark:text-white mb-4">
          {t('admin.uploadImage')} / {t('admin.uploadVideo')}
        </h3>
        
        <FileUploader 
          onFilesSelected={handleMediaUpdate}
          existingMedia={formData.media}
        />
        
        {/* Fallback image URL field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('admin.imageUrl')} ({t('admin.backupOnly')})
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-[#222222] text-gray-900 dark:text-white"
            placeholder="https://example.com/image.jpg"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t('admin.imageUrlNote')}
          </p>
        </div>
      </div>
      
      {/* Deal details */}
      <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#333333] rounded-lg p-6">
        <h3 className="text-lg font-medium text-brand-light-accent dark:text-white mb-4">
          {t('admin.dealDetails')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('admin.originalPrice')}
            </label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-[#222222] text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('admin.discountedPrice')}
            </label>
            <input
              type="number"
              name="discountedPrice"
              value={formData.discountedPrice}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-[#222222] text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('admin.discountPercentage')}
            </label>
            <input
              type="number"
              name="discountPercentage"
              value={formData.discountPercentage}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-[#f5f5f5] dark:bg-[#1a1a1a] text-gray-900 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t('admin.calculatedAutomatically')}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('admin.category')}
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-[#222222] text-gray-900 dark:text-white"
            >
              <option value="games">{t('categories.games')}</option>
              <option value="food">{t('categories.food')}</option>
              <option value="electronics">{t('categories.electronics')}</option>
              <option value="products">{t('categories.products')}</option>
              <option value="other">{t('categories.other')}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('admin.source')}
            </label>
            <input
              type="text"
              name="source"
              value={formData.source}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-[#222222] text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('admin.link')}
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-[#222222] text-gray-900 dark:text-white"
              placeholder="https://example.com/deal"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('admin.date')}
            </label>
            <input
              type="date"
              name="date"
              value={formData.date as string}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-[#222222] text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>
      
      {/* Submit buttons */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#222222] hover:bg-gray-50 dark:hover:bg-[#333333]"
        >
          {t('admin.cancel')}
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-brand-light-accent dark:bg-brand-dark-blue hover:bg-gray-800 dark:hover:bg-blue-700"
        >
          {isEditing ? t('admin.save') : t('admin.createDeal')}
        </button>
      </div>
    </form>
  );
};

export default DealForm;
