import { NextResponse } from 'next/server';
import { initialDeals } from '@/store/mockData';
import { CategoryType } from '@/types';

// GET handler for all deals or filtered by category
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as CategoryType | null;
    const query = searchParams.get('query') as string | null;
    
    let filteredDeals = [...initialDeals];
    
    // Filter by category if provided
    if (category && category !== 'all') {
      filteredDeals = filteredDeals.filter(deal => deal.category === category);
    }
    
    // Filter by search query if provided
    if (query && query.trim() !== '') {
      const lowercaseQuery = query.toLowerCase();
      filteredDeals = filteredDeals.filter(deal => 
        deal.title.toLowerCase().includes(lowercaseQuery) || 
        deal.description.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    // Simulate delay to mimic real-world API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return NextResponse.json(filteredDeals);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}

// POST handler to create a new deal
export async function POST(request: Request) {
  try {
    const newDeal = await request.json();
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would save to a database
    // For now, we just return the deal with an ID
    // (In reality, this data won't persist since we're not modifying the initial data)
    return NextResponse.json({
      ...newDeal,
      id: crypto.randomUUID()
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    );
  }
}
