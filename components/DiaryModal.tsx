import { motion } from 'framer-motion';
import { ArrowLeft, FileQuestion, Plus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

function DiaryModal({}) {
  return (
    <motion.section
      className="bg-red-400 mainContainer absolute z-50 top-0 left-0 w-full h-full flex flex-col gap-5"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 80, damping: 20 }}
    >
      <div className="flex justify-between items-center">
        <button className="bg-secondary p-2 rounded-full">
          <ArrowLeft size={24} />
        </button>

        <h1 className="headingSecondary">Ситуация</h1>

        <button className="bg-secondary p-2 rounded-full">
          <p className="text-[24px] w-[24px] h-[24px] leading-[24px] text-center">?</p>
        </button>
      </div>

      <Progress value={15} />

      <Textarea placeholder="Type your message here." className="resize-none w-full h-full" />
    </motion.section>
  );
}

export default DiaryModal;
