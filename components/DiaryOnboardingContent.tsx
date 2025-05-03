import Image from 'next/image';

type TDiaryOnboardingContentProps = {
  description: string;
  imageSrc: string;
};

function DiaryOnboardingContent({ description, imageSrc }: TDiaryOnboardingContentProps) {
  return (
    <article className="flex flex-col gap-10">
      <Image src={imageSrc} alt={description} key={description} width={500} height={250} />

      <p className="min-h-[120px]">{description}</p>
    </article>
  );
}

export default DiaryOnboardingContent;
