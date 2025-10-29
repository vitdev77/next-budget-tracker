import * as React from 'react';
import { cn } from '@/lib/utils';

function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('container mx-auto px-6 md:px-8', className)}>
      {children}
    </div>
  );
}

export default Container;
