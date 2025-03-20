export interface Translation {
  title: string;
  description: string;
}

export interface DealMedia {
  type: 'image' | 'video';
  url: string;
  isPrimary?: boolean;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  imageUrl: string;
  category: 'games' | 'food' | 'products' | 'electronics' | 'other';
  source: string;
  link: string;
  date: string;
  // Multilingual and media additions
  translations?: {
    [key: string]: Translation;
  };
  media?: DealMedia[];
}

export type CategoryType = Deal['category'] | 'all';

export interface User {
  email: string;
  isAdmin: boolean;
}
