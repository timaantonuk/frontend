type TStepProps = {
  isActive: boolean;
};

function Step({ isActive }: TStepProps) {
  return (
    <div
      className={`h-[0.5rem] w-auto ${isActive ? 'bg-red-600' : 'bg-rose-950'} rounded-xl flex-1 min-w-0`}
    >
      &nbsp;
    </div>
  );
}

export default Step;
