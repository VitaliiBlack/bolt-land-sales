// API utility functions for dealing with the backend

// Base URL for API calls
const API_BASE_URL = '/api';

// Generic fetch function with error handling
async function fetchAPI<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API request failed with status ${response.status}`);
  }
  
  return response.json();
}

// API functions for deals
export const dealsAPI = {
  // Get all deals or filtered by category
  getDeals: (category?: string, query?: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (query) params.append('query', query);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return fetchAPI(`/deals${queryString}`);
  },
  
  // Get a single deal by ID
  getDealById: (id: string) => {
    return fetchAPI(`/deals/${id}`);
  },
  
  // Create a new deal
  createDeal: (dealData: any) => {
    return fetchAPI('/deals', {
      method: 'POST',
      body: JSON.stringify(dealData),
    });
  },
  
  // Update an existing deal
  updateDeal: (id: string, dealData: any) => {
    return fetchAPI(`/deals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(dealData),
    });
  },
  
  // Delete a deal
  deleteDeal: (id: string) => {
    return fetchAPI(`/deals/${id}`, {
      method: 'DELETE',
    });
  },
};
