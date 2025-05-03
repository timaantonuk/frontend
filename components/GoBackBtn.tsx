'use client';

import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';

type TSkipBtnProps = {
  to: string;
};

function SkipBtn({ to }: TSkipBtnProps) {
  return (
    <Button onClick={() => redirect(`${to}`)} variant="ghost" className="self-end">
      Назад
    </Button>
  );
}

export default SkipBtn;
