import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="mainContainer flex flex-col gap-10">
      <h1 className="headingMain">Depra Prototype</h1>
      <Link href="/onboarding">
        <Button>Onboarding Start</Button>
      </Link>

      <Link href="/onboarding/diary">
        <Button>Onboarding diary</Button>
      </Link>

      <Link href="/diary">
        <Button>Automatic thoughts diary</Button>
      </Link>

      <Link href="/profile">
        <Button>Profile</Button>
      </Link>
    </div>
  );
}
