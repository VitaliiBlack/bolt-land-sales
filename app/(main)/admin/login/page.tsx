'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      router.push('/admin');
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#333333] rounded-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-brand-light-gray dark:bg-[#222222]">
              <Lock className="h-8 w-8 text-brand-light-accent dark:text-white" />
            </div>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-brand-light-accent dark:text-white">
            {t('admin.signIn')}
          </h2>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded flex items-center">
            <AlertCircle size={18} className="mr-2" />
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('admin.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-[#222222] text-gray-900 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('admin.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-[#222222] text-gray-900 dark:text-white"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded-md text-white bg-brand-light-accent dark:bg-brand-dark-blue hover:bg-gray-800 dark:hover:bg-blue-700 font-medium transition-colors duration-300"
          >
            {loading ? 'Signing in...' : t('admin.signIn')}
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>For demo purposes, use any valid email and password (min 6 characters).</p>
          <p className="mt-1">Example: admin@example.com / password123</p>
        </div>
      </div>
    </div>
  );
}
