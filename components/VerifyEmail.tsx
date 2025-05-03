'use client';

import { InputOTPPattern } from '@/components/InputOTPPattern';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

function VerifyEmail({}) {
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    if (timer < 1) return;

    const timerId = setInterval(() => {
      setTimer(prevTimer => prevTimer - 1);
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [timer]);

  const handleButtonClick = () => {
    setTimer(10);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <h1 className="headingMain">Введите код</h1>
      <InputOTPPattern />

      <p>Отправить код повторно через 00:{timer > 9 ? timer : `0${timer}`}</p>

      <Button onClick={handleButtonClick} variant="secondary">
        Отправить повторно
      </Button>
    </div>
  );
}

export default VerifyEmail;
