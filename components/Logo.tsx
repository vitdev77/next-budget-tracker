import React from 'react';
import Link from 'next/link';
import { PiggyBank } from 'lucide-react';

function Logo() {
  return (
    <Link href={'/'} className="flex items-center gap-2">
      <PiggyBank className="stroke size-11 stroke-amber-500 stroke-[1.5]" />
      <p className="bg-linear-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
        BudgetTracker
      </p>
    </Link>
  );
}

export default Logo;
