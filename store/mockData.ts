import { Deal } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Generate consistent GUIDs for each deal
export const getGuid = (id: number): string => {
  // Using specific GUIDs for consistent links across sessions
  const guidMap: Record<number, string> = {
    1: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    2: '38a1c553-4d6a-454e-8a7f-c92f9f6f7417',
    3: 'b6b8d83a-6496-4724-9ebe-88dcc3bd31a8',
    4: '7f4c6c9d-d890-4b64-8d78-7e9e8e073a60',
    5: 'dfe6e8c7-a953-4a93-8e56-7fb7da54114c',
    6: '5a97c982-cd23-48e0-b9bb-cf26ce888162',
    7: '0ecbb542-6868-4029-a23b-a5a8c9c307b1',
    8: '47b875e2-eb6a-4379-9c0b-5242ea723206',
    9: 'b5c88e56-996d-4b2d-a32d-697b3e582fc9',
    10: 'f2531a37-deb7-458c-8d3a-5865a1b26efe',
    11: '9b6f9a28-7b2a-4b0c-9f17-123c94576abf',
    12: 'af8f2a9d-4c3b-4b71-a6a7-d5ef9b9a0497'
  };
  
  return guidMap[id] || uuidv4();
};

export const initialDeals: Deal[] = [
  {
    id: getGuid(1),
    title: 'Cyberpunk 2077',
    description: 'Massive discount on the award-winning open-world RPG',
    originalPrice: 59.99,
    discountedPrice: 29.99,
    discountPercentage: 50,
    imageUrl: 'https://images.unsplash.com/photo-1591776060850-2592fe776f5b?q=80&w=1000&auto=format&fit=crop',
    category: 'games',
    source: 'Steam',
    link: 'https://store.steampowered.com',
    date: '2025-05-10'
  },
  {
    id: getGuid(2),
    title: 'Wireless Earbuds',
    description: 'High-quality noise cancelling earbuds at a bargain price',
    originalPrice: 129.99,
    discountedPrice: 69.99,
    discountPercentage: 46,
    imageUrl: 'https://images.unsplash.com/photo-1606220588913-6fba7970ad07?q=80&w=1000&auto=format&fit=crop',
    category: 'electronics',
    source: 'AliExpress',
    link: 'https://aliexpress.com',
    date: '2025-05-15'
  },
  {
    id: getGuid(3),
    title: 'Pizza Delivery Discount',
    description: 'Get 30% off your next pizza order with this coupon',
    originalPrice: 20.00,
    discountedPrice: 14.00,
    discountPercentage: 30,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop',
    category: 'food',
    source: 'Local Restaurant',
    link: 'https://example.com/pizza',
    date: '2025-05-12'
  },
  {
    id: getGuid(4),
    title: 'Smartwatch Pro',
    description: 'Latest smartwatch with fitness tracking and long battery life',
    originalPrice: 199.99,
    discountedPrice: 149.99,
    discountPercentage: 25,
    imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1000&auto=format&fit=crop',
    category: 'electronics',
    source: 'AliExpress',
    link: 'https://aliexpress.com',
    date: '2025-05-18'
  },
  {
    id: getGuid(5),
    title: 'The Witcher 3: Wild Hunt',
    description: 'Epic fantasy RPG now with massive discount',
    originalPrice: 39.99,
    discountedPrice: 9.99,
    discountPercentage: 75,
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop',
    category: 'games',
    source: 'Steam',
    link: 'https://store.steampowered.com',
    date: '2025-05-14'
  },
  {
    id: getGuid(6),
    title: 'Coffee Shop Gift Card',
    description: 'Buy one get one free on premium coffee',
    originalPrice: 10.00,
    discountedPrice: 5.00,
    discountPercentage: 50,
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1000&auto=format&fit=crop',
    category: 'food',
    source: 'Local Cafe',
    link: 'https://example.com/coffee',
    date: '2025-05-20'
  },
  {
    id: getGuid(7),
    title: 'Winter Jacket',
    description: 'Warm and stylish winter jacket, perfect for cold weather',
    originalPrice: 89.99,
    discountedPrice: 49.99,
    discountPercentage: 44,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop',
    category: 'products',
    source: 'AliExpress',
    link: 'https://aliexpress.com',
    date: '2025-05-11'
  },
  {
    id: getGuid(8),
    title: 'Red Dead Redemption 2',
    description: 'Epic western adventure game on sale',
    originalPrice: 59.99,
    discountedPrice: 29.99,
    discountPercentage: 50,
    imageUrl: 'https://images.unsplash.com/photo-1608229622183-777011092484?q=80&w=1000&auto=format&fit=crop',
    category: 'games',
    source: 'Steam',
    link: 'https://store.steampowered.com',
    date: '2025-05-16'
  },
  {
    id: getGuid(9),
    title: 'Phone Tripod Stand',
    description: 'Adjustable tripod for smartphones, perfect for photos and videos',
    originalPrice: 24.99,
    discountedPrice: 12.99,
    discountPercentage: 48,
    imageUrl: 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?q=80&w=1000&auto=format&fit=crop',
    category: 'electronics',
    source: 'AliExpress',
    link: 'https://aliexpress.com',
    date: '2025-05-13'
  },
  {
    id: getGuid(10),
    title: 'Burger Meal Coupon',
    description: 'Family meal deal with 30% discount',
    originalPrice: 35.00,
    discountedPrice: 24.50,
    discountPercentage: 30,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000&auto=format&fit=crop',
    category: 'food',
    source: 'Fast Food Chain',
    link: 'https://example.com/burger',
    date: '2025-05-19'
  },
  {
    id: getGuid(11),
    title: 'Bluetooth Speaker',
    description: 'Portable waterproof speaker with amazing sound',
    originalPrice: 79.99,
    discountedPrice: 39.99,
    discountPercentage: 50,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1000&auto=format&fit=crop',
    category: 'electronics',
    source: 'AliExpress',
    link: 'https://aliexpress.com',
    date: '2025-05-21'
  },
  {
    id: getGuid(12),
    title: 'Backpack',
    description: 'Multi-functional travel backpack with USB charging port',
    originalPrice: 45.99,
    discountedPrice: 25.99,
    discountPercentage: 43,
    imageUrl: 'https://images.unsplash.com/photo-1622560480654-d96214fdc887?q=80&w=1000&auto=format&fit=crop',
    category: 'products',
    source: 'AliExpress',
    link: 'https://aliexpress.com',
    date: '2025-05-17'
  }
];
