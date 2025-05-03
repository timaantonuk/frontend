'use client';

import SkipBtn from '@/components/SkipBtn';
import Step from '@/components/ui/step';
import DiaryOnboardingContent from '@/components/DiaryOnboardingContent';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const slidesArr = [
  {
    isActive: true,
    description:
      'Дневник автоматических мыслей помогает обнаружить негативные мысли, чувства и убеждения, а затем переоценить их и заменить на более рациональные',
    imageSrc: '/img-prototype.png',
  },
  {
    isActive: false,
    description:
      'Вспомните и запишите ситуацию максимально подробно и объективно, без каких-либо интерпретаций и оценок',
    imageSrc: '/img-prototype.png',
  },
  {
    isActive: false,
    description:
      'Определите автоматические мысли. Постарайтесь точно вспомнить и записать убеждения, мысли, интерпретации, которые возникли у вас в момент ситуации',
    imageSrc: '/img-prototype.png',
  },
  {
    isActive: false,
    description: 'Выберите подходящие эмоции от ситуации и оцените их силу по шкале от 1 до 10',
    imageSrc: '/img-prototype.png',
  },
  {
    isActive: false,
    description:
      'Поставьте убеждения под сомнение, а затем оспорьте их. Внимательно проанализируйте записанные убеждения',
    imageSrc: '/img-prototype.png',
  },
  {
    isActive: false,
    description:
      'Используются ли какие-либо когнитивные искажения? Выберите из  списка самых распространенных когнитивных искажений',
    imageSrc: '/img-prototype.png',
  },
  {
    isActive: false,
    description:
      'Теперь нужно создать новые, более рациональные и конструктивные убеждения. Они должны лучше соответствовать реальности и заменять старые деструктивные',
    imageSrc: '/img-prototype.png',
  },
  {
    isActive: false,
    description:
      'Важно помнить, что ваше восприятие события не является верным или неверным, оно – отражение вашего опыта и знания о себе и о мире, и всегда субъективно',
    imageSrc: '/img-prototype.png',
  },
  {
    isActive: false,
    description:
      'Наработка навыка отделять нейтральные факты от эмоций, а мысли – от действий позволит снизить накал «негативных» чувств и принимать более взвешенные решения в своей жизни',
    imageSrc: '/img-prototype.png',
  },
];

function Page({}) {
  const [allSlides, setAllSlides] = useState(slidesArr);

  const slideToShow = (
    <AnimatePresence mode="wait">
      {allSlides.map(slide =>
        slide.isActive ? (
          <motion.div
            key={slide.description}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <DiaryOnboardingContent {...slide} />
          </motion.div>
        ) : null
      )}
    </AnimatePresence>
  );

  const handleButtonClick = () => {
    setAllSlides(prevSlides => {
      const activeIndex = prevSlides.findIndex(slide => slide.isActive);

      if (activeIndex === prevSlides.length - 1) return prevSlides;

      return prevSlides.map((slide, index) => {
        if (index === activeIndex) return { ...slide, isActive: false };
        if (index === activeIndex + 1) return { ...slide, isActive: true };
        return slide;
      });
    });
  };

  return (
    <section className="mainContainer flex flex-col gap-10 overflow-x-hidden">
      <SkipBtn onClickFn={() => console.log('123')} />

      <div className="flex gap-1 w-full ">
        {allSlides.map(el => (
          <Step isActive={el.isActive} key={el.description} />
        ))}
      </div>

      {slideToShow}

      <Button onClick={handleButtonClick}>Далее</Button>
    </section>
  );
}

export default Page;
