'use client';

import { Button } from '@/components/ui/button';
import EmblaCarousel from '@/components/EmblaCarousel';
import { EmblaOptionsType } from 'embla-carousel';
import { useState } from 'react';
import Image from 'next/image';
import SkipBtn from '@/components/SkipBtn';
import Link from 'next/link';

// test options and setting below

const OPTIONS: EmblaOptionsType = { loop: true };
const SLIDE_COUNT = 5;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

function OnboardingPage({}) {
  const [isClicked, setIsClicked] = useState(false);

  const onButtonClick = () => {
    setIsClicked(true);
    console.log(isClicked);
  };

  return (
    <section>
      <article className="relative flex h-full flex-col justify-between gap-10 transition duration-300 ease-in-out">
        <SkipBtn onClickFn={onButtonClick} />

        <div className="flex flex-col justify-center gap-10">
          <EmblaCarousel
            slides={SLIDES}
            options={OPTIONS}
            requireText={true}
            heading="Depra - приложение для поддержки"
            description="bla-bla-bla-bla-bla-bla-bla-bla"
          />
        </div>

        <Button onClick={onButtonClick}>Далее</Button>
      </article>

      <article
        className={`mainContainer bg-secondary absolute top-0 left-[100%] z-10 hidden h-screen w-full ${isClicked ? 'slidingAnimation' : ''}`}
      >
        <Image
          src="/img-prototype.png"
          alt="depra image"
          width={500}
          height={500}
          className="mb-24"
        />
        <h1 className="headingMain mb-10">Обретите душевный покой с Depra</h1>

        <div className="flex justify-center gap-5">
          <Button className="w-1/2">
            <Link href="/login">Вход</Link>
          </Button>
          <Button className="w-1/2" variant="outline">
            <Link href="/register">Регистрация</Link>
          </Button>
        </div>
      </article>
    </section>
  );
}

export default OnboardingPage;
