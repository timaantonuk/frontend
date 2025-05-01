'use client'

import {Button} from "@/components/ui/button";
import EmblaCarousel from "@/components/EmblaCarousel";
import {EmblaOptionsType} from "embla-carousel";
import {useState} from "react";

const OPTIONS: EmblaOptionsType = { loop: true }
const SLIDE_COUNT = 5
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

function OnboardingPage({}) {

    const [isClicked, setIsClicked] = useState(false);

    const onButtonClick = () => {
        setIsClicked(prevState => true);
        console.log(isClicked);
    }

    return (
       <section>
           <section className='flex flex-col gap-10 h-full justify-between relative transition duration-300 ease-in-out '>

               <Button variant='ghost' className='self-end'>Пропустить</Button>

               <div className='flex flex-col gap-10 justify-center'>
                   <h1 className='text-3xl text-center font-bold'>Depra - приложение для поддержки</h1>
                   <EmblaCarousel slides={SLIDES}/>
               </div>


               <Button onClick={onButtonClick}>
                   Далее
               </Button>

           </section>


           <section className={`w-full h-screen absolute z-10 top-0 left-[100%] hidden  bg-green-500 ${isClicked ? 'slidingAnimation' : ''}`}>
               <div>123 depra</div>
           </section>

       </section>


    );
}

export default OnboardingPage;