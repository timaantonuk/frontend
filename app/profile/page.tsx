import { Button } from '@/components/ui/button';
import Link from 'next/link';

function Page({}) {
  return (
    <div className="mainContainer flex flex-col gap-10">
      <p>profile settings to be done</p>

      <Link href="/">
        <Button>Home page</Button>
      </Link>
    </div>
  );
}

export default Page;
