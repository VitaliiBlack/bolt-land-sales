'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, AlertCircle, Loader } from 'lucide-react';
import { Deal } from '@/types';
import { useDealStore } from '@/store/dealStore';

export default function AdminPage() {
  const { t } = useTranslation();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  
  const fetchDeals = useDealStore(state => state.fetchDeals);
  const deleteDeal = useDealStore(state => state.deleteDeal);
  
  useEffect(() => {
    const loadDeals = async () => {
      setLoading(true);
      try {
        const allDeals = await fetchDeals();
        setDeals(allDeals);
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDeals();
  }, [fetchDeals]);
  
  const handleDelete = (id: string) => {
    setIsDeleting(id);
  };
  
  const confirmDelete = async (id: string) => {
    try {
      const success = await deleteDeal(id);
      
      if (success) {
        setDeals(deals.filter(deal => deal.id !== id));
        setSuccessMessage(t('admin.dealDeleted'));
        
        // Clear message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error deleting deal:', error);
    }
    
    setIsDeleting(null);
  };
  
  const cancelDelete = () => {
    setIsDeleting(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-brand-light-accent dark:text-white">
          {t('admin.dashboard')}
        </h1>
        
        <Link
          href="/admin/deals/create"
          className="px-4 py-2 bg-brand-light-accent dark:bg-brand-dark-blue hover:bg-gray-800 dark:hover:bg-blue-700 text-white rounded-md flex items-center"
        >
          <Plus size={18} className="mr-2" />
          {t('admin.createDeal')}
        </Link>
      </div>
      
      {successMessage && (
        <div className="mb-6 p-3 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded flex items-center">
          <AlertCircle size={18} className="mr-2" />
          {successMessage}
        </div>
      )}
      
      {loading ? (
        <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#333333] rounded-lg p-8 flex justify-center items-center">
          <Loader size={24} className="animate-spin text-brand-light-accent dark:text-blue-500 mr-2" />
          <span className="text-gray-600 dark:text-gray-400">Loading deals...</span>
        </div>
      ) : (
        <div className="bg-white dark:bg-brand-dark-gray border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.title')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.category')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.price')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.discount')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {deals.map(deal => (
                  <tr key={deal.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {deal.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {t(`categories.${deal.category}`)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      ${deal.discountedPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {deal.discountPercentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {isDeleting === deal.id ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600 dark:text-red-400">{t('admin.confirmDelete')}</span>
                          <button
                            onClick={() => confirmDelete(deal.id)}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs"
                          >
                            {t('admin.yes')}
                          </button>
                          <button
                            onClick={cancelDelete}
                            className="px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md text-xs"
                          >
                            {t('admin.no')}
                          </button>
                        </div>
                      ) : (
                        <>
                          <Link
                            href={`/admin/deals/edit/${deal.id}`}
                            className="text-brand-light-accent dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(deal.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                
                {deals.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No deals found. Create your first deal.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
