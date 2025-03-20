'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { CategoryProvider } from '@/context/CategoryContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <AuthProvider>
          <CategoryProvider>
            {children}
          </CategoryProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
