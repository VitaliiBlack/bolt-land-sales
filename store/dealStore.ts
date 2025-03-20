'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Deal, CategoryType } from '@/types';
import { initialDeals } from './mockData';
import { dealsAPI } from '@/lib/api';

// Define the store's state and methods
interface DealStore {
  // State
  deals: Deal[];
  isLoading: boolean;
  error: string | null;
  
  // API methods that use the API endpoints when possible
  fetchDeals: () => Promise<Deal[]>;
  getDealById: (id: string) => Promise<Deal | undefined>;
  createDeal: (dealData: Omit<Deal, 'id'>) => Promise<Deal>;
  updateDeal: (id: string, dealData: Partial<Deal>) => Promise<Deal | null>;
  deleteDeal: (id: string) => Promise<boolean>;
  
  // Filter methods
  filterDealsByCategory: (category: CategoryType) => Promise<Deal[]>;
  searchDeals: (query: string) => Promise<Deal[]>;
  
  // Reset store (useful for testing)
  resetStore: () => void;
}

// Helper function to simulate API delay for client-side fallbacks
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Create the store with persisted state
export const useDealStore = create<DealStore>()(
  persist(
    (set, get) => ({
      deals: initialDeals,
      isLoading: false,
      error: null,
      
      // Fetch all deals
      fetchDeals: async () => {
        set({ isLoading: true, error: null });
        try {
          // Try to fetch from API first
          const dealsFromAPI = await dealsAPI.getDeals().catch(() => null);
          
          if (dealsFromAPI) {
            set({ 
              isLoading: false,
              deals: dealsFromAPI 
            });
            return dealsFromAPI;
          }
          
          // Fallback to client-side data if API fails
          await delay(300);
          set(state => ({ 
            isLoading: false,
            deals: state.deals 
          }));
          
          return get().deals;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
          return [];
        }
      },
      
      // Get deal by ID
      getDealById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          // Try to fetch from API first
          const dealFromAPI = await dealsAPI.getDealById(id).catch(() => null);
          
          if (dealFromAPI) {
            set({ isLoading: false });
            return dealFromAPI;
          }
          
          // Fallback to client-side data if API fails
          await delay(200);
          
          const deal = get().deals.find(deal => deal.id === id);
          set({ isLoading: false });
          
          return deal;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
          return undefined;
        }
      },
      
      // Create a new deal
      createDeal: async (dealData: Omit<Deal, 'id'>) => {
        set({ isLoading: true, error: null });
        try {
          // Try to use API first
          const newDealFromAPI = await dealsAPI.createDeal(dealData).catch(() => null);
          
          if (newDealFromAPI) {
            set(state => ({
              isLoading: false,
              deals: [...state.deals, newDealFromAPI]
            }));
            return newDealFromAPI;
          }
          
          // Fallback to client-side if API fails
          await delay(500);
          
          const newDeal: Deal = {
            ...dealData,
            id: uuidv4()
          };
          
          set(state => ({
            isLoading: false,
            deals: [...state.deals, newDeal]
          }));
          
          return newDeal;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
          throw error;
        }
      },
      
      // Update an existing deal
      updateDeal: async (id: string, dealData: Partial<Deal>) => {
        set({ isLoading: true, error: null });
        try {
          // Try to use API first
          const updatedDealFromAPI = await dealsAPI.updateDeal(id, dealData).catch(() => null);
          
          if (updatedDealFromAPI) {
            set(state => ({
              isLoading: false,
              deals: state.deals.map(deal => 
                deal.id === id ? updatedDealFromAPI : deal
              )
            }));
            return updatedDealFromAPI;
          }
          
          // Fallback to client-side if API fails
          await delay(400);
          
          let updatedDeal: Deal | null = null;
          
          set(state => {
            const updatedDeals = state.deals.map(deal => {
              if (deal.id === id) {
                updatedDeal = { ...deal, ...dealData };
                return updatedDeal;
              }
              return deal;
            });
            
            return {
              isLoading: false,
              deals: updatedDeals
            };
          });
          
          return updatedDeal;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
          return null;
        }
      },
      
      // Delete a deal
      deleteDeal: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          // Try to use API first
          const deleteResult = await dealsAPI.deleteDeal(id).catch(() => null);
          
          if (deleteResult) {
            set(state => ({
              isLoading: false,
              deals: state.deals.filter(deal => deal.id !== id)
            }));
            return true;
          }
          
          // Fallback to client-side if API fails
          await delay(300);
          
          set(state => ({
            isLoading: false,
            deals: state.deals.filter(deal => deal.id !== id)
          }));
          
          return true;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
          return false;
        }
      },
      
      // Filter deals by category
      filterDealsByCategory: async (category: CategoryType) => {
        set({ isLoading: true, error: null });
        try {
          // Try to fetch from API first with category filter
          const dealsFromAPI = await dealsAPI.getDeals(category).catch(() => null);
          
          if (dealsFromAPI) {
            set({ isLoading: false });
            return dealsFromAPI;
          }
          
          // Fallback to client-side filtering if API fails
          await delay(200);
          
          let filteredDeals: Deal[];
          
          if (category === 'all') {
            filteredDeals = get().deals;
          } else {
            filteredDeals = get().deals.filter(deal => deal.category === category);
          }
          
          set({ isLoading: false });
          return filteredDeals;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
          return [];
        }
      },
      
      // Search deals
      searchDeals: async (query: string) => {
        set({ isLoading: true, error: null });
        try {
          // Try to fetch from API first with search query
          const dealsFromAPI = await dealsAPI.getDeals(undefined, query).catch(() => null);
          
          if (dealsFromAPI) {
            set({ isLoading: false });
            return dealsFromAPI;
          }
          
          // Fallback to client-side search if API fails
          await delay(200);
          
          if (!query.trim()) {
            set({ isLoading: false });
            return get().deals;
          }
          
          const lowercaseQuery = query.toLowerCase();
          const searchResults = get().deals.filter(deal => 
            deal.title.toLowerCase().includes(lowercaseQuery) || 
            deal.description.toLowerCase().includes(lowercaseQuery)
          );
          
          set({ isLoading: false });
          return searchResults;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
          return [];
        }
      },
      
      // Reset store to initial state
      resetStore: () => {
        set({
          deals: initialDeals,
          isLoading: false,
          error: null
        });
      }
    }),
    {
      name: 'deal-store', // localStorage key
      partialize: (state) => ({ deals: state.deals }), // Only persist the deals
      skipHydration: typeof window === 'undefined' // Skip hydration during SSR
    }
  )
);

// Hooks for common operations to simplify component code
export const useDeals = () => {
  const fetchDeals = useDealStore(state => state.fetchDeals);
  const deals = useDealStore(state => state.deals);
  const isLoading = useDealStore(state => state.isLoading);
  const error = useDealStore(state => state.error);
  
  return { deals, fetchDeals, isLoading, error };
};

export const useDealById = (id: string | undefined) => {
  const getDealById = useDealStore(state => state.getDealById);
  const isLoading = useDealStore(state => state.isLoading);
  const error = useDealStore(state => state.error);
  
  return { getDealById, isLoading, error };
};
