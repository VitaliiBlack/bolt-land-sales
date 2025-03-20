import { NextResponse } from 'next/server';
import { initialDeals } from '@/store/mockData';

// GET handler for a specific deal by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Find the deal by ID
    const deal = initialDeals.find(deal => deal.id === id);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(deal);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch deal' },
      { status: 500 }
    );
  }
}

// PATCH handler to update a deal
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const updates = await request.json();
    
    // Find the deal by ID
    const dealIndex = initialDeals.findIndex(deal => deal.id === id);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    if (dealIndex === -1) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }
    
    // In a real app, this would update a database
    // Here we just return the updated deal (which doesn't persist)
    const updatedDeal = {
      ...initialDeals[dealIndex],
      ...updates
    };
    
    return NextResponse.json(updatedDeal);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update deal' },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a deal
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Find the deal by ID
    const dealExists = initialDeals.some(deal => deal.id === id);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!dealExists) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }
    
    // In a real app, this would delete from a database
    // Here we just return success (which doesn't persist)
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete deal' },
      { status: 500 }
    );
  }
}
