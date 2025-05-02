import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col gap-10">
      <h1 className="headingMain">Depra Prototype</h1>
      <Link href="/onboarding">
        <Button>Onboarding Start</Button>
      </Link>
    </div>
  );
}
