'use client';

import { ThemeProvider } from 'next-themes';

export default function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      themes={['light', 'dark', 'system']}
      storageKey="jaeyguides-theme"
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  );
}