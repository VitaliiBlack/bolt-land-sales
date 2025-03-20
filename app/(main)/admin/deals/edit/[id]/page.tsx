'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Loader } from 'lucide-react';
import { Deal } from '@/types';
import { useDealStore } from '@/store/dealStore';
import DealForm from '@/components/DealForm';

export default function AdminDealEdit() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deal, setDeal] = useState<Deal | null>(null);
  
  const getDealById = useDealStore(state => state.getDealById);
  const updateDeal = useDealStore(state => state.updateDeal);
  
  useEffect(() => {
    const loadDeal = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const dealData = await getDealById(id);
        
        if (dealData) {
          setDeal(dealData);
        } else {
          setError('Deal not found');
        }
      } catch (error) {
        setError('Error loading deal data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDeal();
  }, [id, getDealById]);
  
  const handleSubmit = async (dealData: Partial<Deal>) => {
    if (!id) return;
    
    try {
      setSaving(true);
      setError('');
      
      await updateDeal(id, dealData);
      router.push('/admin');
    } catch (err) {
      setError(t('admin.generalError'));
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <Loader size={24} className="animate-spin text-brand-light-accent dark:text-blue-500 mr-2" />
        <span className="text-gray-600 dark:text-gray-400">{t('admin.loading')}...</span>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded flex items-center">
          <AlertCircle size={18} className="mr-2" />
          {error || 'Deal not found'}
        </div>
        <button
          onClick={() => router.push('/admin')}
          className="mt-4 px-4 py-2 bg-brand-light-gray dark:bg-[#333333] hover:bg-gray-300 dark:hover:bg-[#444444] text-gray-800 dark:text-gray-200 rounded-md"
        >
          Back to Admin
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-brand-light-accent dark:text-white mb-6">
        {t('admin.editDeal')}: {deal.title}
      </h1>
      
      {error && (
        <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded flex items-center">
          <AlertCircle size={18} className="mr-2" />
          {error}
        </div>
      )}
      
      {saving && (
        <div className="mb-6 p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded flex items-center">
          <Loader size={18} className="mr-2 animate-spin" />
          {t('admin.saving')}...
        </div>
      )}
      
      <DealForm 
        initialData={deal} 
        onSubmit={handleSubmit} 
        isEditing 
        previewId={id}
      />
    </div>
  );
}
