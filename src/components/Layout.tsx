import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-claude-bg text-claude-text flex flex-col overscroll-none touch-none">
      <main className="flex-1 relative w-full h-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}
