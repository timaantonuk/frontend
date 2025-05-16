'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';

type TRoundedButtonProps = {
  children: ReactNode;
  href: string;
};

function RoundedButton({ children, href }: TRoundedButtonProps) {
  return (
    <Link href={href}>
      <button className="bg-secondary p-2 rounded-full">{children}</button>
    </Link>
  );
}

export default RoundedButton;
