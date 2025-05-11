'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

type TSkipBtnProps = {
  to: string;
};

function GoBackBtn({ to }: TSkipBtnProps) {
  const router = useRouter();

  return (
    <Button onClick={() => router.push(`${to}`)} variant="ghost" className="self-end">
      Назад
    </Button>
  );
}

export default GoBackBtn;
