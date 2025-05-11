'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

type TMultiSelectScrollProps = {
  optionsArr: string[];
};

function MultiSelectScroll({ optionsArr }: TMultiSelectScrollProps) {
  return (
    <ScrollArea className="h-96 my-10 w-full rounded-md border">
      <article className="p-4">
        <ul>
          <RadioGroup defaultValue={optionsArr[0]}>
            {optionsArr.map(option => (
              <li key={option}>
                <div className="flex items-center space-x-2 my-3">
                  <RadioGroupItem onClick={() => console.log(option)} value={option} id={option} />
                  <Label className="w-full h-full" htmlFor={option}>
                    {option}
                  </Label>
                </div>

                <Separator />
              </li>
            ))}
          </RadioGroup>
        </ul>
      </article>
    </ScrollArea>
  );
}

export default MultiSelectScroll;
