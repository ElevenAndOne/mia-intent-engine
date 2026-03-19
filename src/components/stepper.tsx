type StepConfig = {
  id: string;
  label: string;
};

type StepperProps = {
  steps: StepConfig[];
  currentIndex: number;
  completedSteps: Set<string>;
};

export function Stepper({ steps, currentIndex, completedSteps }: StepperProps) {
  return (
    <nav className="flex items-center gap-2">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.has(step.id);
        const isCurrent = index === currentIndex;

        const circleClass = isCompleted
          ? 'bg-blue-600 text-white'
          : isCurrent
            ? 'border-2 border-blue-600 text-blue-600'
            : 'border border-gray-300 text-gray-400';

        const labelClass = isCurrent ? 'font-medium text-gray-900' : 'text-gray-500';
        const lineClass = isCompleted || isCurrent ? 'bg-blue-400' : 'bg-gray-200';

        return (
          <div key={step.id} className="flex items-center gap-2">
            {index > 0 && <div className={`h-px w-8 ${lineClass}`} />}
            <div className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${circleClass}`}>
                {isCompleted ? '\u2713' : index + 1}
              </div>
              <span className={`hidden text-sm sm:inline ${labelClass}`}>
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
