'use client';

import Link from 'next/link';
import { Terminal } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b bg-background sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Terminal className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-lg">CodeChallenge</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm hover:text-primary transition-colors">
            Problems
          </Link>
          <Link href="/login" className="text-sm hover:text-primary transition-colors">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
