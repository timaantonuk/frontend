'use client';

import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';

type TSkipBtnProps = {
  to: string;
};

function GoBackBtn({ to }: TSkipBtnProps) {
  return (
    <Button onClick={() => redirect(`${to}`)} variant="ghost" className="self-end">
      Назад
    </Button>
  );
}

export default GoBackBtn;
