'use client';

import { ArrowLeft, ChartArea, Plus, Settings2 } from 'lucide-react';
import RoundedButton from '@/components/RoundedButton';
import DiaryCalendar from '@/components/DiaryCalendar';
import Image from 'next/image';

function Page({}) {
  return (
    <section className="mainContainer flex flex-col justify-between gap-5">
      <nav className="flex justify-between items-center">
        <RoundedButton href="/">
          <ArrowLeft size={24} />
        </RoundedButton>

        <h2 className="headingSecondary">Дневник</h2>

        <RoundedButton href="/profile">
          <Settings2 size={24} />
        </RoundedButton>
      </nav>

      <div className="flex flex-col h-full gap-24">
        <DiaryCalendar
          events={{
            '2025-05-15': true,
            '2025-05-12': true,
          }}
          onDateSelect={date => console.log('Selected date:', date)}
        />

        <div className="absolute top-1/2 left-1/2 -translate-1/2 flex flex-col items-center w-full gap-4">
          <Image src="/img-prototype.png" width={200} height={200} alt="diary" />
          <h1 className="headingMain">Добавьте запись</h1>
        </div>
      </div>

      <footer className="flex justify-between">
        <RoundedButton href="/">
          <ChartArea size={36} />
        </RoundedButton>

        <RoundedButton href="/profile">
          <Plus size={36} />
        </RoundedButton>
      </footer>
    </section>
  );
}

export default Page;
