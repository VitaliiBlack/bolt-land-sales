import { Suspense } from 'react';
import { DealsList } from '@/components/DealsList';
import { CategoryFilter } from '@/components/CategoryFilter';
import { SearchBar } from '@/components/SearchBar';
import { LoadingDeals } from '@/components/LoadingDeals';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SearchBar />
      <CategoryFilter />
      <Suspense fallback={<LoadingDeals />}>
        <DealsList />
      </Suspense>
    </div>
  );
}
