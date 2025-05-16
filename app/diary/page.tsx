'use client';

import { ArrowLeft, ChartArea, Plus, Settings2 } from 'lucide-react';
import RoundedButton from '@/components/RoundedButton';
import DiaryCalendar from '@/components/DiaryCalendar';

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

      <div>
        <DiaryCalendar
          events={{
            '2025-05-15': true,
            '2025-05-12': true,
          }}
          onDateSelect={date => console.log('Selected date:', date)}
        />
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
