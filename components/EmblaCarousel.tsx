'use client';

import React, { useCallback } from 'react';
import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel';
import { DotButton, useDotButton } from './EmblaCarouselDotButton';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';

type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
  requireText: boolean;
  heading?: string;
  description?: string;
};

const EmblaCarousel: React.FC<PropType> = props => {
  const { slides, options, requireText, heading, description } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()]);

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    const resetOrStop =
      autoplay.options.stopOnInteraction === false ? autoplay.reset : autoplay.stop;

    resetOrStop();
  }, []);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi, onNavButtonClick);

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map(index => (
            <div className="embla__slide" key={index}>
              <div className="embla__slide__number">{index + 1}</div>
            </div>
          ))}
        </div>
      </div>

      {requireText && (
        <div className="my-10 flex flex-col justify-center gap-5">
          <h1 className="headingMain text-center">{heading}</h1>
          <p className="text-center">{description}</p>
        </div>
      )}

      <div className="embla__controls">
        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'embla__dot'.concat(
                index === selectedIndex ? ' embla__dot--selected' : ''
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;
