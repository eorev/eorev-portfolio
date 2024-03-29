// After adjustments, assuming `cn` is a function for className concatenations.
import React from 'react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background font-sans antialiased")}>
      {children}
    </div>
  );
}
