'use client';

import React from 'react';
import { Tag, Heart } from 'lucide-react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-light-white dark:bg-black border-t border-gray-200 dark:border-[#333333] mt-12 transition-colors duration-300">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <Link href="/" className="flex items-center mb-4 md:mb-0">
            <Tag size={24} className="text-brand-light-accent dark:text-white mr-2" />
            <span className="text-xl font-bold text-brand-light-accent dark:text-white">DealFinder</span>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-brand-light-accent dark:hover:text-white transition-colors duration-300">Home</Link>
            <Link href="/about" className="hover:text-brand-light-accent dark:hover:text-white transition-colors duration-300">About</Link>
            <Link href="/contact" className="hover:text-brand-light-accent dark:hover:text-white transition-colors duration-300">Contact</Link>
            <Link href="/privacy" className="hover:text-brand-light-accent dark:hover:text-white transition-colors duration-300">Privacy</Link>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-[#333333] text-center text-gray-500 dark:text-gray-400 text-sm">
          <p className="flex items-center justify-center gap-1">
            Made with <Heart size={16} className="text-red-500" /> by DealFinder Team
          </p>
          <p className="mt-2">© {new Date().getFullYear()} DealFinder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
