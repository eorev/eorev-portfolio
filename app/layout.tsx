import React from 'react';
import type { ReactNode } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

import { cn } from '@/lib/utils';

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background font-sans antialiased")}>
      {children}
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
