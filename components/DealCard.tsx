'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Deal } from '@/types';
import { ExternalLink, Share2, Copy, Link as LinkIcon, Code, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface DealCardProps {
  deal: Deal;
}

const DealCard: React.FC<DealCardProps> = ({ deal }) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<{[key: string]: boolean}>({});
  const [imageError, setImageError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Update isMobile state on window resize
  useEffect(() => {
    // Check if window exists (for SSR)
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768);
      
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  // Get the absolute URLs for sharing
  const getDirectUrl = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/deal/${deal.id}`;
  };
  
  const getEmbedCode = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `<iframe src="${baseUrl}/deal/${deal.id}?embed=true" width="100%" height="400" frameborder="0"></iframe>`;
  };
  
  const getAdUrl = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/deal/${deal.id}?utm_source=googlead&utm_medium=cpc&utm_campaign=deals`;
  };
  
  const handleCopy = async (type: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopyStatus({...copyStatus, [type]: true});
      
      // Reset status after 2 seconds and close the dropdown
      setTimeout(() => {
        setCopyStatus((prev) => ({ ...prev, [type]: false }));
        if (!isMobile) {
          setIsShareOpen(false);
        }
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsShareOpen(false);
      }
    };
    
    if (isShareOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      
      // For mobile, prevent body scrolling when modal is open
      if (isMobile) {
        document.body.style.overflow = 'hidden';
      }
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isShareOpen, isMobile]);

  // Fallback image URL if the main one fails
  const fallbackImageUrl = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop';

  return (
    <div className="bg-brand-light-white dark:bg-[#111111] rounded-lg hover:shadow-md transition-all duration-300 flex flex-col h-full border border-transparent dark:border-[#333333]">
      <div className="relative h-card-img overflow-hidden rounded-t-lg">
        <img 
          src={imageError ? fallbackImageUrl : deal.imageUrl} 
          alt={deal.title} 
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
        <div className="absolute top-3 right-3">
          <span className="inline-block px-2 py-1 bg-discount-red text-white text-xs font-bold rounded">
            -{deal.discountPercentage}%
          </span>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-block px-2 py-1 text-xs text-white rounded-sm" 
            style={{ 
              backgroundColor: 
                deal.category === 'games' ? '#1a2b47' : // dark blue
                deal.category === 'food' ? '#383838' : // dark gray
                deal.category === 'electronics' ? '#252525' : // almost black
                deal.category === 'products' ? '#303030' : // dark gray
                '#222831' // default dark gray
            }}
          >
            {deal.category.charAt(0).toUpperCase() + deal.category.slice(1)}
          </span>
          
          <div className="relative">
            <button 
              ref={buttonRef}
              onClick={() => setIsShareOpen(!isShareOpen)}
              className="w-8 h-8 flex items-center justify-center bg-brand-light-gray dark:bg-[#333333] hover:bg-gray-300 dark:hover:bg-[#444444] text-gray-800 dark:text-gray-200 rounded-full text-sm transition duration-300 shadow-sm"
              aria-label="Поделиться"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
        
        <Link href={`/deal/${deal.id}`}>
          <h3 className="text-lg font-medium mb-1 text-brand-light-accent dark:text-white hover:underline transition-all duration-300 line-clamp-2">{deal.title}</h3>
        </Link>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{deal.description}</p>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-gray-400 dark:text-gray-500 line-through mr-2">${deal.originalPrice.toFixed(2)}</span>
              <span className="text-lg font-bold text-brand-light-accent dark:text-white">${deal.discountedPrice.toFixed(2)}</span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{deal.source}</span>
          </div>
          
          <div className="flex gap-2 items-center">
            <Link 
              href={`/deal/${deal.id}`}
              className="flex-1 py-2 px-3 bg-brand-light-gray dark:bg-[#333333] hover:bg-gray-300 dark:hover:bg-[#444444] text-gray-800 dark:text-gray-200 rounded-sm text-sm text-center transition duration-300"
            >
              Подробнее
            </Link>
            <a 
              href={deal.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center py-2 px-3 bg-brand-light-accent dark:bg-brand-dark-blue hover:bg-gray-800 dark:hover:bg-blue-800 text-white rounded-sm text-sm transition duration-300"
            >
              <span>Открыть</span>
              <ExternalLink size={14} className="ml-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Mobile fullscreen modal */}
      {isShareOpen && isMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div 
            ref={dropdownRef}
            className="w-full max-w-md bg-white dark:bg-[#222222] rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-lg text-brand-light-accent dark:text-white">
                Поделиться предложением
              </h4>
              <button 
                onClick={() => setIsShareOpen(false)}
                className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Direct link */}
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <LinkIcon size={14} className="mr-1" /> Прямая ссылка
                  </span>
                  <button 
                    onClick={() => handleCopy('direct', getDirectUrl())}
                    className="text-sm text-brand-light-accent dark:text-blue-400 hover:underline flex items-center"
                  >
                    {copyStatus.direct ? 'Скопировано!' : (
                      <>
                        <Copy size={14} className="mr-1" /> Копировать
                      </>
                    )}
                  </button>
                </div>
                <div className="flex">
                  <input 
                    type="text" 
                    value={getDirectUrl()}
                    readOnly
                    className="text-sm p-2 w-full bg-gray-100 dark:bg-[#333333] border border-gray-200 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>
              
              {/* Embed code */}
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <Code size={14} className="mr-1" /> Код для вставки
                  </span>
                  <button 
                    onClick={() => handleCopy('embed', getEmbedCode())}
                    className="text-sm text-brand-light-accent dark:text-blue-400 hover:underline flex items-center"
                  >
                    {copyStatus.embed ? 'Скопировано!' : (
                      <>
                        <Copy size={14} className="mr-1" /> Копировать
                      </>
                    )}
                  </button>
                </div>
                <div className="flex">
                  <textarea 
                    value={getEmbedCode()}
                    readOnly
                    rows={3}
                    className="text-sm p-2 w-full bg-gray-100 dark:bg-[#333333] border border-gray-200 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>
              
              {/* Ad link */}
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <LinkIcon size={14} className="mr-1" /> Рекламная ссылка
                  </span>
                  <button 
                    onClick={() => handleCopy('ad', getAdUrl())}
                    className="text-sm text-brand-light-accent dark:text-blue-400 hover:underline flex items-center"
                  >
                    {copyStatus.ad ? 'Скопировано!' : (
                      <>
                        <Copy size={14} className="mr-1" /> Копировать
                      </>
                    )}
                  </button>
                </div>
                <div className="flex">
                  <input 
                    type="text" 
                    value={getAdUrl()}
                    readOnly
                    className="text-sm p-2 w-full bg-gray-100 dark:bg-[#333333] border border-gray-200 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop dropdown */}
      {isShareOpen && !isMobile && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 shadow-lg"
          style={{
            top: buttonRef.current ? buttonRef.current.getBoundingClientRect().bottom + window.scrollY + 5 : 0,
            right: buttonRef.current ? document.body.clientWidth - (buttonRef.current.getBoundingClientRect().right + window.scrollX) : 0,
            width: '272px',
            maxWidth: '90vw',
          }}
        >
          <div className="bg-white dark:bg-[#222222] rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-3">
              <h4 className="font-medium text-brand-light-accent dark:text-white mb-2">Поделиться предложением</h4>
              
              <div className="space-y-3">
                {/* Direct link */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                      <LinkIcon size={12} className="mr-1" /> Прямая ссылка
                    </span>
                    <button 
                      onClick={() => handleCopy('direct', getDirectUrl())}
                      className="text-xs text-brand-light-accent dark:text-blue-400 hover:underline flex items-center"
                    >
                      {copyStatus.direct ? 'Скопировано!' : (
                        <>
                          <Copy size={12} className="mr-1" /> Копировать
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex">
                    <input 
                      type="text" 
                      value={getDirectUrl()}
                      readOnly
                      className="text-xs p-2 w-full bg-gray-100 dark:bg-[#333333] border border-gray-200 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200"
                    />
                  </div>
                </div>
                
                {/* Embed code */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                      <Code size={12} className="mr-1" /> Код для вставки
                    </span>
                    <button 
                      onClick={() => handleCopy('embed', getEmbedCode())}
                      className="text-xs text-brand-light-accent dark:text-blue-400 hover:underline flex items-center"
                    >
                      {copyStatus.embed ? 'Скопировано!' : (
                        <>
                          <Copy size={12} className="mr-1" /> Копировать
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex">
                    <textarea 
                      value={getEmbedCode()}
                      readOnly
                      rows={2}
                      className="text-xs p-2 w-full bg-gray-100 dark:bg-[#333333] border border-gray-200 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200"
                    />
                  </div>
                </div>
                
                {/* Ad link */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                      <LinkIcon size={12} className="mr-1" /> Рекламная ссылка
                    </span>
                    <button 
                      onClick={() => handleCopy('ad', getAdUrl())}
                      className="text-xs text-brand-light-accent dark:text-blue-400 hover:underline flex items-center"
                    >
                      {copyStatus.ad ? 'Скопировано!' : (
                        <>
                          <Copy size={12} className="mr-1" /> Копировать
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex">
                    <input 
                      type="text" 
                      value={getAdUrl()}
                      readOnly
                      className="text-xs p-2 w-full bg-gray-100 dark:bg-[#333333] border border-gray-200 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealCard;
