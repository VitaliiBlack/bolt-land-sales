import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDeals } from '@/store/dealStore';
import { Deal } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export default function DealPage() {
  const { id } = useParams<{ id: string }>();
  const { getDeal } = useDeals();
  const [deal, setDeal] = useState<Deal | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    if (id) {
      const dealData = getDeal(id);
      setDeal(dealData);
    }
  }, [id, getDeal]);

  if (!deal) {
    return <div className="container mx-auto px-4 py-8">Deal not found</div>;
  }

  const translation = deal.translations?.[language] || {
    title: deal.title,
    description: deal.description
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{translation.title}</h1>
        <img 
          src={deal.imageUrl} 
          alt={translation.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {translation.description}
        </p>
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <p className="text-2xl font-bold text-green-600">
              ${deal.discountedPrice}
            </p>
            <p className="text-gray-500 line-through">
              ${deal.originalPrice}
            </p>
          </div>
          <a
            href={deal.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Get Deal
          </a>
        </div>
      </div>
    </div>
  );
}
