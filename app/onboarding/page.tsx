import {Button} from "@/components/ui/button";

function OnboardingPage({}) {
    return (
        <section className='flex flex-col gap-10 h-full justify-between'>

            <Button variant='ghost' className='self-end'>Пропустить</Button>

            <div className='w-full h-[200px] bg-red-600'>
                slider
            </div>

            <Button>
                Далее
            </Button>

        </section>
    );
}

export default OnboardingPage;