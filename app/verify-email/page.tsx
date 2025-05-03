import GoBackBtn from '@/components/GoBackBtn';
import VerifyEmail from '@/components/VerifyEmail';

function Page({}) {
  return (
    <section className="mainContainer flex flex-col gap-5">
      <GoBackBtn to="/" />
      <VerifyEmail />
    </section>
  );
}

export default Page;
