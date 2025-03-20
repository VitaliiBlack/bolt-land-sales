import { useEffect, useState } from 'react';
import { useDeals } from '@/store/dealStore';
import DealCard from '@/components/DealCard';
import { Deal } from '@/types';
import { useCategory } from '@/context/CategoryContext';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const { deals, fetchDeals } = useDeals();
  const { selectedCategory } = useCategory();
  const { language } = useLanguage();
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  useEffect(() => {
    setFilteredDeals(
      deals.filter(deal => 
        selectedCategory === 'all' ? true : deal.category === selectedCategory
      )
    );
  }, [deals, selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDeals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  );
}
