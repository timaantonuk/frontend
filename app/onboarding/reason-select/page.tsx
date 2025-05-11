import MultiSelectScroll from '@/components/MultiSelectScroll';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const reasonsArr = [
  'reason 1',
  'reason 2',
  'reason 3',
  'reason 4',
  'reason 5',
  'reason 6',
  'reason 7',
  'reason 8',
  'reason 9',
  'reason 10',
];

function Page({}) {
  return (
    <section className="mainContainer flex flex-col justify-center">
      <h1 className="headingMain">Что вас беспокоит?</h1>

      <MultiSelectScroll optionsArr={reasonsArr} />

      <div className="flex gap-3 justify-center w-full">
        <Button variant="secondary" asChild className="w-1/2">
          <Link href="/onboarding/start-proposition">Пропустить</Link>
        </Button>

        <Button variant="secondary" asChild className="w-1/2">
          <Link href="/onboarding/start-proposition">Подтвердить</Link>
        </Button>
      </div>
    </section>
  );
}

export default Page;
