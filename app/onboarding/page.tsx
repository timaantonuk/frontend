'use client'

import {Button} from "@/components/ui/button";
import EmblaCarousel from "@/components/EmblaCarousel";
import {EmblaOptionsType} from "embla-carousel";
import {useState} from "react";
import Image from "next/image";
import SkipBtn from "@/components/SkipBtn";
import Link from "next/link";


// test options and setting below

const OPTIONS: EmblaOptionsType = {loop: true}
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
            <article
                className='flex flex-col gap-10 h-full justify-between relative transition duration-300 ease-in-out '>

                <SkipBtn onClickFn={onButtonClick}/>

                <div className='flex flex-col gap-10 justify-center'>

                    <EmblaCarousel
                        slides={SLIDES}
                        requireText={true}
                        heading='Depra - приложение для поддержки'
                        description='bla-bla-bla-bla-bla-bla-bla-bla'
                    />

                </div>


                <Button onClick={onButtonClick}>
                    Далее
                </Button>

            </article>


            <article
                className={`w-full mainContainer h-screen absolute z-10 top-0 left-[100%] bg-secondary hidden ${isClicked ? 'slidingAnimation' : ''}`}>

                <Image src='/img-prototype.png' alt='depra image' width={500} height={500} className='mb-24'/>
                <h1 className='headingMain mb-10'>Обретите душевный покой с Depra</h1>

                <div className='flex justify-center gap-5'>
                    <Button className='w-1/2'>
                        <Link href='/login'>
                            Вход
                        </Link>
                    </Button>
                    <Button className='w-1/2' variant='outline'>
                        <Link href='/register'>Регистрация</Link>
                    </Button>
                </div>

            </article>

        </section>


    );
}

export default OnboardingPage;