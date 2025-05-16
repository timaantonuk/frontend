'use client';

import { Button } from '@/components/ui/button';

type TSkipBtnProps = {
  onClickFn: () => void;
};

function SkipBtn({ onClickFn }: TSkipBtnProps) {
  return (
    <Button onClick={onClickFn} variant="ghost" className="self-end">
      Пропустить
    </Button>
  );
}

export default SkipBtn;
