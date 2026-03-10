import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-zinc-950 text-zinc-50 flex flex-col overscroll-none touch-none">
      {/* Safe area top padding for iOS */}
      <div className="w-full h-[env(safe-area-inset-top)] bg-zinc-900 z-50"></div>
      
      <main className="flex-1 relative w-full h-full overflow-hidden">
        {children}
      </main>
      
      {/* Safe area bottom padding for iOS */}
      <div className="w-full h-[env(safe-area-inset-bottom)] bg-zinc-900 z-50"></div>
    </div>
  );
}
