import { Metadata } from 'next';
import { dealsAPI } from '@/lib/api';
import DealPageClient from '@/components/DealPageClient';
import { initialDeals } from '@/store/mockData';

interface Props {
  params: { id: string };
}

// Generate metadata for the page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Try to fetch the deal from API
  let deal;
  try {
    deal = await dealsAPI.getDealById(params.id);
  } catch (error) {
    // Fallback to hard-coded data if API fails
    deal = initialDeals.find(d => d.id === params.id);
  }

  if (!deal) {
    return {
      title: 'Deal Not Found | DealFinder',
      description: 'The deal you are looking for could not be found.'
    };
  }

  return {
    title: `${deal.title} | DealFinder`,
    description: deal.description,
    openGraph: {
      title: `${deal.title} | DealFinder`,
      description: deal.description,
      images: [deal.imageUrl],
    },
  };
}

// This is a Server Component that fetches data on the server
export default async function DealPage({ params }: Props) {
  const { id } = params;
  
  // Try to fetch deal from API first
  let initialDeal = null;
  try {
    initialDeal = await dealsAPI.getDealById(id);
  } catch (error) {
    // Fallback to hard-coded data if API fails
    initialDeal = initialDeals.find(deal => deal.id === id) || null;
  }

  // Pass the pre-fetched deal to the client component
  return <DealPageClient id={id} initialDeal={initialDeal} />;
}
